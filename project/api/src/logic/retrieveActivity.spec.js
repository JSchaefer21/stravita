const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require("../models")
const { NotFoundError } = require('errors')
const retrieveActivity = require('./retrieveActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('retrieveActivity', () => {
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

        describe('When activity already exists', () => {
            let activity

            beforeEach(() => {
                activity = new Activity({ user: userId, title: 'My activity',  text: 'description', sport:'Ride', private: true, dificult: 'Easy' })
                return activity.save()
            })
            afterEach(() => Activity.deleteMany())

            it ('success on correct credentials', () => {
                return retrieveActivity(userId, activity.id) 
                    .then((activity) => {
                        expect(activity.user.toString()).to.equal(userId)
                        expect(activity.title).to.equal('My activity')
                        expect(activity.text).to.equal('description')
                        expect(activity.private).to.equal(true)
                        expect(activity.sport).to.equal('Ride')
                        expect(activity.dificult).to.equal('Easy')
                        expect(activity.date).to.be.instanceOf(Date)
                    })
            })

        })


        it ('fails when activity doues not exist', () => {
            const wrongId = new ObjectId().toString()

            return retrieveActivity(userId, wrongId)
            .catch(error => {
                expect(error).to.be.instanceOf(NotFoundError)
                expect(error.message).to.equal(`Activity with id ${wrongId} does not exist`)
            })
        })

    })


    describe('When user does not exist', () => { 

        it ('fails with wrong user Id', () => {
            const wrongId = new ObjectId().toString()

            return retrieveActivity(wrongId, wrongId)
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })

    })

    after(() => disconnect())
})