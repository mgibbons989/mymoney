


function ShiftList() {
    return (
        <>
            <span className="shift-header">Shifts</span>

            <div className="card">

                <ul className="shift-list">
                    <li className="shift-item">DISPLAY SHIFTS HERE
                        <span>DAY</span>
                        <span>HOURS</span>
                        <span>WAGES</span>
                    </li>
                </ul>

                <div className="total-wages">
                    TOTAL WAGES:

                    <span className="total-amt">$TOTAL</span>

                </div>
            </div>
        </>
    )
}

export default ShiftList;