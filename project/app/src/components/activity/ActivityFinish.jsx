import React, { useContext, useState } from 'react'
import Context from '../Context'
import { useNavigate } from 'react-router-dom'
import updateActivity from '../../logic/updateActivity'
import deleteActivity from '../../logic/deleteActivity'
import Compress from 'compress.js'

function ActivityFinish(props) {

    const { handleFeedback } = useContext(Context) 
    const navigate = useNavigate()
    const [images, setImages] = useState(null)

    const handleSaveClick = async(event) => {
        event.preventDefault()
        try {
            const title = event.target.title.value
            const text = event.target.text.value
            let audience = event.target.audience.value
            if(audience === 'private')
            audience=true
            else audience=false
            const sport = event.target.sport.value
            const dificult = event.target.dificult.value
            
            await updateActivity(sessionStorage.token, props.activityId, title, text, audience, sport, dificult, images)
            navigate('/')
        } catch (error) {
            handleFeedback({ type: 'error', message: error.message })
        } 
    }

    const handleDeleteClick = async() => {
        try {
            await deleteActivity(sessionStorage.token, props.activityId)     
            navigate('/')
        } catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const handleContinueClick = () => {
        props.onContinueClicked()
    }

    const onImageChange = async(e) => {
        setImages([])
        const files = e.target.files

        for (const file of files) {
            const blob = await resizeImage(file)
            const base64 = await convertToBase64(blob)
            setImages(images => [...images, base64])
        }
    }

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader()
          fileReader.readAsDataURL(file)
          fileReader.onload = () => {
            resolve(fileReader.result)
          }
          fileReader.onerror = (error) => {
            reject(error)
          }
        })
    }
    
    const compress = new Compress()

    const resizeImage = async(file) => {
        const resizedImage = await compress.compress([file], {
          size: 2, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 250, // the max width of the output image, defaults to 1920px
          maxHeight: 250, // the max height of the output image, defaults to 1920px
          resize: true // defaults to true, set false if you do not want to resize the image width and height
        })
        const img = resizedImage[0];
        const base64str = img.data
        const imgExt = img.ext
        const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
        return resizedFiile;
    }

    
    return  <div className="Container overflow mw mh">
        <header className="Activity__header">
            <button className="Activity__button--back" onClick={handleContinueClick}>Resume</button>
            <h1 className="center">Save activity</h1>
        </header>

        <main className="Finish__body mw mh overflow">
            <form id='myform' className="Container Finish__form mw" onSubmit={handleSaveClick}>
                <h1 className="Finish__form-text">Title</h1>
                <input className="Finish__input-title" type="text" name="title" placeholder=" Mountain Activity" />
                <h1 className="Finish__form-text">Notes</h1>
                <textarea className="Finish__input-text" type="text" name="text" placeholder=" " />
                <select className="Finish__input-selector" name="sport">
                    <option value=''>sport</option>
                    <option value="Ride">Ride</option>
                    <option value="Hike">Hike</option>
                    <option value="Ski">Ski</option>
                    <option value="Snowshoe">Snowshoe</option>
                </select>
                <select className="Finish__input-selector" name="dificult">
                    <option value="Easy">dificulty</option>
                    <option value="Easy">easy</option>
                    <option value="Moderate">moderate</option>
                    <option value="Hard">hard</option>
                    <option value="Very hard">very hard</option>
                </select>
                <select className="Finish__input-selector" name="audience">
                    <option defaultValue="public">public</option>
                    <option value="private">private</option>
                </select>
                
                <h1 className="Finish__form-text">Images</h1>
                <input className="Finish__input-file" onChange={onImageChange} type="file" />

              {/*   multiple accept="image/*" */}

            </form>
            <button className="Finish__button-delete" onClick={handleDeleteClick}>Discard Activity</button>           
        </main>

        <footer className="Activity__footer-finish">
            <div className="Activity__footerContainer__buttons">
                <button className="Activity__button-finish" form='myform' type="submit">Save Activity</button>         
            </div>
        </footer>

    </div> 
}

export default ActivityFinish