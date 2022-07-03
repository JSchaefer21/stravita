import { useContext } from 'react'
import Context from './Context'
import registerUser from '../logic/registerUser'
import authenticateUser from '../logic/authenticateUser'
import '../styles/Welcome.sass'

function Register (props){

    const { handleFeedback } = useContext(Context)

    const handleWelcomeLinkClick = event => {
        event.preventDefault()
        props.onWelcomeLinkClicked()
    }

    const handleFormSubmit = async(event) => {
        event.preventDefault()

        const name = event.target.name.value
        const username = event.target.username.value
        const email = event.target.email.value
        const password = event.target.password.value
        const repeatPassword = event.target.repeatPassword.value

        if (password !== repeatPassword) {
            handleFeedback({ type: 'error', message: 'Password does not match'})
            return 
        }

        try {
            await registerUser(name, username, password, email)
            
            const token = await authenticateUser(username, password)

            sessionStorage.token = token
            props.onUserLoggedIn()

        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    return <div className="Container mw mh flex__start">
        <header className="Welcome__header">
            <button className="Welcome__button-back">
                <span className="Welcome__icon-back material-symbols-outlined">arrow_back_ios_new</span>
                <h2 className="Welcome__text-back" onClick={handleWelcomeLinkClick}>Back</h2>
            </button>
            <h1 className="center">Register</h1>
        </header>
        <form className="Container mw Welcome__form" onSubmit={handleFormSubmit}>
            <input className="Welcome__imput" type="text" name="name" placeholder=" Name"/>
            <input className="Welcome__imput" type="text" name="username" placeholder=" Username"/>
            <input className="Welcome__imput" type="email" name="email" placeholder=" Email"/>
            <input className="Welcome__imput" type="password" name="password" placeholder=" Password"/>
            <input className="Welcome__imput" type="password" name="repeatPassword" placeholder=" Confirm password"/>
            <button className="Welcome__button Welcome__button--form">Register</button>
        </form>
    </div>
}

export default Register