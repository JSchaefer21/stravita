const { User, Activity } = require ('../models')
const { validateStringNotEmptyNoSpaces } = require('validators')
const { NotFoundError } = require('errors')

function retrieveActivities(userId) {
    validateStringNotEmptyNoSpaces(userId, 'user id')

    return User.findById(userId)
        .then(user => {
            if (!user) throw new NotFoundError(`user with id ${userId} does not exist`)
    
            return Activity.find({private: false}).sort({date: -1}).populate('user', 'name foto').lean()  
        })     
        .then((activity)=>{
            
            activity.forEach(activity => { 
                activity.id = activity._id.toString()
                
                delete activity._id
                delete activity.__v
            })
            return activity
        })      
}

module.exports = retrieveActivities