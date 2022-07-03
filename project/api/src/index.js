require('dotenv').config()

const { cors } = require('./helpers')
const express = require('express')
const bodyParser = require('body-parser')
const { connect, disconnect } = require('mongoose')
const { handleRegisterUser, 
    handleAuthenticateUser, handleRetrieveUser, 
    handleUpdateUserData, handleDeleteUser, 
    handleCreateActivity, handleDeleteActivity, 
    handleRetrieveActivities, handleRetrieveUserActivities,
    handleAddPointToActivity, handleSaveActivity,
    handleToggleLikeOnActivity, handleRetrieveActivity,
    handleRetrieveSearchedActivities, handleRetrieveSportActivities, 
    handleSaveComment } = require('./handlers')

const { env: { MONGODB_URL, PORT=8080 }, argv: [ , , port = PORT]} = process


; (async () => {
    await connect(MONGODB_URL)
    console.log(`DB connected to ${MONGODB_URL}`)
    
    const api = express() 
    api.use(cors)

    const jsonBodyParser = bodyParser.json()
    const routes = express.Router()


    // ---------------   USERS  --------------------
    // Create User
    routes.post('/users', jsonBodyParser, handleRegisterUser)
    // Authenticate
    routes.post('/users/auth', jsonBodyParser, handleAuthenticateUser)
    // Retrieve
    routes.get('/users', handleRetrieveUser)
    // Update
    routes.patch('/users', jsonBodyParser, handleUpdateUserData)
    // Delete
    routes.delete('/users', jsonBodyParser, handleDeleteUser)
    
    
    // ---------------   ACTIVITIES  --------------------
    // create
    routes.post('/activities', jsonBodyParser, handleCreateActivity)
    // Delete
    routes.delete('/activities/:activityId', jsonBodyParser, handleDeleteActivity)
    // RetrieveActivities
    routes.get('/activities', handleRetrieveActivities)
    // RetrieveUserActivities
    routes.get('/activities/user', handleRetrieveUserActivities)
    // Retrieve Activity
    routes.get('/activities/:activityId', handleRetrieveActivity)
    // Retrieve Searched Activity
    routes.get('/activities/search/:search', handleRetrieveSearchedActivities)
    // Retrieve Sport Activity
    routes.get('/activities/sport/:sport', handleRetrieveSportActivities)
    // Save Point
    routes.patch('/activities/:activityId', jsonBodyParser, handleAddPointToActivity)
    // Save Activity
    routes.patch('/activities/:activityId/save', jsonBodyParser, handleSaveActivity)
    // Like Activity
    routes.patch('/activities/:activityId/like', handleToggleLikeOnActivity)
    // Save Comment
    routes.patch('/activities/:activityId/comment', jsonBodyParser, handleSaveComment)
    

    api.use('/api', routes)

    api.listen(port, () => console.log(`API running on port ${port}`))

    process.on('SIGINT', async () => {
        await disconnect()

        console.log('\nDB disconnected')
        
        process.exit(0)
    })
})()



