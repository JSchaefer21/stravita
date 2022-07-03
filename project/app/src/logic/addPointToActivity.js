import { validateStringNotEmptyNoSpaces, validatePosition, validateJwt } from 'validators'
import Apicaller from 'apicaller'

function addPointToActivity(token, activityId, position){
    validateJwt(token)
    validateStringNotEmptyNoSpaces(activityId, 'activity Id')
    validatePosition(position)
    
    const api = new Apicaller(process.env.REACT_APP_API_URL)
    
    return (async () => {
        const result = await api.patch(`/activities/${activityId}`, 
            {headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ lat: position[0], lng: position[1], alt: position[2] })})
             
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

export default addPointToActivity