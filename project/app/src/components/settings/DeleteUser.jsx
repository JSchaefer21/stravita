import { useContext, useState } from 'react'
import Context from '../Context'
import deleteUser from '../../logic/deleteUser'

function DeleteUser(props) {

    const [view, setView] = useState('delete')
    const [password, setPassword] = useState(null)
    const { handleFeedback } = useContext(Context)

    const handleDeleteClick = (event) => {
        event.preventDefault()
        setPassword(event.target.elemento.value)
        setView('confirm')
    }

    const handleConfirmClick = async() => {
        try {
            await deleteUser(sessionStorage.token, password)
            handleFeedback({ type: 'success', message: 'User deleted'})
            delete sessionStorage.token
            props.onDeletedUser()
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
        setPassword(null)
        setView('delete')
    }


    return <div className="Container Settings__container mw">
        {view === 'delete' && <form className="Container mw" onSubmit={handleDeleteClick}>
            <input className="Settings__input" type="password" name="elemento" placeholder=" Confirm your password"/>
            <button className="Settings__button-submit">Delete</button>
        </form> }

        {view === 'confirm' && <div className="Container mw">
            <p className="Settings__delete-text">Are you sure you want to delete your user and all your activities permanetly?</p>
            <button className="Settings__button-submit Settings__button-sub-delete" onClick={handleConfirmClick}>Delete</button>
        </div> }
    </div>
}

export default DeleteUser