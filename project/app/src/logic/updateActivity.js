import { validateStringNotEmptyNoSpaces, validateStringNotEmptyOrBlank, validateString, validateJwt } from 'validators'
import Apicaller from 'apicaller'


function updateActivity(token, activityId, title, text='', audience, sport, dificult, images){
    validateJwt(token)
    validateStringNotEmptyNoSpaces(activityId, 'activity Id')
    validateStringNotEmptyOrBlank(title, 'title')
    validateString(text, 'text')
    validateString(sport, 'sport')
    validateString(dificult, 'dificult')
    if(sport === '') sport=null
    if(images){
        images.forEach(image => {
            validateString(image, 'image')
        })
    }
        
    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => {      
        const result = await api.patch(`/activities/${activityId}/save`, 
            {headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}, 
            body: JSON.stringify({ title, text, audience, sport, dificult, images})})
             
        const { status, payload } = result
  
        if (status === 413){
            throw new Error("Image is too big")
        }
        else if (status >= 400 && status < 500) { 
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

export default updateActivity