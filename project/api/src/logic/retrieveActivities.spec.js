const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require("../models")
const { NotFoundError } = require('errors')
const retrieveActivities = require('./retrieveActivities')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('retrieveActivities', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user exists', () => {
        let userId

        beforeEach (()=> {
            return User.create({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })
                .then((user) => {
                    userId = user.id 
            })
        })
        afterEach(() => User.deleteMany())

        describe('when user already has activities',() => {
            let allCreatedActivities

            beforeEach(() => {
                const texts = [
                    ['Mi actividad 1', 'Ride', false],
                    ['Mi actividad 2', 'Ride', false],
                    ['Mi actividad 3', 'Ride', true],
                    ['Mi actividad 4', 'Ride', true],
                    ['Mi actividad 5', 'Ride', false],
                ]
                const Promises = texts.map(elem => Activity.create({ user: userId,  title: elem[0], sport: elem[1], private: elem[2]}))
                return Promise.all(Promises)
                    .then((result) => {
                        allCreatedActivities = result
                    })
            })
            afterEach(() => Activity.deleteMany())


            it ('success on correct credentials', () => {
                return retrieveActivities(userId) 
                    .then((arrayActivities) => {
                        expect(arrayActivities).to.be.instanceOf(Array)
                        expect(arrayActivities.length).to.be.equal(3)
                    })
            })

        })


        it ('success without activities but correct credentials', () => {
            return retrieveActivities(userId)
                .then((arrayActivities) => { 
                    expect(arrayActivities).to.be.instanceOf(Array)
                    expect(arrayActivities.length).to.be.equal(0)
                })
        })

    })


    describe('When user does not exist', () => { 

        it ('fails with wrong user Id', () => {
            const wrongId = new ObjectId().toString()

            return retrieveActivities(wrongId)
                .then(() => {
                    throw new Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })

    })

    after(() => disconnect())
})