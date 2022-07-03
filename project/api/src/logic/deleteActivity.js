const { User, Activity } = require ('../models')
const { NotFoundError, ConflictError } = require ('errors')
const { validateStringNotEmptyNoSpaces } = require('validators')

function deleteActivity(userId, activityId) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    validateStringNotEmptyNoSpaces(activityId, 'activity id')

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)
            return Activity.findById(activityId)
        })   
        .then((activity) => {
            if(!activity) throw new NotFoundError(`activity with id ${activityId} does not exist`)

            if (activity.user.toString() !== userId) throw new ConflictError(`activity with id ${activityId} does not belong to user with id ${userId}`)

            return Activity.deleteOne({ _id: activityId, user: userId })     
        })
        .then(() => { })     
}

module.exports = deleteActivity