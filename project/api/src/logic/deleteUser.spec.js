const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User } = require('../models')
const { NotFoundError, AuthError } = require('errors')
const deleteUser = require('./deleteUser')
const { expect } = require('chai')
require('dotenv').config()
const { env: {MONGODB_URL_TEST}} = process

describe('deleteUser', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => User.deleteMany())

    describe('when user exists', () =>{ 
        let user

        beforeEach(() =>  { 
            user = new User({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })
            
            return user.save()
        })


        it('success in delete user with correct Id', () =>
            deleteUser(user.id, user.password) 
                .then((result)=>{
                    expect(result).to.be.undefined

                    return User.findById(user.id)  
                })
                .then((result)=> 
                    expect(result).to.be.null
                )
        )
        

        it('fails when user does not exist', ()=>{
            wrongId = new ObjectId().toString()
            return deleteUser(wrongId, user.password)
                .then(() =>{
                    throw new Error('should not reach this point')

                })
                .catch((error) => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.be.equal(`user with id ${wrongId} does not exist`)
                })
                
        })

        it('fails when password is not correct', ()=>{
            return deleteUser(user.id, '423423467') 
                .then(() =>{
                    throw new Error('should not reach this point')

                })
                .catch((error) => {
                    expect(error).to.be.instanceOf(AuthError)
                    expect(error.message).to.be.equal(`Password is not correct`)
                })
                
        })

    })



    afterEach(() => User.deleteMany())

    after(() => disconnect())
})