const { User, Activity } = require ('../models')
const { NotFoundError } = require ('errors')
const { validateStringNotEmptyNoSpaces } = require('validators')

function retrieveSearchedActivities(userId, search) {
    validateStringNotEmptyNoSpaces(userId, 'user id')

    return User.findById(userId)
        .then((user) => {
            if(!user) throw new NotFoundError(`user with id ${userId} does not exist`)

            const re = new RegExp(search)

            return Activity.find({ private: false, title: { $regex: re , $options: 'i' } }).sort({date: -1}).populate('user', 'name foto').lean()        
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

module.exports = retrieveSearchedActivities