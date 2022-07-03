import { validateString, validateEmail, validatePassword } from 'validators'
import Apicaller from 'apicaller'

function registerUser(name, username, password, email) {
    validateString(name, 'Name')
    validateString(username, 'Username')
    validatePassword(password, 'Password')
    validateEmail(email, 'email')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => { 
        const result = await api.post('/users', {
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify( {name, username, password, email})})

            const { status, payload } = result

            if (status >= 400 && status < 500) { 
                const data = JSON.parse(payload)
                throw new Error(data.error) 
            } 
            else if (status >= 500) {
                throw new Error('server error')
            }
            else if (status === 204) {
                return
            }
    })()
}

export default registerUser