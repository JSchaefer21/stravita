import { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import retrieveUserActivities from '../../logic/retrieveUserActivities'
import ActivityItem from '../dashboard/ActivityItem'

function DeleteActivity({ timestamp }) {

    const { handleFeedback } = useContext(Context)
    const [activities, setActivities] = useState(null)


    useEffect(() => {
        loadActivities()
    }, [timestamp])

    const loadActivities = async() => {
        try {
            const activities =  await retrieveUserActivities(sessionStorage.token)
            setActivities(activities)
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const handleRemoveActivity = activityId => {
        const _activities = activities.filter( activity => activity.id !== activityId)
        setActivities(_activities)
    }


    return activities && activities.length ?
        <ul className = "Activities__list mw overflow" >
            {activities.map(activitie => <li className="mw" key={activitie.id} >  
                <ActivityItem activity={activitie} setDelete={true} onRemove={handleRemoveActivity}/>
            </li>)}
        </ul>
        : 
        <div className="Container Padding">
            <p> No activities yet </p>
        </div>
}

export default DeleteActivity