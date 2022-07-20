import Apicaller from 'apicaller'
const { validateJwt, validatePosition } = require('validators')

function retrieveTemperature(token, latitude, longitude) {  
    validateJwt(token)
    validatePosition([latitude, longitude])

    const api = new Apicaller(process.env.REACT_APP_API_URL)

    return (async () => { 
        const result = await api.get(`/temperature/${latitude}/${longitude}`,{
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
            const result = JSON.parse(payload).data
            const data = {temp: result.main.temp, wind: result.wind.speed, text: result.weather[0].main, sunset: result.sys.sunset}

            return data
        }        
    })()
}

export default retrieveTemperature