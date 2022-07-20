const { retrieveTemperature } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {  
        const userId = verifyToken(req)

        const { params: {lat, lon} } = req
        
        retrieveTemperature(Number(lat), Number(lon))
            .then(data => res.status(200).json({data}))
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}