import calculateUserData from '../../logic/calculateUserData'
import { isJwtValid } from 'validators'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import retrieveUser from '../../logic/retrieveUser'
import Context from '../Context'
import '../../styles/ProfileInfo.sass'

function ProfileInfoHeader ({activities}) {
    
    const navigate = useNavigate()
    const { handleFeedback } = useContext(Context)
    const [name, setName] = useState(null)
    const [foto, setFoto] = useState(null)

    useEffect(() => {
        getUserName()
    }, [] ) 

    const getUserName = async() => {
        try {
        if (isJwtValid(sessionStorage.token)) {
            const result = await retrieveUser(sessionStorage.token)
            setName(result.name)
            setFoto(result.foto)
        } else {
            navigate('/') 
        }}catch(error) {
            handleFeedback({ type: 'error', message: error.message})
        }
    }

    const data = calculateUserData(activities)
    
    return <div className='Info__header'>

            <div className={"Info__container--name"}>
                {foto && <img className="Info__foto" src={foto}/> }
                <h2 className={"Info__name"}>{name}</h2>
            </div>
            <div className={"Info__container"}>   
                <div className={"Info__container--data"}>  
                    <h2 className={"Info__data--title"}>Total</h2>
                    <h2 className={"Info__data--value"}>Activities: {data.totalActivities}</h2>
                    <h2 className={"Info__data--value"}>Elevation Gain</h2>
                    <h2 className={"Info__data--number"}>{data.totalAltitude} m</h2>
                </div>                      
                <div className={"Info__container--data"}>  
                    <h2 className={"Info__data--title"}>Last Month</h2>
                    <h2 className={"Info__data--value"}>Activities:  {data.totalMonthActivities}</h2>
                    <h2 className={"Info__data--value"}>Elevation Gain</h2>
                    <h2 className={"Info__data--number"}>{data.totalMonthAltitude} m</h2>
                </div>            
            </div>
    </div>
}

export default ProfileInfoHeader