/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { isJwtValid } from 'validators'
import ActivityStart from './ActivityStart'
import ActivityRecord from './ActivityRecord'
import ActivityFinish from './ActivityFinish'

function ActivityMain() {

    const [view, setView] = useState(null)
    const [point, setPoint] = useState([])
    const [activityId, setActivityId] = useState(null)
    const navigate = useNavigate()    
    const state = useLocation().state
    
    useEffect(() => {
        if (isJwtValid(sessionStorage.token)) {
            if(state) {
                setActivityId(state.activityId)
                setPoint(false)
                setView('record')
            }
            else
                setView('start')
            return
        } else navigate('/welcome')
    }, [])


    const handleStartClicked = (activityId, position) => {
        setActivityId(activityId)
        setPoint(position)
        setView('record')
    }
    const handleFinishClicked = () => setView('finish') 
    const handleContinueClicked = () => { setPoint(false); setView('record') }
    

    return  isJwtValid(sessionStorage.token) ?

        <div className="Container overflow mw mh">
            { view === 'start' &&   <ActivityStart onStartClicked={handleStartClicked}/> }
            { view === 'record' &&   <ActivityRecord activityId={activityId} point={point} onFinishClicked={handleFinishClicked}/> }
            { view === 'finish' &&   <ActivityFinish activityId={activityId} onContinueClicked={handleContinueClicked}/> }
        </div> : <></>
}

export default ActivityMain