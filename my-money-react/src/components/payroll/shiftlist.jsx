


function ShiftList() {
    return (
        <>
            <span className="shift-header">Shifts</span>

            <div className="card">

                {/* <div className="shift-headers">
                    <span>DAY</span>
                    <span>HOURS</span>
                    <span>WAGES</span>
                </div> */}

                <ul className="shift-list">
                    {/* LOOP THROUGH SHIFTS HERE */}
                    <li className="shift">
                        <span>Monday, April 21 (9:00 - 5:00)</span>
                        <span> 8.0 hrs</span>
                        <span>$ 800</span>
                    </li>
                    <li>

                    </li>
                </ul>

                <div className="total-wages">
                    TOTAL WAGES:

                    <span className="total-amt"> $TOTAL</span>

                </div>
            </div>
        </>
    )
}

export default ShiftList;