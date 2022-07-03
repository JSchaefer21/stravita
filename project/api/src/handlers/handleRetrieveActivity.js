const { retrieveActivity } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {  
        const userId = verifyToken(req)

        const { params: {activityId} } = req

        retrieveActivity(userId, activityId)
            .then(activity => res.status(200).json({activity})) 
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}