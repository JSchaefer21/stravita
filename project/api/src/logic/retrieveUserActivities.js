const { User, Activity } = require ('../models')
const { NotFoundError } = require ('errors')
const { validateStringNotEmptyNoSpaces } = require('validators')

function retrieveUserActivities(userId) {
    validateStringNotEmptyNoSpaces(userId, 'user id')

    return User.findById(userId)
        .then((user) => {
            if(!user) throw new NotFoundError(`user with id ${userId} does not exist`)

            return Activity.find({ user: userId }).sort({date: -1}).populate('user', 'name foto').lean()        
        })
        .then((activities)=>{
            activities.forEach(activity => { 
                activity.id = activity._id.toString()
                
                delete activity._id
                delete activity.__v
            })

            return activities
        })      
}

module.exports = retrieveUserActivities