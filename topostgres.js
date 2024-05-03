
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
require('dotenv').config()

const Pool = require('pg').Pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL ,
})
// const pool = new Pool({
//   user: 'me',
//   host: 'localhost',
//   database: 'CommuFund',
//   password: 'password',
//   port: 5432,
// })

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

pool.connect((err) => {
  if (err) throw err
  console.log("Connect to PostgreSQL sucsessfully")
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post('/postPass', async (request, response) => {
  try {
    const username = request.body.username
    const password = request.body.password;
    
    const queri = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
    console.log(queri)
    const result = await pool.query(queri);
    //console.log(result)
    if (result.rows == 0) {
      response.json({ text: 'failed' })
    }
    else{
      response.json({ text: 'success' });
    }
     // Ensure correct property name
  } catch (error) {
    console.error('Error fetching data from database:', error);
    response.status(500).send('Internal Server Error'); // Send appropriate error response
  }
})

app.post('/postRegis', async (request, response) => {
  try {
    const username = request.body.username
    const password = request.body.password;
    const name = request.body.name;
    const number = request.body.number;
    const email = request.body.email;

    
    const queri = `INSERT INTO users (username, password, nama, no_hp, email) VALUE ('${username}', '${password}', '${name}', '${number}', '${email}')`
    console.log(queri)
    const result = await pool.query(queri);
    //console.log(result)
    response.send("Registrasi berhasil")
     // Ensure correct property name
  } catch (error) {
    console.error('Error fetching data from database:', error);
    response.status(500).send('Internal Server Error'); // Send appropriate error response
  }
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})