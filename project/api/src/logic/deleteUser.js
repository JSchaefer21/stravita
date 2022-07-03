const { User } = require('../models')
const { NotFoundError, AuthError } = require('errors')
const { validateStringNotEmptyNoSpaces, validatePassword } = require('validators')

function deleteUser(userId, password) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    validatePassword(password, 'Password')

    return User.findById(userId)
        .then(user => {
            if (!user)
                throw new NotFoundError(`user with id ${userId} does not exist`)
            
            if (user.password !== password)
                throw new AuthError(`Password is not correct`)

            return User.deleteOne({ _id: userId, passwor: password })
        })
        .then(()=> { })
}

module.exports = deleteUser