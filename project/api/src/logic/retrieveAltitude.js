const axios = require('axios');
const { NotFoundError } = require('errors');
const { validatePosition } = require('validators')

function retrieveAltitude(latitude, longitude) {
  validatePosition([latitude, longitude])

return axios
  .get(`https://api.open-elevation.com/api/v1/lookup?locations=${latitude},${longitude}`)
  .then(res => {
    if(res.status === 200){
        const altitude = res.data.results[0].elevation;
        return altitude;
    }
  })
  .catch(error => {
    throw new NotFoundError(`Altitude not found`)
  });

}

module.exports = retrieveAltitude 
