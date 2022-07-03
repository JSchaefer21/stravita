import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { isJwtValid } from 'validators'
import Context from '../Context'
import ActivityList from './ActivityList'
import CommentList from './CommentList'
import Settings from '../settings/Settings'
import ChangeName from '../settings/ChangeName'
import ChangePassword from '../settings/ChangePassword'
import ChangeEmail from '../settings/ChangeEmail'
import ChangeFoto from '../settings/ChangeFoto'
import DeleteUser from '../settings/DeleteUser'
import DeleteActivity from '../settings/DeleteActivity'
import retrieveUser from '../../logic/retrieveUser'
import '../../styles/Home.sass'


function Home(props) {
    const [view, setView] = useState(null)
    const [back, setBack] = useState(null)
    const [activityId, setActivityId] = useState(null)
    const { handleFeedback } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        validateUser()
    }, [] ) 

    const validateUser = async() => {
        try {
        if (isJwtValid(sessionStorage.token)) {
            await retrieveUser(sessionStorage.token)
            setView('Home')
            } else {
                navigate('/') 
                handleLogoutClick()
            } 
        } catch(error) {
            navigate('/welcome') 
            handleLogoutClick()
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const handleHomeClick = () => {
        setView('Home')
        document.getElementById("home").classList.add('Button__selected') 
        document.getElementById("homeL").classList.add('Button__selected') 
        document.getElementById("profile").classList.remove('Button__selected')
        document.getElementById("profileL").classList.remove('Button__selected') 
    }
    const handleActivityClick = () => navigate('/activity')
    const handleProfileClick = () => {
        setView('Profile')
        document.getElementById("home").classList.remove('Button__selected') 
        document.getElementById("homeL").classList.remove('Button__selected') 
        document.getElementById("profile").classList.add('Button__selected') 
        document.getElementById("profileL").classList.add('Button__selected') 
    }

    const handleSettingClick = () => {setView('Settings'); setBack('Profile')}

    const handleChangeNameClick = () => {setView('Change Name'); setBack('Settings')}
    const handleChangePasswordClick = () => {setView('Change Password'); setBack('Settings')}
    const handleChangeEmailClick = () => {setView('Change Email'); setBack('Settings')}
    const handleChangeFotoClick = () => {setView('Change Foto'); setBack('Settings')}
    const handleDeleteActivityClick = () => {setView('Delete Activity'); setBack('Settings')}
    const handleDeleteUserClick = () => {setView('Delete User'); setBack('Settings')}
    
    const handleLogoutClick = () => props.onUserLoggedOut()

    const handleDataChanged = () => handleBackClick()

    const handleBackClick = () => {
        if ( view === 'Comments')
            handleHomeClick()
        else if (view === 'Settings')
            handleProfileClick()
        else if (['Settings','Change Name','Change Password', 'Change Email', 'Change Foto', 'Delete Activity', 'Delete User'].includes(view))
            handleSettingClick()
    }

    const handleCommentClicked = (activityId) => {
        setView('Comments')
        setBack('Back')
        setActivityId(activityId)
    }
    


    return  isJwtValid(sessionStorage.token) ?
    <div className="Container Home__container overflow mw mh">
        <header className="Home__header">
            {(['Settings','Change Name','Change Password', 'Change Email', 'Change Foto', 'Delete Activity', 'Delete User', 'Comments'].includes(view)) 
                && <button className="Home__container-back" onClick={handleBackClick}>
                    <span className="Home__icon-back material-symbols-outlined">arrow_back_ios_new</span>
                    <h2 className="Home__button-back">{back}</h2>
                </button>}
            <h1 className="center">{view}</h1>
            {view === 'Profile' && <button className="Home__header--settings material-symbols-outlined" onClick={handleSettingClick}>Settings</button>}
        </header>


        <main className="Home__body mw mh overflow">
            {view === 'Home' && <ActivityList onCommentClicked={handleCommentClicked}/>}
            {view === 'Profile' && <ActivityList private={true} onCommentClicked={handleCommentClicked} />}

            {view === 'Settings' && <Settings onChangeNameClicked={handleChangeNameClick}
                onChangePasswordClicked={handleChangePasswordClick}
                onChangeEmailClicked={handleChangeEmailClick}
                onChangeFotoClicked={handleChangeFotoClick}
                onDeleteActivityClicked={handleDeleteActivityClick}
                onLogoutClicked={handleLogoutClick}
                onDeleteUserClicked={handleDeleteUserClick}/>}
            
            {view === 'Change Name' && <ChangeName onDataChanged={handleDataChanged}/>}
            {view === 'Change Password' && <ChangePassword onDataChanged={handleDataChanged}/>}
            {view === 'Change Email' && <ChangeEmail onDataChanged={handleDataChanged}/>}
            {view === 'Change Foto' && <ChangeFoto onDataChanged={handleDataChanged}/>}
            {view === 'Delete User' && <DeleteUser onDeletedUser={props.onDeletedUser}/>} 
            {view === 'Delete Activity' && <DeleteActivity />}

            {view === 'Comments' && <CommentList activityId={activityId}/>}

        </main>

        
        <footer className="Home__footer">
            <button className="Home__footer--container" onClick={handleHomeClick}>
                <span id="home" className="Button__selected Home__footer--icon material-symbols-outlined">home</span>
                <h2 id="homeL" className="Button__selected Home__footer--text" >Home</h2>
            </button>
            <button className="Home__footer--container" onClick={handleActivityClick}>
                <span className="Home__footer--icon material-symbols-outlined">radio_button_checked</span>
                <h2 className="Home__footer--text" >Record</h2>
            </button>
            <button className="Home__footer--container" onClick={handleProfileClick}>
                <span id="profile" className="Home__footer--icon material-symbols-outlined" >person</span>
                <h2 id="profileL" className="Home__footer--text" >Profile</h2>
            </button>
        </footer>

    </div> : <></>
}

export default Home