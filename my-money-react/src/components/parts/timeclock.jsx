import React, { useState, useEffect } from 'react';
import { format } from "date-fns"
import {
    Clock, DollarSign, Calendar, Home, Users, Settings, HelpCircle, LogOut, Menu
} from "lucide-react"


function TimeClock() {

    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const handleCLockinOut = () => {
        // *************TO DO*******************
        // if employee is already clocked in, set clock out time, set hoursworked(clock out - clock in)
        // save to database
        // set employee to clocked out

        // if employee is not clocked in, set clock in time, save to database
    }

    return (
        <>
            <div className='card'>
                <h2>Time Clock</h2>
                <div>{format(currentTime, "EEEE, MMMM d, yyyy")}</div>
                <div>{format(currentTime, "h:mm a")}</div>
                {/* TO DOOOOOOOOOO if clocked in display clock in time */}

                <div><button>Clock in</button></div>
            </div>
        </>
    )
}


export default TimeClock;