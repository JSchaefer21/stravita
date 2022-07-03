const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const { validateStringNotEmptyNoSpaces, validateString } = require('validators')

function createActivity(userId, sport ) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    validateString(sport, 'sport')
    
    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)

            return Activity.create({ user: userId, sport })
        })
        .then(activity => activity.id)
}

module.exports = createActivity