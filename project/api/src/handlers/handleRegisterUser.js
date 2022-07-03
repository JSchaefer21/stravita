const { registerUser } = require('../logic')
const { handleErrorsAndRespond } = require('./helpers')

module.exports = (req, res) => { 
    try {
        const { body: { name, username, password, email } } = req 
    
        registerUser(name, username, password, email) 
            .then(() => res.status(201).send()) 
            .catch(error => 
                handleErrorsAndRespond(error, res))
    } catch (error) { 
        handleErrorsAndRespond(error, res)
    }
}