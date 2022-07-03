import { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import retrieveActivity from '../../logic/retrieveActivity'
import calculateTotalDistance from '../../logic/calculateTotalDistance'
import Timer from './Timer'
import '../../styles/LiveInfo.sass'

function LiveInfo({activityId, onPointRegistered}) {

    const [ activity, setActivity ] = useState(null)
    const [ totalDistance, setTotalDistance ] = useState(null)
    const [ altitude, setAltitude ] = useState(null)
    const [ elevation, setElevation ] = useState(null)
    const [ initialTime, setInitialTime ] = useState(null)
    const { handleFeedback } = useContext(Context)


    useEffect(()=>{
        getActivity()
    },[onPointRegistered])

    const getActivity = async() => {
        try {
            const activity = await retrieveActivity(sessionStorage.token, activityId)    
            setActivity(activity)
    
            const initialTime = new Date()-activity.date
            const h = new Date(initialTime).getHours()-1
            const m = new Date(initialTime).getMinutes()
            const s = new Date(initialTime).getSeconds()
            setInitialTime({h,m,s})

            setTotalDistance((calculateTotalDistance(activity.points)/1000).toFixed(2))
            
            setAltitude((activity.points[activity.points.length-1].altitude-activity.points[0].altitude).toFixed(0))
            setElevation((activity.points[activity.points.length-1].altitude).toFixed(0))
            
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }


    return ( <div className="Live mw mh">

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
        </div>  }
    </div>  
    )
}

export default LiveInfo

