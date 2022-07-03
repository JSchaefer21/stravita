import { useState, useEffect } from 'react'

function Timer({initialTime}) {

    const [ hours, setHours ] =  useState(initialTime.h)
    const [ minutes, setMinutes ] =  useState(initialTime.m)
    const [ seconds, setSeconds ] = useState(initialTime.s)


    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds < 60) {
                setSeconds(seconds + 1)
            }
            else {
                setSeconds(0)
                setMinutes(minutes + 1)
                if (minutes > 60) {
                    setMinutes(0)
                    setHours(hours + 1)
                }
            }
        }, 1000)
        return ()=>  {
            clearInterval(myInterval)}
    })


    return (
        <div className='Timer__container mw'>
            <h1 className='Timer__number'> {hours<10 ? `0${hours}`: hours}:{minutes<10 ? `0${minutes}`: minutes}:{seconds<10 ? `0${seconds}`: seconds}</h1> 
        </div>
    )
}

export default Timer