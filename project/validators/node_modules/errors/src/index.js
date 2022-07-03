//const createCustomError = require('utils')

function createCustomError(name) {
    const customError = class extends Error {
        constructor(message) {
            super(message)
        }
    }

    customError.prototype.name = name

    return customError
}


const FormatError = createCustomError('FormatError')
const AuthError = createCustomError('AuthError')
const ConflictError = createCustomError('ConflictError')
const NotFoundError = createCustomError('NotFoundError')

module.exports = {
    FormatError,
    AuthError,
    ConflictError,
    NotFoundError
}

