const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const toggleLikeOnActivity = require('./toggleLikeOnActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('toggleLikeOnActivity', () => {
    before(() => connect(MONGODB_URL_TEST))
    
    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user already exists', () => {
        let user, user2

        beforeEach(() => {
            user = new User({ name: 'Paula', username: 'cardonatr', password: '199804PCT', email: 'cardona@gmail.com' })
            user2 = new User({ name: 'Jordi', username: 'Jschaefer', password: '12341234', email: 'jordi@gmail.com' })

            Promise.all(user.save(), user2.save())
        })
        afterEach(() => User.deleteMany())

        describe('When activity already exists', () => {
            let activity

            beforeEach(() => {
                activity = new Activity({ user: user.id, title: 'mi actividad', sport: 'Ride' })
                return activity.save()
            })

            afterEach(() => Activity.deleteMany())

            describe('When activity already exists', () => {
                it('succeeds on corret data', () => {
                    return toggleLikeOnActivity(user2.id, activity.id)
                        .then(result => {
                            expect(result).to.be.undefined

                            return Activity.findById(activity.id)
                            .then(activity => {
                            
                                expect(activity.likes.length).to.be.equal(1)
                                expect(activity.likes[0]._id.toString()).to.be.equal(user2.id)
                                })
                        })
                })
            })
        })

        describe('When activity and like already exists', () => {
            let activity

            beforeEach(() => {
                activity = new Activity({ user: user.id, title: 'mi actividad', sport: 'Ride' , likes: [user2.id]})
                return activity.save()
            })

            afterEach(() => Activity.deleteMany())

            describe('When activity already exists', () => {
                it('succeeds on corret data', () => {
                    return toggleLikeOnActivity(user2.id, activity.id)
                        .then(result => {
                            expect(result).to.be.undefined

                            return Activity.findById(activity.id)
                            .then(activity => {
                            
                                expect(activity.likes.length).to.be.equal(0)
                                })
                        })
                })
            })
        })

        describe('When activity does not exists', () => { 

            it('fails without activity', () => {
                const wrongId = new ObjectId().toString()
                
                return toggleLikeOnActivity(user2.id, wrongId)
                    .catch(error => {
                        expect(error).to.be.instanceOf(NotFoundError)
                        expect(error.message).to.equal(`Activity with id ${wrongId} does not exist`)
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
                
                return toggleLikeOnActivity(wrongId, activity.id)
                    .catch(error => {
                        expect(error).to.be.instanceOf(NotFoundError)
                        expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                    })
            })
        })
    })
    
    after(() => disconnect())
})