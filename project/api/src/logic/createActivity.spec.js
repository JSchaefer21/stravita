const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const createActivity = require('./createActivity')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('createActivity', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))

    describe('when user already exists', () => {
        let user

        beforeEach(() => {
            user = new User({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })
            return user.save()
        })

        it('succeeds on correct credentials', () => {
            createActivity(user.id, 'Ride')
                .then(actvityId => {
                    expect(actvityId).to.be.a('string')

                    return Activity.findById( actvityId )
                })
                .then(activity => {
                    expect(activity.sport).to.equal('Ride')
                })
        })

    })

    describe('When user does not exists', () => { 

        it('fails with wrong user', () => {
            const wrongId = new ObjectId().toString()
            
            return createActivity(wrongId, 'Ride')
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })
    })

    after(() => disconnect())
})