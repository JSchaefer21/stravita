const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User } = require('../models')
const { NotFoundError } = require('errors')
const retrieveUser = require('./retrieveUser')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('retrieveUser', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => User.deleteMany())

    describe('when user already exists', () => {
        let user

        beforeEach(() => {
            user = new User({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })

            return user.save()
        })

        it('succeeds on correct user id', () =>
            retrieveUser(user.id)
                .then(user => {
                    expect(user.constructor).to.equal(Object)
                    expect(user.name).to.equal('Jordi')
                    expect(user.username).to.equal('Jorgesito')
                    expect(user.password).to.be.undefined
                    expect(user.id).to.be.undefined
                })
        )

        it('fails on incorrect id', () => {
            const wrongId = new ObjectId().toString()

            return retrieveUser(wrongId)
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })
    })

    describe('when user does not exist', () => {
        it('fails on user id from non-existing user', () => {
            const unexistingUserId = new ObjectId().toString()

            return retrieveUser(unexistingUserId)
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${unexistingUserId} does not exist`)
                })
        })
    })

    afterEach(() => User.deleteMany())

    after(() => disconnect())
})