import { validateJwt ,validateString} from 'validators'
import Apicaller from 'apicaller'

function retrieveSearchedActivities(token, search) {  
    validateJwt(token)
    validateString(search, 'search')

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => { 
        const result = await api.get(`/activities/search/${search}`,{
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
            const activities = data.activities
            activities.forEach(activity => {
                activity.date = new Date(activity.date)
                activity.points.forEach(point => point.date = new Date(point.date))
            })

            return activities
        }        
    })()
}

export default retrieveSearchedActivities