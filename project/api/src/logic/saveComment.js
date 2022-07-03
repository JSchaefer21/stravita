const { User, Activity, Comment } = require('../models')
const { NotFoundError } = require('errors')
const { validateStringNotEmptyNoSpaces, validateString } = require('validators/src')

function saveComment(userId, activityId, text) {
    validateStringNotEmptyNoSpaces(userId, 'user id')
    validateStringNotEmptyNoSpaces(activityId, 'activity id')
    if (text != null)  validateString(text, 'text')

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)

            return Activity.findById(activityId)
        })
        .then(activity => {
            if (!activity) throw new NotFoundError(`activity with id ${activityId} does not exist`)

            const comment = new Comment({ user: userId, text: text})
            activity.comments.push(comment)

            return activity.save()
                .then(() => {
                    return comment.id
                })
        })
}

module.exports = saveComment