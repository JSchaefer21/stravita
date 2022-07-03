const { retrieveSearchedActivities } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {  
        const userId = verifyToken(req)

        const { params: {search} } = req

        retrieveSearchedActivities(userId, search)
            .then(activities => res.status(200).json({activities}))
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}