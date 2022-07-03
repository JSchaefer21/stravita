const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const { validateStringNotEmptyNoSpaces } = require('validators')

function retrieveActivity(userId, activityId) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    validateStringNotEmptyNoSpaces(activityId, 'activity id')

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)

            return Activity.findById(activityId).populate('comments.user', 'name').lean() 
        })
        .then(activity => {
            if (!activity) throw new NotFoundError(`Activity with id ${activityId} does not exist`)

            activity.id = activity._id.toString()   
            delete activity._id
            delete activity.__v
            
            return activity
        })
}

module.exports = retrieveActivity