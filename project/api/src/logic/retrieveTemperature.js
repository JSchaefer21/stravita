const axios = require('axios');
const { NotFoundError } = require('errors');
const { validatePosition } = require('validators')

function retrieveTemperature(latitude, longitude) {
  validatePosition([latitude, longitude])

return axios
  .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=93a177915b460f1e6b2b2548a8b673cc`)
  .then(res => {
    if(res.status === 200){
        const data = res.data
        return data
    }
  })
  .catch(error => {
    throw new NotFoundError(`Temperature not found`)
  });

}

module.exports = retrieveTemperature 
