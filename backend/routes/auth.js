const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('../config/db')

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body

  // check if user exists
  db.query(
    'SELECT users.*, roles.name as role_name FROM users JOIN roles ON users.role_id = roles.id WHERE users.email = ?',
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error' })
      if (results.length === 0) return res.status(401).json({ message: 'Invalid email or password' })

      const user = results[0]

      // check password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' })

      // create token
      const token = jwt.sign(
        { id: user.id, role: user.role_name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role_name
        }
      })
    }
  )
})

module.exports = router