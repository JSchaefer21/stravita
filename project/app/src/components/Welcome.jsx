import '../styles/Welcome.sass'

function Welcome (props) {

    const handleLoginLinkClick = event => {
        event.preventDefault()
        props.onLoginLinkClicked()
    }
    
    const handleRegisterLinkClick = event => {
        event.preventDefault()
        props.onRegisterLinkClicked()
    }

    return <div className="Container mh mw flex__end Welcome__image">
        <div className="Container mw Welcome__container">
            <h3>Do you already have an account?</h3>
            <a href="#" className="Welcome__button" onClick={handleLoginLinkClick}>Login</a>
            <h3>First time here?</h3>
            <a href="#" className="Welcome__button Welcome__button--register" onClick={handleRegisterLinkClick}>Register</a>
        </div>
    </div>
}

export default Welcome