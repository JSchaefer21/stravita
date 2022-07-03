const { User } = require('../models')
const { AuthError } = require('errors')
const { validateString, validatePassword } = require('validators')
const bcrypt = require('bcryptjs')

function authenticateUser(username, password) {
    validateString(username, 'Username')
    validatePassword(password, 'Password')

    return User.findOne({ username })
        .then(user => {
            if (!user)
                throw new AuthError('wrong credentials')

            return bcrypt.compare(password, user.password)
                .then(match => {
                    if (!match)
                        throw new AuthError('wrong credentials')

                    return user.id
                })
        })
}

module.exports = authenticateUser