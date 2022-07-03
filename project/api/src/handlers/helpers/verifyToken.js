const { verify } = require('jsonwebtoken')

function verifyToken(req) {
    
    const {headers: { authorization }} = req

    const [noInteresa, token] = authorization.split(' ') // [ Bearer, 344834829434]

    const { sub: userId } = verify(token, process.env.JWT_SECRET)

    return userId
}

module.exports = verifyToken