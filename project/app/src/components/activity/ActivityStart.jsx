/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import Map from './Map'
import createActivity from '../../logic/createActivity'
import addPointToActivity from '../../logic/addPointToActivity'
import '../../styles/Activity.sass'

function ActivityStart(props) {

    const [sport, setSport] = useState(null)
    const [position, setPosition] = useState(null)
    const watchId = useRef(null)
    const { handleFeedback } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        setSport('Ride')
        watchPosition()
    }, [])


    const watchPosition = () => {
        if(!watchId.current) {
            watchId.current= navigator.geolocation.watchPosition(function(position) {
                setPosition([position.coords.latitude, position.coords.longitude, position.coords.altitude])
                //console.log('set position de Start')
            }, function(error){
                handleFeedback({ type: 'error', message: 'Position error' })
            }, { enableHighAccuracy: true, distanceFilter: 10, maximumAge: 10_000 })    
        }
    } 
    // timeout: 4000, tiempo permitido para optener la posicion yen caso contrario salta error
    // maximun age, tiempo maximo que utilizara la posicion encontrada 
    
    const handleStartClick = async() => {
        try {
            if(position) {
                const token = sessionStorage.token
                const activityId = await createActivity(token, sport)
                await addPointToActivity(sessionStorage.token, activityId, position)
                navigator.geolocation.clearWatch(watchId.current)
                props.onStartClicked(activityId, position)
            }
            else handleFeedback({ type: 'error', message: 'Position not found (https)' })
        } catch (error) {
            handleFeedback({ type: 'error', message: error.message })
        }   
    }

    const handleCloseClick = () => navigate('/')
    
    const handleBikeClick = () => {
        setSport('Ride') 
        document.getElementById("bike").classList.add('Button__selected') 
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected') }
    const handleHikingClick = () => {
        setSport('Hike')
        document.getElementById("hike").classList.add('Button__selected') 
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') }
    const handleSkiClick = () => {
        setSport('Ski')
        document.getElementById("sky").classList.add('Button__selected') 
        document.getElementById("snow").classList.remove('Button__selected')
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') }
    const handleSnowClick = () => {
        setSport('Snowshoe')
        document.getElementById("snow").classList.add('Button__selected') 
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') }
    
    

    return  <div className="Container overflow mw mh">
        <header className="Activity__header">
            <button className="Activity__button--back" onClick={handleCloseClick}>Close</button>
            <h1 className="center">{sport}</h1>
        </header>


        <main className="Activity__body mw mh">
            { position && <Map position={[position[0], position[1]]} center={false}/> } 
        </main>

        
        <footer className="Activity__footer mw">
            <div className="Activity__footerContainer__selector">
                <button id="bike" className="Button__selected Activity__footer-icon material-symbols-outlined" onClick={handleBikeClick}>directions_bike</button>
                <button id="hike" className="Activity__footer-icon material-symbols-outlined" onClick={handleHikingClick}>hiking</button>
                <button id="sky" className="Activity__footer-icon material-symbols-outlined" onClick={handleSkiClick}>downhill_skiing</button>
                <button id="snow" className="Activity__footer-icon material-symbols-outlined" onClick={handleSnowClick}>snowshoeing</button>
            </div>
            <div className="Activity__footerContainer__buttons">
                <button className="Activity__button--start" onClick={handleStartClick}>START</button>         
            </div>
        </footer>

    </div> 
}

export default ActivityStart