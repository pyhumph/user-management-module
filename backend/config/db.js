const mysql2 = require('mysql2')
const dotenv = require('dotenv')

dotenv.config()

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5051
})

const connectWithRetry = () => {
  db.connect((err) => {
    if (err) {
      console.log('Database connection failed, retrying in 5 seconds...', err.message)
      setTimeout(connectWithRetry, 5000)
    } else {
      console.log('Connected to MySQL database')
    }
  })
}

connectWithRetry()

module.exports = db