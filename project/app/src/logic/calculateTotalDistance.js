
function calculateTotalDistance(points) {
    
    let total = 0

    points.forEach(function(point, index) {

        if(index<points.length-1) {
            const lat1=point.latitude
            const lon1=point.longitude
            const lat2=points[index+1].latitude
            const lon2=points[index+1].longitude
        
            const R = 6371e3; // metres
            const φ1 = lat1 * Math.PI/180; // φ, λ in radians
            const φ2 = lat2 * Math.PI/180;
            const Δφ = (lat2-lat1) * Math.PI/180;
            const Δλ = (lon2-lon1) * Math.PI/180;
        
            const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ/2) * Math.sin(Δλ/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
            const d = R * c; // in metres

            total += d
        }
    })

    return total
}

export default calculateTotalDistance