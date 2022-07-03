import { useState, useEffect, useContext } from 'react'
import Context from '../Context'
import retrieveActivities from '../../logic/retrieveActivities'
import retrieveUserActivities from '../../logic/retrieveUserActivities'
import retrieveSearchedActivities from '../../logic/retrieveSearchedActivities'
import retrieveSportActivities from '../../logic/retrieveSportActivities'
import ActivityItem from './ActivityItem'
import ProfileInfoHeader from './ProfileInfoHeader'
import '../../styles/ActivityList.sass'

function ActivityList(props) { 

    const { handleFeedback } = useContext(Context)
    const [activities, setActivities] = useState(null)
    const [timestamp, setTimestamp] = useState(null)

    useEffect(() => {
        loadActivities()
    }, [timestamp])

    const loadActivities = async() => {
        try {
            let activities
            
            if(props.private){
                activities = await retrieveUserActivities(sessionStorage.token)
            }
            else activities = await retrieveActivities(sessionStorage.token)
            setActivities(activities) 
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const handleActivityLikeClicked = () => setTimestamp(Date.now())

    const handleSearchClicked = async(event) => {
        event.preventDefault()
        const search = event.target.text.value
        
        if(search.length > 0){
        try {
            const activities = await retrieveSearchedActivities(sessionStorage.token, search)
            setActivities(activities) 
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
        }
    }

    const handleAllClick = () => {
        loadActivities() 
        document.getElementById("all").classList.add('Button__selected') 
        document.getElementById("bike").classList.remove('Button__selected')
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected') }
    const handleBikeClick = () => {
        loadSportActivities('Ride') 
        document.getElementById("bike").classList.add('Button__selected') 
        document.getElementById("all").classList.remove('Button__selected')
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected') }
    const handleHikingClick = () => {
        loadSportActivities('Hike')
        document.getElementById("hike").classList.add('Button__selected') 
        document.getElementById("all").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') }
    const handleSkiClick = () => {
        loadSportActivities('Ski')
        document.getElementById("sky").classList.add('Button__selected') 
        document.getElementById("all").classList.remove('Button__selected')
        document.getElementById("snow").classList.remove('Button__selected')
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') }
    const handleSnowClick = () => {
        loadSportActivities('Snowshoe')
        document.getElementById("snow").classList.add('Button__selected') 
        document.getElementById("all").classList.remove('Button__selected')
        document.getElementById("hike").classList.remove('Button__selected')
        document.getElementById("sky").classList.remove('Button__selected')
        document.getElementById("bike").classList.remove('Button__selected') 
    }

    const loadSportActivities = async(sport) => {
        try {          
            const activities = await retrieveSportActivities(sessionStorage.token, sport)
            setActivities(activities) 
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    return activities && <div className="ActivitiesList mw">

        {!props.private && <div className="ActivitiesList mw">
            <form className="ActivityList__form" onSubmit={handleSearchClicked}>
                <input className="ActivityList__imput" type="text" name="text" placeholder="Search activities"/>
                <button className="ActivityList__button-form material-symbols-outlined">Search</button>
            </form>

            <div className="ActivityList__search-icons">
                <button id="all" className="Button__selected Activity__search-icon" onClick={handleAllClick}>All</button>
                <button id="bike" className="Activity__search-icon material-symbols-outlined" onClick={handleBikeClick}>directions_bike</button>
                <button id="hike" className="Activity__search-icon material-symbols-outlined" onClick={handleHikingClick}>hiking</button>
                <button id="sky" className="Activity__search-icon material-symbols-outlined" onClick={handleSkiClick}>downhill_skiing</button>
                <button id="snow" className="Activity__search-icon material-symbols-outlined" onClick={handleSnowClick}>snowshoeing</button>
            </div>
        </div> }

        <ul className = "Activities__list mw overflow" >
            {props.private && activities && <li className="Activity__list--item">
                    <ProfileInfoHeader activities={activities}/>
                </li>}

            {activities.map(activitie => (activitie.points.length > 0) && <li className="Activity__list--item" key={activitie.id} >  
                <ActivityItem activity={activitie} onLikeClicked={handleActivityLikeClicked} 
                onCommentClicked={props.onCommentClicked} edit={props.private}/>
            </li>)}
        </ul>
    </div>
}

export default ActivityList