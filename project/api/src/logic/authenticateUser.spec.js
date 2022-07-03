const { connect, disconnect } = require('mongoose')
const { User } = require('../models')
const { AuthError } = require('errors')
const authenticateUser = require('./authenticateUser')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process
const bcrypt = require('bcryptjs')

describe('authenticateUser', () => {
    
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => User.deleteMany())

    describe('when user already exists', () => {
        let user

        beforeEach(() => {
            const hash = bcrypt.hashSync('123123123', 10)

            user = new User({name:'Jordi', username: 'Jorgesito', password: hash, email: 'jordi@gmail.com'})

            return user.save()
        })
        afterEach(() => User.deleteMany())

        it('succeeds on correct credentials', () =>
            authenticateUser('Jorgesito', '123123123')
                .then(userId => {
                    expect(userId).to.be.a('string')
                    expect(userId).to.equal(user.id)
                })
        )

        it('fails on incorrect password', () =>
            authenticateUser('Jorgesito', '123123123-wrong')
                .catch(error => {
                    expect(error).to.be.instanceOf(AuthError)
                    expect(error.message).to.equal('wrong credentials')
                })
        )

        it('fails on incorrect username', () =>
            authenticateUser('Jorgesito-wrong', '123123123')
                .catch(error => {
                    expect(error).to.be.instanceOf(AuthError)
                    expect(error.message).to.equal('wrong credentials')
                })
        )
    })

    describe('when user does not exist', () => {
        it('fails on credentials from non-existing user', () =>
            authenticateUser('Jorgesito', '123123123')
                .catch(error => {
                    expect(error).to.be.instanceOf(AuthError)
                    expect(error.message).to.equal('wrong credentials')
                })
        )
    })

    afterEach(() => User.deleteMany())
    after(() => disconnect())
})