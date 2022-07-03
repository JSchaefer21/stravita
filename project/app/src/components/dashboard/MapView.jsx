import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import calculateDistanceBetweenTwoPoints from '../../logic/calculateDistanceBetweenTwoPoints'

function MapView({points}) {   

    let centerPosition= []
    let markerPosition= []
    let first, last
    let dis
    let polyline

    const greenIcon = new L.icon({ iconUrl: require('../../icons/2x-green.png'), iconSize: [20, 32], iconAnchor: [10, 32] })
    const redIcon = new L.icon({ iconUrl: require('../../icons/2x-red.png'), iconSize: [20, 32], iconAnchor: [10, 32] })
    const blueIcon = new L.icon({ iconUrl: require('../../icons/blue.png'), iconSize: [14, 22], iconAnchor: [7, 22] })
 
    const length = points.length
    
    if (length > 1) { // calculate the midle point between the first and last point
        first = [points[0].latitude, points[0].longitude]
        last = [points[length-1].latitude, points[length-1].longitude]

        let n=0
        points.map( elem => n += elem.latitude)
        const lat = n/length
        n=0
        points.map( elem => n += elem.longitude)
        const lng = n/length

        centerPosition = [lat, lng]
        markerPosition = [points[0].latitude, points[0].longitude]

        dis = calculateDistanceBetweenTwoPoints(first, last)/1000
        

        // create a line between points
        polyline = []
        points.forEach(point => polyline.push([point.latitude, point.longitude]))       
    }
    else {
        centerPosition = [points[0].latitude, points[0].longitude]
        markerPosition = centerPosition
    }

    const blueOptions = { color: '#4D83F9', weight: 2}

    return <MapContainer 
            style={{width: '100%', height: '100%'}} 
            center={centerPosition} 
            zoom={ (dis > 20)? 10: (dis > 7)? 11: (dis > 3.5)? 12: (dis > 2.5)? 13: 14 } 
            zoomControl={false}
            scrollWheelZoom={true}
            attributionControl={false}
            doubleClickZoom={false}
            dragging={false}
            >
        <TileLayer attribution=' <a href="https://www.openstreetmap.org/copyright"></a> '
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={markerPosition}  icon={greenIcon}>
        </Marker>

        { points.slice(1, -1).map(point => {     // le quito el primer y ultimo elemento
            return (
                <Marker position={[point.latitude, point.longitude]} icon={blueIcon} key={point._id}>
                </Marker> )
        })}

        {(length > 1)?     // si hay mas de uno pinto el ultimo
            (<Marker position={last} icon={redIcon}>
            </Marker> ) : <></>
        }

        { polyline && <Polyline pathOptions={blueOptions} positions={polyline} /> }

  </MapContainer>
}

export default MapView