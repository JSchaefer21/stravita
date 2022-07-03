const { FormatError } = require('errors')

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


function validateString(string, explain = 'string') {
    if (typeof string !== 'string') throw new TypeError(`${explain} is not a string`)
}

function validateStringNotEmptyOrBlank(string, explain = 'string') {
    validateString(string, explain)

    if (!string.length) throw new FormatError(`${explain} is empty`)

    if (!string.trim().length) throw new FormatError(`${explain} is blank`)
}

function validateStringNotEmptyNoSpaces(string, explain = 'string') {
    validateString(string, explain)

    if (!string.length) throw new FormatError(`${explain} is empty`)

    if (string.includes(' ')) throw new FormatError(`${explain} has spaces`)
}

function validateJwt(token) {
    validateString(token, 'token')

    const parts = token.split('.')

    if (parts.length !== 3 || !parts.every(part => part.length > 0)) throw new FormatError('invalid token format')

    const [,b64Payload] = parts
    const jsonPayload = atob(b64Payload)
    const payload = JSON.parse(jsonPayload) 
    const { exp } = payload
    const now = Math.round(Date.now() / 1000)

    if (now > exp) throw new AuthError('token expired')
}

function isJwtValid(token) {
    try {
        validateJwt(token)
        return true
    } catch(error) {
        return false
    }
}

function validatePassword(password, explain = 'password') {
    validateStringNotEmptyNoSpaces(password, explain)

    if (password.length < 8)
        throw new FormatError(`${explain} length is lower than 8`)
}

function validateUsername(username) {
    validateStringNotEmptyNoSpaces(username, 'username')

    if (username.length < 4)
        throw new FormatError('username length is lower than 4')
}

function validateFunction(func, explain = 'function') {
    if (typeof func !== 'function')
        throw new TypeError(`${explain} is not a function`)
}

function validateDate(date, explain = 'date') {
    if (!(date instanceof Date)) throw new TypeError(`${explain} is not Date`)
}

function validateNumber(number, explain = 'number') {
    if (typeof number !== 'number') throw new TypeError(`${explain} is not a number`)
}

function validatePositiveInteger(number, explain = 'number') {
    validateNumber(number, explain)

    if (!Number.isInteger(number)) throw new FormatError(`${explain} is not an integer`)

    if (number < 0 || number > 150) throw new RangeError(`${explain} is lower than 0 or greater than 150`)
}

function validateEmail(email, explain = 'email') {
    if (!EMAIL_REGEX.test(email))
        throw new FormatError(`${explain} is not an email`)
}

function validatePosition(position) {
    if (position[0]===null || position[1]===null)
        throw new Error('Position not found')

    validateNumber(position[0], 'latitude')
    validateNumber(position[1], 'longitude')
    if(position[2] != null) validateNumber(position[2], 'altitude')
}

module.exports = {
    validateString,
    validateStringNotEmptyOrBlank,
    validateStringNotEmptyNoSpaces,
    validateJwt,
    validatePassword,
    validateUsername,
    validateFunction,
    validateDate,
    validateNumber,
    validatePositiveInteger,
    validateEmail,
    validatePosition,
    isJwtValid
}