import { useEffect, useState } from "react";

function CurrentPayPeriod() {

    const [shifts, setShifts] = useState([]);
    const [totalWages, setTotalWages] = useState(0);

    useEffect(() => {
        const getShifts = async () => {
            const token = localStorage.getItem("access_token");
            const res = await fetch("http://localhost:5000/getPayrolls", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            const past = data.filter(shift => new Date(shift.date) < new Date())
                .sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);

            setShifts(past);

            const total = sliced.reduce((sum, shift) => sum + shift.total_earned, 0);
            setTotalWages(total.toFixed(2));
        };

        getShifts();

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
                                    <div>{shift.date} ({shift.hours} hrs)</div>
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