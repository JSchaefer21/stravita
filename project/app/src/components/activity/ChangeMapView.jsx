
import { useMap } from 'react-leaflet';


function ChangeMapView(props) {
    const map = useMap();
    map.flyTo(props.position);
    
    return null;
}

export default ChangeMapView