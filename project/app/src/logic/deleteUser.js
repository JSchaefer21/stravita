import { validateJwt, validatePassword } from 'validators'
import Apicaller from 'apicaller'

function deleteUser (token, password)  {
    validateJwt(token)
    validatePassword(password, 'Password')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.delete('/users', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({ password})})

            const { status, payload } = result

            if (status >= 400 && status < 500) { 
                const data = JSON.parse(payload)
                throw new Error(data.error) 
            } 
            else if (status >= 500) {
                throw new Error('server error')
            }
            else if (status === 200) {
                return
            }
    })()
}

export default deleteUser