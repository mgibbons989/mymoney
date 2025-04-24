import { useEffect, useState } from "react";
import { format, parse } from 'date-fns';


function UpcomingShifts() {

    const [shifts, setShifts] = useState([]);
    const [totalWages, setTotalWages] = useState(0);

    useEffect(() => {
        const getShifts = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:5000/getShifts", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const upcoming = data.filter(shift => new Date(shift.shift_date) >= new Date()).slice(0, 3);

            setShifts(upcoming);

            const total = upcoming.reduce((sum, shift) => sum + shift.total_earned, 0);
            setTotalWages(total.toFixed(2));
        };

        getShifts();

    }, []);
    return (
        <>
            <div className="upcoming">
                <h2>Upcoming Shifts</h2>
                <small>Future schedule and projected earnings</small>

                <div className="wages">
                    <div>Projected Earnings:</div>
                    <div className="sumwage">${totalWages}</div>
                </div>
                <div className="future-shifts">
                    <ul>
                        {shifts.length === 0 ? (
                            <li className="shift">No upcoming shifts</li>
                        ) :
                            (
                                shifts.map((shift, index) => (
                                    <li className="shift" key={index}>
                                        <div>{format(new Date(shift.shift_date), 'MMM dd, yyyy')}({shift.hours} hrs)</div>
                                        <div>${shift.total_earned}</div>
                                    </li>
                                ))
                            )}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default UpcomingShifts;