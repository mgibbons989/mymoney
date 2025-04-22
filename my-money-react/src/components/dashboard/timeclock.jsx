import React, { useState, useEffect } from 'react';
import { format } from "date-fns"
import "./dash.css"

function TimeClock() {

    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleClockinOut = () => {
        // *************TO DO*******************
        // if employee is already clocked in, set clock out time, set hoursworked(clock out - clock in)
        // save to database
        // set employee to clocked out

        // if employee is not clocked in, set clock in time, save to database
    }

    return (
        <>
            <div className='timeclock'>
                <h2>Time Clock</h2>
                <div className='date'>{format(currentTime, "EEEE, MMMM d, yyyy")}</div>
                <div className='clock'>{format(currentTime, "h:mm:ss a")}</div>
                {/* TO DOOOOOOOOOO if clocked in display clock in time */}

                <div className='butn'>
                    <button onClick={handleClockinOut}>{ }Clock In</button>
                </div>
            </div>
        </>
    )
}


export default TimeClock;