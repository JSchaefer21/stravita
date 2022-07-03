import { useContext } from 'react'
import Context from './Context'
import authenticateUser from '../logic/authenticateUser'
import '../styles/Welcome.sass'

function Login (props) {

    const { handleFeedback } = useContext(Context)

    const handleWelcomeLinkClick = event => {
        event.preventDefault()
        props.onWelcomeLinkClicked()
    }

    const handleFormSubmit = async(event) => {
        event.preventDefault()
        const username = event.target.username.value
        const password = event.target.password.value

        try {
            const token = await authenticateUser(username, password)
            sessionStorage.token = token
            props.onUserLoggedIn()
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    return <div className="Container mw mh flex__start">
        <header className="Welcome__header">
            <button className="Welcome__button-back" onClick={handleWelcomeLinkClick}>
                <span className="Welcome__icon-back material-symbols-outlined">arrow_back_ios_new</span>
                <h2 className="Welcome__text-back" >Back</h2>
            </button>
            <h1 className="center">Login</h1>
        </header>
        <form className="Container mw Welcome__form" onSubmit={handleFormSubmit}>
            <input className="Welcome__imput" type="text" name="username" placeholder=" Username"/>
            <input className="Welcome__imput" type="password" name="password" placeholder=" Password"/>
            <button className="Welcome__button Welcome__button--form">Login</button>
        </form>
    </div>
}

export default Login