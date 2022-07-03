import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { isJwtValid } from 'validators'
import Context from './Context'
import Feedback from './Feedback'
import Welcome from './Welcome'
import Login from './Login'
import Register from './Register'
import Home from './dashboard/Home'
import ActivityMain from './activity/ActivityMain'
import '../styles/App.sass'

function App () {

    const [feedback, setFeedback] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (isJwtValid(sessionStorage.token))
            navigate('/')
        else
            handleUserLogout()
    }, [])

    const handleUserLogout = () => {
        delete sessionStorage.token

        handleWelcomeNavigation()
    }
    
    const handleWelcomeNavigation = () => navigate('/welcome')
    const handleLoginNavigation = () => navigate('/login')
    const handleRegisterNavigation = () => navigate('/register')
    const handleUserLoggedIn = () => navigate('/')

    const handleFeedback = feedback => { 
        setFeedback(feedback) }

    const handleFeedbackTimeout = () => setFeedback(null)
    const handleOnDeletedUser = () => navigate('/welcome')


    return <Context.Provider value={{ handleFeedback }} >
        <div className="App">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            <Routes>
                <Route path="/welcome" element={<Welcome onLoginLinkClicked={handleLoginNavigation} onRegisterLinkClicked={handleRegisterNavigation} />} />
                <Route path="/login" element={<Login onUserLoggedIn={handleUserLoggedIn} onWelcomeLinkClicked={handleWelcomeNavigation} />} />
                <Route path="/register" element={<Register onUserLoggedIn={handleUserLoggedIn} onWelcomeLinkClicked={handleWelcomeNavigation} />} />
                <Route path="/" element={<Home onUserLoggedOut={handleUserLogout} onDeletedUser={handleOnDeletedUser}/>} />
                <Route path="/activity" element={<ActivityMain />} />
            </Routes>
            {feedback && <Feedback type={feedback.type} message={feedback.message} callback={handleFeedbackTimeout}/> } 
        </div>
    </Context.Provider>
}

export default App