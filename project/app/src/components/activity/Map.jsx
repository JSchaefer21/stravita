import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ChangeMapView from './ChangeMapView'

function Map({position, center, points}) {

    const newicon = new L.icon({
    iconUrl: require("../../icons/circle.png"),
    iconSize: [25, 25]
    })

    const greenIcon = new L.icon({ iconUrl: require('../../icons/2x-green.png'), iconSize: [25, 41], iconAnchor: [12, 41] })
    const blueIcon = new L.icon({ iconUrl: require('../../icons/blue.png'), iconSize: [20, 32], iconAnchor: [10, 32] })


   return   <MapContainer 
                style={{width: '100%', height: '100%'}} 
                center={position} 
                zoom={17} 
                zoomControl={false}
                /* scrollWheelZoom={false} */
                attributionControl={false}
                > 
                {center && <ChangeMapView position={position} /> }
                <TileLayer
                attribution=' <a href="https://www.openstreetmap.org/copyright"></a> '
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} icon={newicon}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>


                { points && <Marker position={[points[0][0], points[0][1]]}  icon={greenIcon}>
                    <Popup> </Popup>
                </Marker> }
                { points && points.slice(1).map((point, index) => {     // le quito el primer y ultimo elemento
                    return (
                        <Marker position={[point[0], point[1]]} icon={blueIcon} key={index}>
                            <Popup> </Popup>
                        </Marker> )
                })}
            </MapContainer> 

}

export default Map