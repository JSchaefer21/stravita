import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import deleteActivity from '../../logic/deleteActivity'
import toggleLikeActivity from '../../logic/toggleLikeActivity'
import MapView from './MapView'
import calculateActivityData from '../../logic/calculateActivityData'
import '../../styles/ActivityItem.sass'

function ActivityItem (props) {
    
    const { handleFeedback } = useContext(Context)
    const { activity, setDelete, onRemove, onLikeClicked } = props
    const [editable, setEditable] = useState(null)
    const [imgview, setImgview] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        let dateNow = new Date()
        const hours = Math.abs(dateNow - activity.date) / 36e5
        if(props.edit && hours<6)
            setEditable(true)
    }, [])

    
    const handleDeleteClick = async() => {
        const activityId= activity.id
        try {
            await deleteActivity(sessionStorage.token, activityId) 
            onRemove(activityId)
            handleFeedback({ type: 'success', message: 'Activity deleted'})
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const handleLikeClick = async() => {
        try {
            await toggleLikeActivity(sessionStorage.token, activity.id)
            onLikeClicked()
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }
    
    const handleCommentClick = () => {
        props.onCommentClicked(activity.id)
    }

    const handleImagesClick = () => {
        if (imgview) { setImgview(false) }
        else setImgview(true)
    }


    const handleResumeClick = () => {
        navigate('/activity', {state: {activityId: activity.id}})
    }
    
    const { likes: { length : likes }, comments: { length : comments }, date, title, user, points, images } = activity
    const data = calculateActivityData(points)
    
    const timeOptions = {hour:'numeric', minute:'numeric' , day:'numeric', month:'numeric', year:'numeric'  }
    
    return <div>
        <div className="ActivityItem__header">
            <div className="Header__container-name"> 
                <div className="Header__container-foto">
                    {user && user.foto && <img className='Foto__view-activity' src={user.foto}/>}
                    <div className={"Header__container-name-date"}> 
                        <div className={"Header__container-resume"}>   
                            <h2 className={"Header__name"}>{(user)? user.name: 'User deleted'}</h2>
                            {editable && <button className="Header__button-resume" onClick={handleResumeClick}>resume</button>}
                        </div>
                        <div className={"Header__container--date"}>
                            {activity.sport === "Ride" && <span className="Header__icon material-symbols-outlined" >directions_bike</span>}
                            {activity.sport === "Hike" && <span className="Header__icon material-symbols-outlined" >hiking</span>}
                            {activity.sport === "Ski" && <span className="Header__icon material-symbols-outlined" >downhill_skiing</span>}
                            {activity.sport === "Snowshoe" && <span className="Header__icon material-symbols-outlined"  >snowshoeing</span>}
                            <h2 className={"Header__date"}>{date.toLocaleDateString("es-ES", timeOptions)}</h2>
                        </div>
                    </div>
                </div>
                <h2 className={"Header__title"}>{title}</h2>
            </div>
            <div className={"Header__container--data"}>   
                <div className={"Header__data"}>  
                    <h2 className={"Header__data--name"}>Distance</h2>
                    <h2 className={"Header__data--value"}>{data.distance} Km</h2>
                </div>            
                <div className={"Header__data"}>  
                    <h2 className={"Header__data--name"}>Elev Gain</h2>
                    <h2 className={"Header__data--value"}>{(data.altitude === '-0')? 0 : data.altitude} m</h2>
                </div>            
                <div className={"Header__data"}>  
                    <h2 className={"Header__data--name"}>Time</h2>
                    <h2 className={"Header__data--value"}>{data.time}</h2>
                </div>            
            </div>
        </div>

        { setDelete && <div className='Container'> 
            <button className="ActivityItem__button--delete" onClick={handleDeleteClick}>Delete Activity</button> 
        </div> }

        { !setDelete && points.length>0 && <div className='ActivityItem__container--map'>
            <MapView points={points}/>
        </div> }

        { !setDelete && <div className='ActivityItem__footer mw'>
            <button className='ActivityItem__footer-button Button__borderR' onClick={handleLikeClick}>
                { likes>0 && <h2 className='ActivityItem__footer-number'>{likes}</h2> }
                <span className='ActivityItem__footer-icon material-symbols-outlined' >thumb_up</span>
            </button>
            <button className='ActivityItem__footer-button Button__borderR' onClick={handleCommentClick}>
                { comments>0 && <h2 className='ActivityItem__footer-number'>{comments}</h2> }
                <span className='ActivityItem__footer-icon material-symbols-outlined' >chat</span>
            </button>
            <button className='ActivityItem__footer-button' onClick={handleImagesClick}>
                { images && images.length>0 && <h2 className='ActivityItem__footer-number'>{images.length}</h2> }
                <span className='ActivityItem__footer-icon material-symbols-outlined' >photo_library</span>
            </button>
        </div> }

        { !setDelete && images && imgview && (images.length>0) ? <div className='ActivityItem__image-movement'>
            {images.map((image, index)=> <img className='ActivityItem__image' src={image}  key={index}/>)}
            <div className='ActivityItem__footer mw'>
                <button className='ActivityItem__footer--button mw material-symbols-outlined' onClick={handleImagesClick}>expand_less</button>
            </div>
            </div>: '' }

    </div>
}

export default ActivityItem