const { updateUserData } = require('../logic')
const { verifyToken, handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => {
    try {
        const userId = verifyToken(req)

        const { body: { name, password, email, foto } } = req

        updateUserData(userId, name, password, email, foto )
            .then(() => res.status(204).send()) 
            .catch(error => handleErrorsAndRespond(error, res))
    } catch (error) {
        handleErrorsAndRespond(error, res)
    }
}