const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const addPointToActivity = require('./addPointToActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('addPointToActivity', () => {
    before(() => connect(MONGODB_URL_TEST))
    
    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user already exists', () => {
        let user

        beforeEach(() => {
            user = new User({ name: 'Jordi', username: 'Jschaefer', password: '12341234', email: 'jordi@gmail.com' })

            return user.save()
        })
        afterEach(() => User.deleteMany())

        describe('When activity already exists', () => {
            let activity

            beforeEach(() => {
                activity = new Activity({ user: user.id, title: 'mi actividad', sport: 'Ride' })
                return activity.save()
            })
            afterEach(() => Activity.deleteMany())

            it('succeeds on corret data', () => {
                return addPointToActivity(user.id, activity.id, 25, 15, 12)
                    .then(pointId => {
                        expect(pointId).to.be.a('string')

                        return Activity.findById(activity.id)
                        .then(activity => {
                            const point= activity.points.find(point => point._id.toString() === pointId)
                            
                                expect(point.latitude).to.be.equal(25)
                                expect(point.longitude).to.be.equal(15)
                                expect(point.altitude).to.be.equal(12)
                                expect(point.date).to.be.instanceOf(Date)
                            })
                    })
            })

            it('succeeds on corret data but no altitude', () => {
                return addPointToActivity(user.id, activity.id, 25, 15, null)
                    .then(pointId => {
                        expect(pointId).to.be.a('string')

                        return Activity.findById(activity.id)
                        .then(activity => {
                            const point= activity.points.find(point => point._id.toString() === pointId)
                            
                                expect(point.latitude).to.be.equal(25)
                                expect(point.longitude).to.be.equal(15)
                                expect(point.altitude).to.be.equal(557)
                                expect(point.date).to.be.instanceOf(Date)
                            })
                    })
            })
            
        })

        describe('When activity does not exists', () => { 

            it('fails without activity', () => {
                const wrongId = new ObjectId().toString()
                
                return addPointToActivity(user.id, wrongId, 25, 15, 12)
                    .then(() => {
                        throw new Error('should not reach this point')
                    })
                    .catch(error => {
                        expect(error).to.be.instanceOf(NotFoundError)
                        expect(error.message).to.equal(`activity with id ${wrongId} does not exist`)
                    })
            })
        })

    })

    describe('When user does not exists', () => { 

        describe('When activity already exists', () => {
            let activity

            beforeEach(() => {
                const wrongId = new ObjectId().toString()
                activity = new Activity({ user: wrongId, title: 'mi actividad', sport: 'Ride' })
                return activity.save()
            })

            afterEach(() => Activity.deleteMany())

            it('fails with wrong user', () => {
                const wrongId = new ObjectId().toString()
                
                return addPointToActivity(wrongId, activity.id, 25, 15, 12)
                    .then(() => {
                        throw new Error('should not reach this point')
                    })
                    .catch(error => {
                        expect(error).to.be.instanceOf(NotFoundError)
                        expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                    })
            })
        })
    })

    
    after(() => disconnect())
})