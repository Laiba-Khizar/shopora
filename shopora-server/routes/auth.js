import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const makeToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const publicUser = (u) => ({ id: u.id, name: u.name, email: u.email })

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ message: 'Name must be at least 2 characters' })
  }
  if (!email || !emailPattern.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address' })
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' })
  }

  try {
    const cleanEmail = email.trim().toLowerCase()

    if (await User.findOne({ email: cleanEmail })) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash: await bcrypt.hash(password, 10),
    })

    res.status(201).json({ token: makeToken(user), user: publicUser(user) })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' })
    }
    console.error(err)
    res.status(500).json({ message: 'Could not create the account' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: (email || '').trim().toLowerCase() })

    // Same message for both cases, so attackers can't tell which part was wrong
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) {
      return res.status(401).json({ message: 'Wrong email or password' })
    }

    res.json({ token: makeToken(user), user: publicUser(user) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Could not log in' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json(req.user)
})

export default router