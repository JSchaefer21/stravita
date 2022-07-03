const { User } = require('../models')
const { NotFoundError } = require('errors')
const { validateStringNotEmptyNoSpaces ,validateStringNotEmptyOrBlank, validateEmail, validatePassword, validateString } = require('validators')

function updateUserData(userId, name, password, email, foto) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    if (name != null) validateStringNotEmptyOrBlank(name, 'name')
    if (password != null) validatePassword(password, 'password')
    if (email != null)  validateEmail(email, 'email')
    if (foto != null)  validateString(foto, 'foto')

    return User.updateOne({ _id: userId }, { $set: { name, password, email, foto }})
        .then((result) => {
            if (result.matchedCount === 0) 
                throw new NotFoundError(`user with id ${userId} does not exist`)
        })
}

module.exports = updateUserData