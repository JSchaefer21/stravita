const { retrieveActivities } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {
        const userId = verifyToken(req)
        
        retrieveActivities(userId)
            .then(activities => res.status(200).json({activities}))  // devuelvo estatus ok y el token
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}