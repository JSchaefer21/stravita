const retrieveAltitude = require('./retrieveAltitude')
const { expect } = require('chai')


describe('retrieveAltitude', () => {

    it('succeeds on correct data', () => {
        return retrieveAltitude(25.4534, 45.3248)
            .then(altitude => {
                expect(altitude).to.equal(675)
            })
    })

/*     it('fails on incorrect latitude', () => {
        return retrieveAltitude('string', 45.3248)
            .then(() => {
                throw new Error('should not reach this point')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.equal(`Latitude is not a number`)
            })
    })

    it('fails on incorrect longitude', () => {
        return retrieveAltitude(25.4534, false)
            .then(() => {
                throw new Error('should not reach this point')
            })
            .catch(error => {
                expect(error).to.be.instanceOf(TypeError)
                expect(error.message).to.equal(`Longitude is not a number`)
            })
    }) */


})