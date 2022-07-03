import { validateJwt} from 'validators'
import Apicaller from 'apicaller'

function retrieveUser(token) {
    validateJwt(token)

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.get('/users', {
            headers: {'Authorization': `Bearer ${token}`}})

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
            const user = { name: data.name, username: data.username, foto: data.foto }
            return user
        }      
    })()
}

export default retrieveUser