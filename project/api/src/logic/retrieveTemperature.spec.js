const retrieveTemperature = require('./retrieveTemperature')
const { expect } = require('chai')


describe('retrieveTemperature', () => {

    it('succeeds on correct data', () => {
        return retrieveTemperature(25.4534, 45.3248)
            .then(result => {
                expect(result.main.temp).to.be.a('number')
            })
    })

})