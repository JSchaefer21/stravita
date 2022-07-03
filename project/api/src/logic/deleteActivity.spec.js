const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require("../models")
const { NotFoundError, ConflictError } = require('errors')
const deleteActivity = require('./deleteActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('deleteActivity', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user exists', () => {
        let userId
        
        beforeEach (()=> {
            return User.create({name:'Jordi', username: 'Jorgesito', password: '123123123', email: 'jordi@gmail.com'})
                .then((user) => {
                    userId = user.id 
            })
        })
        afterEach(() => User.deleteMany())

        it ('success with activities and correct credentials', () => {
            let activityId
            return Activity.create({ user: userId, sport:'Ride', title: 'My activity'})
                .then((result)=> {
                    activityId = result.id

                    return deleteActivity(userId, activityId)
                }) 
                .then((result)=>{
                    expect(result).to.be.undefined

                    return Activity.findById(activityId) 
                })
                .then((activity) => {
                    expect(activity).to.be.null
                })
        })


        it ('fails without activities', () => {
            const wrongId = new ObjectId().toString()

            return deleteActivity(userId, wrongId)
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`activity with id ${wrongId} does not exist`)
                })
        })

        it ('fails when user does belong to the activity', () => {
            const wrongId = new ObjectId().toString()
    
            let activityId
            return Activity.create({ user: wrongId, sport:'Ride', title: 'mi test activity for deleteActivity'})
                .then((result)=> {
                    activityId = result.id
    
                    return deleteActivity(userId, activityId)
                }) 
                .then(() => {
                    throw new Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(ConflictError)
                    expect(error.message).to.equal(`activity with id ${activityId} does not belong to user with id ${userId}`)
                })
         })
    })


    describe('when user does not exist', () => {

        it ('fails when user does not exist', () => {
            const userId = new ObjectId().toString()

            let activityId
            return Activity.create({ user: userId, sport:'Ride', title: 'mi test activity for deleteActivity'})
                .then((result)=> {
                    activityId = result.id

                    return deleteActivity(userId, activityId)
                }) 
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${userId} does not exist`)
                })
        })
    })



    after(() => disconnect())
})