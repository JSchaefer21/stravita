import { useContext, useState } from 'react'
import Context from '../Context'
import updateUserFoto from '../../logic/updateUserFoto'
import Compress from 'compress.js'

function ChangeFoto(props) {

    const [image, setImage] = useState(null)
    const { handleFeedback } = useContext(Context)

    const handleSaveClick = async(event) => {
        event.preventDefault()
        if(image) {
            try {
                await updateUserFoto(sessionStorage.token, image)
                handleFeedback({ type: 'success', message: 'Foto changed'})
                props.onDataChanged()
            } catch(error) {
                handleFeedback({ type: 'error', message: error.message})
            }
        }
    }

    const handleClearClick = () => {
        setImage(null)
    }
  
    const onImageChange = async(e) => {
        const file = e.target.files[0]
        const blob = await resizeImage(file)
        const base64 = await convertToBase64(blob)
        setImage(base64)
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
          size: 1, // the max size in MB, defaults to 2MB
          quality: 1, // the quality of the image, max is 1,
          maxWidth: 200, // the max width of the output image, defaults to 1920px
          maxHeight: 200, // the max height of the output image, defaults to 1920px
          resize: true // defaults to true, set false if you do not want to resize the image width and height
        })
        const img = resizedImage[0];
        const base64str = img.data
        const imgExt = img.ext
        const resizedFiile = Compress.convertBase64ToFile(base64str, imgExt)
        return resizedFiile;
    }


    return <div className="Container Settings__container mw">
        {!image && <div className="Foto__view-empty"></div>}
        {image && <img className='Foto__view-image' src={image}/>}
        <button className="Settings__button-clear" onClick={handleClearClick}>Clear</button>

        <form className="Container mw" onSubmit={handleSaveClick}>
            <input className="Settings__input-foto" onChange={onImageChange} type="file" />
            <button className="Settings__button-submit">Save</button>
        </form>
    </div>
}

export default ChangeFoto