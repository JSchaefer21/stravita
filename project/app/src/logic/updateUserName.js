import { validateJwt, validateString } from 'validators'
import Apicaller from 'apicaller'

function updateUserName (token, newName)  {
    validateJwt(token)
    validateString(newName, 'Name')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.patch('/users', {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({ name: newName })})

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

export default updateUserName