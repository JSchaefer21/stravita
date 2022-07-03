/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useContext } from 'react'
import Context from '../Context'
import Map from './Map'
import LiveInfo from './LiveInfo'
import addPointToActivity from '../../logic/addPointToActivity'
import retrieveActivity from '../../logic/retrieveActivity'

function ActivityRecord(props) {

    const [timestamp, setTimestamp] = useState(null)
    const [position, setPosition] = useState(null)
    const [points, setPoints] = useState(null)
    const [view, setView] = useState('map')
    const [unlock, setUnlock] = useState(0)
    const [hide, setHide] = useState(false)
    //const [activated, setActivated] = useState(false)
    const activated = useRef(false)
    const watchId = useRef(null)
    const { handleFeedback } = useContext(Context)

    
    useEffect(() => {
        watchPosition()
        if(props.point) {
            setPoints([props.point])
        }
        else {
            resumeActivity()
        }
    }, [])

    const resumeActivity = async() => {
        try {
            const activity = await retrieveActivity(sessionStorage.token, props.activityId)
            setPoints([])
            activity.points.forEach(point =>{ 
                setPoints(points => [...points, 
                    [point.latitude, point.longitude]])
            })
        } catch (error) {
            handleFeedback({ type: 'error', message: error.message })
        } 
    }

    const watchPosition = () => {
        if(!watchId.current) {
            watchId.current = navigator.geolocation.watchPosition(function(pos) {
                setPosition([pos.coords.latitude, pos.coords.longitude, pos.coords.altitude])
                //console.log('set position record')
                if(activated.current) {
                    handleSaveClick([pos.coords.latitude, pos.coords.longitude, pos.coords.altitude])
                }
            }, function(error){
                handleFeedback({ type: 'error', message: 'Position error' })
            }, { enableHighAccuracy: true, distanceFilter: 10,  maximumAge: 80_000 })
        }
    }

    const handleSaveClick = async(pos) => {
        try {
            if(pos || position) {
                if (position) pos = position
                await addPointToActivity(sessionStorage.token, props.activityId, pos)
                handleFeedback({ type: 'success', message: 'Point saved!' })
                setPoints(points => [...points, 
                    pos])
                setTimestamp(Date.now())
            }
            else handleFeedback({ type: 'error', message: 'Position not found' })
        } catch (error) {
            handleFeedback({ type: 'error', message: error.message })
        }  
    }

    const handleFinishClick = async() => {
        try {
            if(position) {
                await addPointToActivity(sessionStorage.token, props.activityId, position)
                navigator.geolocation.clearWatch(watchId.current)
                props.onFinishClicked()
            }
            else handleFeedback({ type: 'error', message: 'Position not found' })
        } catch (error) {
            handleFeedback({ type: 'error', message: error.message })
        } 
    }

    const handleTimeClick = () => setView('timer')
    const handleMapClick = () => setView('map')


    /* ------ turbo mode for developer ------- */
    const handleDevelopClick = () => {
        setUnlock(unlock+1)
        if (unlock === 5) setHide(true)
        else if (unlock > 5) { setHide(false); activated.current=false; setUnlock(0) }
    }
    
    const handleTurboClick = () => {
        if(activated.current) {
            document.getElementById('dev').classList.remove('dev-activated')
            activated.current = false }
        else {
            document.getElementById('dev').classList.add('dev-activated')
            activated.current = true }
    }
    /* ------   ------------   ------- */



    return  <div className="Container overflow mw mh">
    
    <button className="Activity__button-hide" onClick={handleDevelopClick}></button>
    {hide && <button id='dev' className="Activity__button-dev material-symbols-outlined" onClick={handleTurboClick}>offline_bolt</button>}

    <main className="Activity__body mw mh">
        { view === 'map' && position && points && <Map position={position} center={true} points={points}/> } 
        { view === 'timer' && <LiveInfo activityId={props.activityId} onPointRegistered={timestamp}/> } 
    </main>

 
    <footer className="Activity__footer-record mw"> 
        <button className="Activity__footerButton__selector material-symbols-outlined" onClick={handleTimeClick}>Timer</button>
        <button className="Activity__button--register" onClick={handleSaveClick}>RECORD</button>    
        <button className="Activity__button--start" onClick={handleFinishClick}>FINISH</button>      
        <button className="Activity__footerButton__selector material-symbols-outlined" onClick={handleMapClick}>Pin_drop</button>
    </footer>

    </div>
}

export default ActivityRecord