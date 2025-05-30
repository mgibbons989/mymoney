import { useEffect, useState } from "react";
import { format, parse } from 'date-fns';


function CurrentPayPeriod() {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [shifts, setShifts] = useState([]);
    const [totalWages, setTotalWages] = useState(0);

    const getShifts = async () => {
        // console.log("getting shifts");

        const token = localStorage.getItem("access_token");
        const res = await fetch(`${url}/getPayrolls`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const today = new Date();

        const past = data.filter(shift => {
            const shiftDate = new Date(shift.shift_date);
            shiftDate.setHours(0, 0, 0, 0);
            return shiftDate <= today;
        }).sort((a, b) => new Date(b.shift_date) - new Date(a.shift_date))
            .slice(0, 3);

        console.log("Data received:", data);
        console.log("Past shifts:", past);
        setShifts(past);

        const total = past.reduce((sum, shift) => sum + shift.total_earned, 0);
        setTotalWages(total.toFixed(2));
    };

    useEffect(() => {
        getShifts();
        const interval = setInterval(getShifts, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div className="pay-sum">
                <h2>Pay Period Summary</h2>
                <small>Current time and shift status</small>

                <div className="wages">
                    <div>Total Wages:</div>
                    <div className="sumwage">${totalWages}</div>
                </div>

                <div className="shift-list">
                    <ul>
                        {shifts.length === 0 ? (
                            <li className="shift">No recent shifts</li>
                        ) : (
                            shifts.map((shift, index) => (
                                <li className="shift" key={index}>
                                    <div>{format(new Date(shift.shift_date), 'MMMM d, yyyy')} ({shift.hours} hrs)</div>
                                    <div>${shift.total_earned}</div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </>
    )
};


export default CurrentPayPeriod;