import calculateTotalDistance from './calculateTotalDistance'

function calculateActivityData(points) {
    
    let data = {}

    data.altitude = (points[points.length-1].altitude-points[0].altitude).toFixed(0)
    const seconds = (points[points.length-1].date.getTime() - points[0].date.getTime()) / 1000; // calculate the ssecond between start and end
    data.time = new Date(seconds * 1000).toISOString().substring(11, 16) // convert the senconds to time (hours,minutes)
    data.distance = (calculateTotalDistance(points)/1000).toFixed(2)  // calculade the distance between all the points and convert to km
    
    return data
}

export default calculateActivityData