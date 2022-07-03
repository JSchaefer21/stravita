const { toggleLikeOnActivity } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {
        const userId = verifyToken(req)

        const { params: {activityId} } = req
        
        toggleLikeOnActivity(userId, activityId)
            .then(() => res.status(204).send()) 
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}