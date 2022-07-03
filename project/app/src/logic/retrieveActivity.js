import { validateJwt ,validateStringNotEmptyNoSpaces} from 'validators'
import Apicaller from 'apicaller'

function retrieveActivity(token, activityId) {  
    validateJwt(token)
    validateStringNotEmptyNoSpaces(activityId, 'activity Id')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => { 
        const result = await api.get(`/activities/${activityId}`,{
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
            const activity = data.activity

            activity.date = new Date(activity.date)

            return activity
        }        
    })()
}

export default retrieveActivity