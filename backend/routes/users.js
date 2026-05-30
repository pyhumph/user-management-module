const express = require('express')
const router = express.Router()
const db = require('../config/db')
const { verifyToken, verifyRole } = require('../middleware/auth')

// GET all users - admin only
router.get('/', verifyToken, verifyRole('admin'), (req, res) => {
  db.query(
    'SELECT users.id, users.name, users.email, users.created_at, roles.name as role FROM users JOIN roles ON users.role_id = roles.id',
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json(results)
    }
  )
})

// GET single user - admin only
router.get('/:id', verifyToken, verifyRole('admin'), (req, res) => {
  db.query(
    'SELECT users.id, users.name, users.email, users.created_at, roles.name as role FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = ?',
    [req.params.id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })
      if (results.length === 0) return res.status(404).json({ message: 'User not found' })
      res.json(results[0])
    }
  )
})

// CREATE user - admin only
router.post('/', verifyToken, verifyRole('admin'), async (req, res) => {
  const { name, email, password, role_id } = req.body
  const bcrypt = require('bcryptjs')
  const hashed = await bcrypt.hash(password, 10)
  db.query(
    'INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)',
    [name, email, hashed, role_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })
      res.status(201).json({ message: 'User created', id: results.insertId })
    }
  )
})

// UPDATE user role - admin only
router.put('/:id/role', verifyToken, verifyRole('admin'), (req, res) => {
  const { role_id } = req.body
  db.query(
    'UPDATE users SET role_id = ? WHERE id = ?',
    [role_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json({ message: 'User role updated' })
    }
  )
})

// DELETE user - admin only
router.delete('/:id', verifyToken, verifyRole('admin'), (req, res) => {
  db.query(
    'DELETE FROM users WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json({ message: 'User deleted' })
    }
  )
})

module.exports = router