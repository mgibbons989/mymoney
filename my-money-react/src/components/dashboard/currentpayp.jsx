import { useEffect, useState } from "react";

function CurrentPayPeriod() {

    const [shifts, setShifts] = useState([]);

    useEffect(() => {
        const getShifts = async () => {
            const token = localStorage.getItem("acess_token");
            const res = await fetch("http://localhost:5000/getShifts", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setShifts(data.slice(0,3));
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
                    <div className="sumwage">$55</div>
                </div>
                <div className="shift-list">
                    DISPLAY SHIFT LIST HERE
                </div>
            </div>
        </>
    )
};


export default CurrentPayPeriod;