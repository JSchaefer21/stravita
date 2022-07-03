import { validateString, validateJwt } from 'validators'
import Apicaller from 'apicaller'

function updateUserFoto (token, foto)  {
    validateJwt(token)
    validateString(foto, 'foto')

    const api = new Apicaller(process.env.REACT_APP_API_URL)
    
    return (async () => {
        const result = await api.patch('/users', {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
            body: JSON.stringify({ foto: foto })})

            const { status, payload } = result

            if (status === 413){
                throw new Error("Images are too big")
            }
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

export default updateUserFoto