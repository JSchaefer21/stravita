import { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import retrieveActivity from '../../logic/retrieveActivity'
import retrieveTemperature from '../../logic/retrieveTemperature'
import calculateTotalDistance from '../../logic/calculateTotalDistance'
import Timer from './Timer'
import TimerCountdown from './TimerCountdown'
import '../../styles/LiveInfo.sass'

function LiveInfo({activityId, onPointRegistered}) {

    const [ activity, setActivity ] = useState(null)
    const [ totalDistance, setTotalDistance ] = useState(null)
    const [ altitude, setAltitude ] = useState(null)
    const [ elevation, setElevation ] = useState(null)
    const [ initialTime, setInitialTime ] = useState(null)
    const [ initialSunsetTime, setInitialSunsetTime ] = useState(null)
    const [ weather, setWeather ] = useState(null)
    const { handleFeedback } = useContext(Context)


    useEffect(()=>{
        getActivity()
    },[onPointRegistered])

    const getActivity = async() => {
        try {
            const activity = await retrieveActivity(sessionStorage.token, activityId)    
            setActivity(activity)
    
            const time = new Date()-activity.date
            let h = new Date(time).getHours()-1
            let m = new Date(time).getMinutes()
            let s = new Date(time).getSeconds()
            setInitialTime({h,m,s})
            
            setTotalDistance((calculateTotalDistance(activity.points)/1000).toFixed(2))
            
            setAltitude((activity.points[activity.points.length-1].altitude-activity.points[0].altitude).toFixed(0))
            setElevation((activity.points[activity.points.length-1].altitude).toFixed(0))

            const data = await retrieveTemperature(sessionStorage.token, activity.points[activity.points.length-1].latitude, activity.points[activity.points.length-1].longitude)    
            setWeather(data)
            const sunsetTime = (data.sunset*1000)-new Date()
            h = new Date(sunsetTime).getHours()-1
            m = new Date(sunsetTime).getMinutes()
            s = new Date(sunsetTime).getSeconds()
            setInitialSunsetTime({h,m,s})
            
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }
    

    return ( <div className="Live mw mh overflow">

        { elevation && initialTime &&  <Timer initialTime={initialTime}/> }

        { elevation && <div className="Live__container mw">  
            <div className="Live__container-data">
                {activity && <h2 className="Live__text">Points</h2>}
                {activity && <h2 className="Live__value">{activity.points.length}</h2>}
            </div>
            <div className="Live__container-data">
                {activity && <h2 className="Live__text">Elevation</h2>}
                {activity && <h2 className="Live__value">{elevation} m</h2>}
            </div>
            <div className="Live__container-data">
                {activity && <h2 className="Live__text">Elevation Gain</h2>}
                {activity && <h2 className="Live__value">{altitude} m</h2>}
            </div>
            <div className="Live__container-data">
                {activity && <h2 className="Live__text">Distance</h2>}
                {activity && <h2 className="Live__value">{totalDistance} km</h2>}
            </div>  
            {initialSunsetTime && <div className="Live__container-data">
                {<h2 className="Live__text">Time for sunset</h2>}
                {<TimerCountdown initialTime={initialSunsetTime}/>}
            </div>}  
            {weather && <div className="Live__container-data--weather mw">
                    <div className="Live__container-data">
                        <h2 className="Live__text--weather">Temperature</h2>
                        <h2 className="Live__value--weather">{weather.temp} ºC</h2>
                    </div>
                    <div className="Live__container-data">
                        <h2 className="Live__text--weather">Wind speed</h2>
                        <h2 className="Live__value--weather">{weather.wind} km/h</h2>
                    </div>
                    <div className="Live__container-data">
                        <h2 className="Live__text--weather">Weather</h2>
                        <h2 className="Live__value--weather">{weather.text}</h2>
                    </div>
                </div>}  
        </div>  }
    </div>  
    )
}

export default LiveInfo

