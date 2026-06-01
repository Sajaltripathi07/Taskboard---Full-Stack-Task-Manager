

const bcrypt            = require('bcryptjs');
const { v4: uuidv4 }   = require('uuid');
const { queryOne, run } = require('../database/helpers');
const { signToken }     = require('../utils/jwt');

const SALT_ROUNDS = 12;


async function register({ name, email, password }) {
  // Check uniqueness before hashing to give a fast, clear error.
  const existing = queryOne(
    'SELECT id FROM users WHERE email = :email',
    { ':email': email.toLowerCase() }
  );
  if (existing) {
    const err = new Error('An account with that email already exists.');
    err.status = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const id     = uuidv4();
  const now    = new Date().toISOString();

  run(
    `INSERT INTO users (id, name, email, password, created_at, updated_at)
     VALUES (:id, :name, :email, :password, :created_at, :updated_at)`,
    {
      ':id':         id,
      ':name':       name.trim(),
      ':email':      email.toLowerCase(),
      ':password':   hashed,
      ':created_at': now,
      ':updated_at': now,
    }
  );

  const user  = { id, name: name.trim(), email: email.toLowerCase() };
  const token = signToken(user);
  return { user, token };
}


async function login({ email, password }) {
  const row = queryOne(
    'SELECT id, name, email, password FROM users WHERE email = :email',
    { ':email': email.toLowerCase() }
  );

  // Use a constant-time compare even for the "not found" path to avoid
  // timing-based user enumeration.
  const dummyHash = '$2a$12$invalidsaltinvalidsaltinvalidsa';
  const hashToCompare = row ? row.password : dummyHash;
  const match = await bcrypt.compare(password, hashToCompare);

  if (!row || !match) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }

  const user  = { id: row.id, name: row.name, email: row.email };
  const token = signToken(user);
  return { user, token };
}

module.exports = { register, login };
