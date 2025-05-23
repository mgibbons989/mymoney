import React, { useState, useEffect } from 'react';
import { format } from "date-fns"

function TimeClock() {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [currentTime, setCurrentTime] = useState(new Date())
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const [clockedIn, setClockedIn] = useState(null)

    useEffect(() => {
        const checkClockStatus = async () => {
            try {
                const token = localStorage.getItem('access_token');


                const res = await fetch(`${url}/clock-in-status`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                console.log("clockdata", data);

                if (data.clocked_in) {
                    setClockedIn(true);
                }
                else {
                    setClockedIn(false);
                }
            }
            catch (error) {
                console.error('Error checking clocked in status', error);
            }
        };

        checkClockStatus();
    }, [])



    const handleClockinOut = async () => {
        // if (clockedIn == null) {
        //     await checkClockStatus();
        // }

        if (clockedIn) {
            await fetch(`${url}/clockout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setClockedIn(false)
        }
        else {
            await fetch(`${url}/clockin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setClockedIn(true);
        }
        // if employee is already clocked in, set clock out time, set hoursworked(clock out - clock in)
        // save to database
        // set employee to clocked out

        // if employee is not clocked in, set clock in time, save to database
    }

    return (
        <>
            <div className='timeclock'>
                <h2>Time Clock</h2>
                <small>Current time and shift status</small>
                <div className='date'>{format(currentTime, "EEEE, MMMM d, yyyy")}</div>
                <div className='clock'>{format(currentTime, "h:mm:ss a")}</div>

                <div className='butn'>
                    <button onClick={handleClockinOut}>
                        {clockedIn === null ? 'Loading...' : clockedIn ? 'Clock Out' : 'Clock In'}
                    </button>
                </div>
            </div>
        </>
    )
}


export default TimeClock;