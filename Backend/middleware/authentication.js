// utils/authentication.js
const bcrypt = require('bcrypt');

// Number of salt rounds for hashing
const SALT_ROUNDS = 10;

/**
 * Hashes a plain password.
 * @param {string} plainPassword
 * @returns {Promise<string>} Hashed password
 */
async function hashPassword(plainPassword) {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

/**
 * Compares a plain password with a hashed one.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} Is match
 */
async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword,
};
