const { connect, disconnect } = require('mongoose')
const { User } = require('../models')
const { ConflictError } = require('errors')
const registerUser = require('./registerUser')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('registerUser', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())

    it('succeeds on correct credentials', () => {
        registerUser('Jordi', 'Jorgesito', '123123123', 'jordi@gmail.com')
            .then(result => {
                expect(result).to.be.undefined

                return User.findOne({ username: 'Jorgerito' })
            })
            .then(user => {
                expect(user.name).to.equal('Jordi')
                expect(user.username).to.equal('Jorgesito')
                expect(user.password).to.equal('123123123')
                expect(user.email).to.equal('jordi@gmail.com')
            })
    })

    it('fails when user already exists', () => {
        return User.create({name:'Jordi', username: 'Jorgesito', password: '123123123', email: 'jordi@gmail.com'})
            .then(() => registerUser('Jordi', 'Jorgesito', '123123123', 'jordi@gmail.com'))
            .catch(error => {
                expect(error).to.be.instanceOf(ConflictError)
                expect(error.message).to.equal(`user with username Jorgesito already exists`)
            })
    })

    after(() => disconnect())
})