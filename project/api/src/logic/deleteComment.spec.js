const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity, Comment } = require('../models')
const { NotFoundError, AuthError } = require('errors')
const deleteComment = require('./deleteComment')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('deleteComment', () => {
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
                activity = new Activity({ user: user.id, sport:'Ride', title: 'My activity'})
                return activity.save()
            })
            afterEach(() => Activity.deleteMany())

            describe('When comment already exists', () => {
                let comment
    
                beforeEach(() => {
                    comment = new Comment({ user: user2.id, text: 'Pasalo muy bien!'})
                    activity.comments.push(comment)
                    return activity.save()
                })

                it('succeeds on corret data', () => {
                    return deleteComment(user2.id, activity.id, comment.id)
                    .then(result => {
                        expect(result).to.be.undefined

                    return Activity.findById(activity.id)
                    }).then(activity => {
                        const comment= activity.comments.find(comment => comment._id.toString() === comment.id)
                    
                        expect(comment).to.be.undefined
                    })
                })

                it('fails when user does not own comment', () => {
                    const wrongId = new ObjectId().toString()
                    return deleteComment(user.id, activity.id, comment.id)
                        .catch(error => {
                            expect(error).to.be.instanceOf(AuthError)
                            expect(error.message).to.equal(`comment does not belong to user with id ${user.id}`)
                        })
                })
            })


            describe('When comment does not exist', () => {

                it('fails without comment', () => {
                    const wrongId = new ObjectId().toString()
                        
                    return deleteComment(user2.id, activity.id, wrongId)
                        .catch(error => {
                            expect(error).to.be.instanceOf(NotFoundError)
                            expect(error.message).to.equal(`comment with id ${wrongId} does not exist`)
                        })
                })
            })           
        })
        describe('When activity does not exist', () => {

            it('fails without activity', () => {
                const wrongId = new ObjectId().toString()
                return deleteComment(user2.id, wrongId, wrongId)
                    .catch(error => {
                        expect(error).to.be.instanceOf(NotFoundError)
                        expect(error.message).to.equal(`activity with id ${wrongId} does not exist`)
                    })
            })

        })

    })

    describe('When user does not exist', () => {

        it('fails without activity', () => {
            const wrongId = new ObjectId().toString()
            return deleteComment(wrongId, wrongId, wrongId)
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })

    })
    
    after(() => disconnect())
})