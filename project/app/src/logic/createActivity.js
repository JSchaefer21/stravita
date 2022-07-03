import { validateJwt, validateString } from 'validators'
import Apicaller from 'apicaller'

function createActivity(token, sport){
    validateJwt(token)
    validateString(sport, 'sport')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {
        const result = await api.post('/activities', 
            {headers: {'Authorization' : `Bearer ${token}`, 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ sport })})
             
        const { status, payload } = result
        
        if (status >= 400 && status < 500) { 
            const data = JSON.parse(payload)
            throw new Error(data.error) 
        } 
        else if (status >= 500) {
            throw new Error('server error')
        }
        else if (status === 201) {
            const data = JSON.parse(payload)  
            return data.activityId 
        }
    })()
}

export default createActivity