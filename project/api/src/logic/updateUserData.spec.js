const { connect, disconnect, Types: { ObjectId }} = require('mongoose')
const { User } = require('../models')
const { NotFoundError } = require('errors')
const updateUserData = require('./updateUserData')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('updateUserData', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => User.deleteMany())
    afterEach(() => User.deleteMany())


    describe('when user already exists', () => {
        let user 
        
        beforeEach(() => {
            user = new User({ name: 'Jordi', username: 'jorgesito', password: '12121212', email: 'jordi@gmail.com', foto: 'foto' })
            return user.save()
        })

        it('succeeds on existing user', () => {
            return updateUserData(user.id, 'Diego', '00001111', 'diego@gmail.com', 'foto2')
                .then(result => {
                    expect(result).to.be.undefined
                    return User.findById(user.id)
                })
                .then(user => {
                    expect(user.name).to.equal('Diego')
                    expect(user.password).to.equal('00001111')
                    expect(user.email).to.equal('diego@gmail.com')
                    expect(user.foto).to.equal('foto2')
                })
        })


        it('fails on incorrect user id', () => {
            const wrongId = new ObjectId().toString()

            return updateUserData(wrongId, 'Diego', '00001111', 'diego@gmail.com', 'foto2')
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })


    })



    describe('when user does not exist', () => {
        it('fails on unexisting user id', () => {
            const unexistingUserId = new ObjectId().toString()

            return updateUserData(unexistingUserId, 'Diego', '00001111', 'diego@gmail.com', 'foto2')
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${unexistingUserId} does not exist`)
                })
        })
    })


    after(() => disconnect())

})