const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const saveActivity = require('./saveActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('saveActivity', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user already exists', () => {
        let user

        beforeEach(() => {
            user = new User({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })

            return user.save()
        })

        describe('When activity already exists', () => {
            let activity

            beforeEach(() => {
                activity = new Activity({ user: user.id, sport:'Ride', title: 'My activity'})
                return activity.save()
            })
            afterEach(() => Activity.deleteMany())

            it('succeeds on correct user data', () => {
                return saveActivity(user.id, activity.id, 'My new activity', 'description', true, 'Ride', 'Easy', ['Image'])
                    .then(result => {
                        expect(result).to.be.undefined

                        return Activity.findById(activity.id)
                    })
                    .then(activity => {
                        expect(activity.user.toString()).to.equal(user.id)
                        expect(activity.title).to.equal('My new activity')
                        expect(activity.text).to.equal('description')
                        expect(activity.private).to.equal(true)
                        expect(activity.sport).to.equal('Ride')
                        expect(activity.dificult).to.equal('Easy')
                        expect(activity.images[0]).to.equal('Image')
                        expect(activity.date).to.be.instanceOf(Date)
                    })
            })
        })
        

        it('fails on incorrect activity id', () => {
            const wrongId = new ObjectId().toString()

            return saveActivity(user.id, wrongId, 'My activity', 'description', true, 'Ride', 'Easy', ['Image'])
                .then(() => {
                    throw new Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`activity with id ${wrongId} does not exist`)
                })
        })
    })

    describe('when user does not exist', () => {
        it('fails on unexisting user id', () => {
            const unexistingUserId = new ObjectId().toString()

            return saveActivity(unexistingUserId, unexistingUserId, 'My activity', 'description', true, 'Ride', 'Easy', ['Image'])
                .then(() => {
                    throw new Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${unexistingUserId} does not exist`)
                })
        })
    })


    after(() => disconnect())
})