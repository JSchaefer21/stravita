const { sign } = require('jsonwebtoken')

function generateToken(userId) {
    const token = sign({ sub: userId }, process.env.JWT_SECRET) //  , { expiresIn: '24h'} 
    return token
}

module.exports = generateToken