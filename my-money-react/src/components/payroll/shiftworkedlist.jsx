import { useState, useEffect } from "react";
import { format, parse } from "date-fns";

function ShiftWorkedList({ startDate, endDate }) {
    const url = 'https://mymoney-production-c8a6.up.railway.app'

    const [shiftWorkedList, setShiftWorkedList] = useState([]);
    const [totalWages, setTotalWages] = useState(0);

    useEffect(() => {
        if (!startDate || !endDate) {
            setShiftWorkedList([]);
            setTotalWages(0);
            return;
        }
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resShiftWorkedList = await fetch(`${url}/getPayrolls`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await resShiftWorkedList.json();

            const filteredShifts = data.filter(shift => {
                const shiftDate = new Date(shift.shift_date);
                shiftDate.setHours(0, 0, 0, 0);

                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);

                const end = new Date(endDate);
                end.setHours(0, 0, 0, 0)

                return shiftDate >= start && shiftDate <= end;
            });

            setShiftWorkedList(filteredShifts);

            console.log('data', data);
            console.log('shifts', filteredShifts);

            const total = filteredShifts.reduce((sum, shift) => sum + shift.total_earned, 0);
            setTotalWages(total.toFixed(2));
        };

        fetchData();
    }, [startDate, endDate]);

    return (
        <>
            <span className="shift-header">Shifts</span>

            <div className="card">
                <ul className="shift-list">
                    {(!startDate || !endDate) ? (
                        <li className="shift">Please select a pay period above.</li>
                    ) :
                        shiftWorkedList.length === 0 ? (
                            <li className="shift">No Shifts Available</li>
                        ) : (
                            shiftWorkedList.map(shift => {
                                const shiftDate = new Date(shift.shift_date + "Z");
                                const startDateTime = new Date(`${shift.shift_date.split('T')[0]}T${shift.start_time}:00Z`);
                                const endDateTime = new Date(`${shift.shift_date.split('T')[0]}T${shift.end_time}:00Z`);

                                return (
                                    <li key={shift.id} className="shift">
                                        <span>
                                            (<strong>{format(shiftDate, "MM/dd/yy")}</strong>){" "}
                                            {format(startDateTime, "h:mm a")} - {format(endDateTime, "h:mm a")}
                                        </span>
                                        <span>{shift.hours.toFixed(2)} hrs</span>
                                        <span>${shift.total_earned}</span>
                                    </li>
                                )
                            })
                        )}
                </ul>

                <div className="total-wages">
                    TOTAL WAGES:

                    <span className="total-amt"> ${totalWages}</span>

                </div>
            </div>
        </>
    );
}

export default ShiftWorkedList;
