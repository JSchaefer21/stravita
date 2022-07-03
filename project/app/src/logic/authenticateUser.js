import { validateString, validatePassword } from 'validators'
import Apicaller from 'apicaller'

function authenticateUser(username, password) {
    validateString(username, 'Username')
    validatePassword(password, 'Password')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.post('/users/auth', {
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify( {username, password})})

            const { status, payload } = result
            
            if (status >= 400 && status < 500) { 
                const data = JSON.parse(payload)
                throw new Error(data.error) 
            } 
            else if (status >= 500) {
                throw new Error('server error')
            }
            else if (status === 200) {
                const data = JSON.parse(payload)  
                return data.token
            }
    })()
}

export default authenticateUser