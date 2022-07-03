const { saveComment } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {
        const userId = verifyToken(req)

        const { params: {activityId}, body: { text } } = req
        
        saveComment(userId, activityId, text)
        .then(commentId => res.status(204).json({ commentId }))  
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}