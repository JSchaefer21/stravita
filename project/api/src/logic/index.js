const addPointToActivity = require('./addPointToActivity')
const authenticateUser = require('./authenticateUser')
const createActivity = require('./createActivity')
const deleteActivity = require('./deleteActivity')
const deleteComment = require('./deleteComment')
const deleteUser = require('./deleteUser')
const registerUser = require('./registerUser')
const retrieveActivities = require('./retrieveActivities')
const retrieveActivity = require('./retrieveActivity')
const retrieveSearchedActivities = require('./retrieveSearchedActivities')
const retrieveSportActivities = require('./retrieveSportActivities')
const retrieveUser = require('./retrieveUser')
const retrieveUserActivities = require('./retrieveUserActivities')
const saveActivity = require('./saveActivity')
const saveComment = require('./saveComment')
const toggleLikeOnActivity = require('./toggleLikeOnActivity')
const updateUserData = require('./updateUserData')

module.exports = {
    saveComment,
    addPointToActivity,
    authenticateUser,
    createActivity,
    deleteActivity,
    deleteComment,
    deleteUser,
    registerUser,
    retrieveActivities,
    retrieveActivity,
    retrieveUser,
    retrieveUserActivities,
    retrieveSearchedActivities,
    retrieveSportActivities,
    saveActivity,
    toggleLikeOnActivity,
    updateUserData
}