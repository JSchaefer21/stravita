const { User } = require('../models')
const { ConflictError } = require('errors')
const { validateStringNotEmptyOrBlank, validateUsername, validatePassword, validateEmail} = require('validators')
const bcrypt = require('bcryptjs')

function registerUser(name, username, password, email) {
    validateStringNotEmptyOrBlank(name, 'name')
    validateUsername(username)
    validatePassword(password)
    validateEmail(email, 'email')

    return bcrypt.hash(password, 10)
        .then(hash => User.create({ name, username, password: hash, email }))
        .then(() => {})
        .catch((error) => {    
            const code = error.code
            if(code === 11000) {
                throw new ConflictError(`user with username ${username} already exists`)
            }
            else {
                throw error
            }            
        })
}

module.exports = registerUser