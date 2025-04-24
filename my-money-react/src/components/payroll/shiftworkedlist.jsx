import { useState, useEffect } from "react";


function ShiftWorkedList() {
    var start_date = "2025-01-01"; // change the value to come from our frontend form
    var end_date = "2025-04-30";   // change the value to come from our frontend form
    const [shiftWorkedList, setShiftWorkedList] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            if (start_date && end_date) {
                const resShiftWorkedList = await fetch("http://localhost:5000/getPayrolls?start=" + start_date + "&end=" + end_date, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                const resShiftWorkedList = await fetch("http://localhost:5000/getPayrolls", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setShiftWorkedList(await resShiftWorkedList.json());
        };

        fetchData();
    }, []);

    return (
        <>
            <span className="shift-header">Shifts</span>

            <div className="card">
                <ul className="shift-list">
                    {shiftWorkedList.length === 0 ? (
                        <li>No Payroll</li>
                    ) : (
                        shiftWorkedList.map(shift => (
                            <li key={shift.id} className="shift">
                                <span>[{shift.shift_date.slice(0,10)}] {shift.start_time} - {shift.end_time}</span>
                                <span>{shift.hours.toFixed(2)}</span>
                                <span>$ {shift.total_earned}</span>
                            </li>
                        ))
                    )}
                </ul>

                <div className="total-wages">
                    TOTAL WAGES:

                    <span className="total-amt"> $TOTAL</span>

                </div>
            </div>
        </>
    )
}

export default ShiftWorkedList;