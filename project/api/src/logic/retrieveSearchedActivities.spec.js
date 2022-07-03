const { connect, disconnect, Types: { ObjectId } } = require('mongoose')
const { User, Activity } = require('../models')
const { NotFoundError } = require('errors')
const retrieveSearchedActivities = require('./retrieveSearchedActivities')
const { expect } = require('chai')
require('dotenv').config()
const { env: { MONGODB_URL_TEST}} = process

describe('retrieveSearchedActivities', () => {
    before(() => connect(MONGODB_URL_TEST))

    beforeEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    afterEach(() => Promise.all([User.deleteMany(), Activity.deleteMany()]))
    
    describe('when user exists', () => {
        let user1, user2, user3

        beforeEach(async () => {
            await User.deleteMany()
            await Activity.deleteMany()

            user1 = await User.create({ name: 'Jordi', username: 'Jorgesito', password: '12121212', email: 'jordi@gmail.com' })
            user2 = await User.create({ name: 'Paula', username: 'Paulita', password: '12121212', email: 'paula@gmail.com' })
            user3 = await User.create({ name: 'Diego', username: 'Diegito', password: '12121212', email: 'diego@gmail.com' })
        })
        
        describe('when activities exists', () => {

            beforeEach(async () => {
                await Promise.all([
                    Activity.create({ user: user1.id, title: 'Activity from Jordi 1',  text: 'description j 1', sport:'Ride', private: false, dificult: 'Easy' }),
                    Activity.create({ user: user1.id, title: 'Activity from Jordi 2',  text: 'description j 2', sport:'Hike', private: false, dificult: 'Easy' }),
                    Activity.create({ user: user2.id, title: 'Activity from Paula 1',  text: 'description p 1', sport:'Ride', private: false, dificult: 'Easy' }),
                    Activity.create({ user: user2.id, title: 'Activity from Paula 2',  text: 'description p 2', sport:'Hike', private: false, dificult: 'Easy' }),
                    Activity.create({ user: user3.id, title: 'Activity from Diego 1',  text: 'description d 1', sport:'Ride', private: false, dificult: 'Easy' }),
                    Activity.create({ user: user3.id, title: 'Activity from Diego 2',  text: 'description d 2', sport:'Hike', private: false, dificult: 'Easy' }),
                ])
            })

            it('succeeds with capital leter in name', () => {
                
                return retrieveSearchedActivities(user1.id, 'pAuLa')
                .then((arrayActivities) => {
                    expect(arrayActivities).to.be.instanceOf(Array)
                    expect(arrayActivities.length).to.be.equal(2)

                    arrayActivities.forEach(activity => {
                        expect(activity._id).to.be.undefined
                        expect(activity.__v).to.be.undefined
                        expect(activity.id).to.exist
                    })
                    
                    const titles = ['Activity from Paula 1', 'Activity from Paula 2']
                
                    arrayActivities.forEach(activity => {
                        const titleIncluded = titles.some(title => title === activity.title)
                
                        expect(titleIncluded).to.be.true
                    })
                })
            })


            it('succeeds with spaces and incomplete word', () => {
                
                return retrieveSearchedActivities(user1.id, 'rom diE')
                .then((arrayActivities) => {
                    expect(arrayActivities).to.be.instanceOf(Array)
                    expect(arrayActivities.length).to.be.equal(2)

                    arrayActivities.forEach(activity => {
                        expect(activity._id).to.be.undefined
                        expect(activity.__v).to.be.undefined
                        expect(activity.id).to.exist
                    })
                    
                    const titles = ['Activity from Diego 1', 'Activity from Diego 2']
                
                    arrayActivities.forEach(activity => {
                        const titleIncluded = titles.some(title => title === activity.title)
                
                        expect(titleIncluded).to.be.true
                    })
                })
            })
        })

        it ('success without activities but correct credentials', () => {
            return retrieveSearchedActivities(user1.id, 'diego')
                .then((arrayActivities) => { 
                    expect(arrayActivities).to.be.instanceOf(Array)
                    expect(arrayActivities.length).to.be.equal(0)
                })
        })
    })


    describe('When user does not exist', () => { 

        it ('fails with wrong user Id', () => {
            const wrongId = new ObjectId().toString()

            return retrieveSearchedActivities(wrongId, 'Activity')
                .then(() => {
                    throw new Error('should not reach this point')
                })
                .catch(error => {
                    expect(error).to.be.instanceOf(NotFoundError)
                    expect(error.message).to.equal(`user with id ${wrongId} does not exist`)
                })
        })

    })


    afterEach(() => {
        User.deleteMany()
        Activity.deleteMany()
    })


    after(() => disconnect())
})