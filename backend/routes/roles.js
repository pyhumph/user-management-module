const express = require('express')
const router = express.Router()
const db = require('../config/db')
const { verifyToken, verifyRole } = require('../middleware/auth')

// GET all roles - admin and manager
router.get('/', verifyToken, verifyRole('admin', 'manager'), (req, res) => {
  db.query('SELECT * FROM roles', (err, results) => {
    if (err) return res.status(500).json({ message: err.message })
    res.json(results)
  })
})

// CREATE role - admin only
router.post('/', verifyToken, verifyRole('admin'), (req, res) => {
  const { name } = req.body
  db.query(
    'INSERT INTO roles (name) VALUES (?)',
    [name],
    (err, results) => {
      if (err) return res.status(500).json({ message: err.message })
      res.status(201).json({ message: 'Role created', id: results.insertId })
    }
  )
})

// UPDATE role - admin only
router.put('/:id', verifyToken, verifyRole('admin'), (req, res) => {
  const { name } = req.body
  db.query(
    'UPDATE roles SET name = ? WHERE id = ?',
    [name, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json({ message: 'Role updated' })
    }
  )
})

// DELETE role - admin only
router.delete('/:id', verifyToken, verifyRole('admin'), (req, res) => {
  db.query(
    'DELETE FROM roles WHERE id = ?',
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json({ message: err.message })
      res.json({ message: 'Role deleted' })
    }
  )
})

module.exports = router