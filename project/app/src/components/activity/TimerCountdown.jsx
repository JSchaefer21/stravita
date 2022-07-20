import { useState, useEffect } from 'react'

function Timer({initialTime}) {

    const [ hours, setHours ] =  useState(initialTime.h)
    const [ minutes, setMinutes ] =  useState(initialTime.m)
    const [ seconds, setSeconds ] = useState(initialTime.s)


    useEffect(()=>{
        let myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1)
            }
            else {
                setSeconds(59)
                setMinutes(minutes - 1)
                if (minutes < 0) {
                    setMinutes(59)
                    setHours(hours - 1)
                }
            }
        }, 1000)
        return ()=>  {
            clearInterval(myInterval)}
    })

    return (
        <div className='Timer__container mw'>
            { (hours<0)? <h1 className='Timer__number-countdown'> 00:00:00 </h1>
            : <h1 className='Timer__number-countdown'> {hours<10 ? `0${hours}`: hours}:{minutes<10 ? `0${minutes}`: minutes}:{seconds<10 ? `0${seconds}`: seconds}</h1> }
        </div>
    )
}

export default Timer