function UpcomingShifts() {

    return (
        <>
            <div className="upcoming">
                <h2>Upcoming Shifts</h2>
                <small>Future schedule and projected earnings</small>

                <div className="wages">
                    <div>Projected Earnings:</div>
                    <div className="sumwage">$ PROJECTEDWAGES</div>
                </div>
                <div className="future-shifts">
                    DISPLAY LIST OF FUTURE SHIFTS HERE
                </div>
            </div>
        </>
    );
}

export default UpcomingShifts;