import { useContext } from 'react'
import Context from '../Context'
import updateUserName from '../../logic/updateUserName'

function ChangeName(props) {

    const { handleFeedback } = useContext(Context)

    const handleSaveClick = async(event) => {
        event.preventDefault()
        const newName = event.target.name.value
        try {
            await updateUserName(sessionStorage.token, newName)
            handleFeedback({ type: 'success', message: 'Name changed'})
            props.onDataChanged()
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }


    return <div className="Container Settings__container mw">
        <form className="Container mw" onSubmit={handleSaveClick}>
            <input className="Settings__input" type="text" name="name" placeholder=" New name"/>
            <button className="Settings__button-submit">Save</button>
        </form>
    </div>
}

export default ChangeName