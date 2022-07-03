import { useContext } from 'react'
import Context from '../Context'
import updateUserEmail from '../../logic/updateUserEmail'
import '../../styles/Settings.sass'

function ChangeEmail(props) {

    const { handleFeedback } = useContext(Context)

    const handleSaveClick = async(event) => {
        event.preventDefault()
        const email = event.target.email.value
        const confirmEmail = event.target.confirmEmail.value

        if (email !== confirmEmail) {
            handleFeedback({ type: 'error', message: 'Email does not match'})
            return 
        }

        try {
            await updateUserEmail(sessionStorage.token, email)
            handleFeedback({ type: 'success', message: 'Email changed'})
            props.onDataChanged()
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }


    return <div className="Container Settings__container mw">
        <form className="Container mw" onSubmit={handleSaveClick}>
            <input className="Settings__input" type="text" name="email" placeholder=" New email"/>
            <input className="Settings__input" type="text" name="confirmEmail" placeholder=" Confirm new email"/>
            <button className="Settings__button-submit">Save</button>
        </form>
    </div>
}

export default ChangeEmail