function CurrentPayPeriod() {
    return (
        <>
            <div className="card">
                <h2>Current Pay Period</h2>
                <div className="wages">
                    <span>Total Wages:</span>
                    <span>$WAGES HERE FROM DATABASE</span>
                </div>
                <div className="shiftList">
                    DISPLAY SHIFT LIST HERE
                </div>
            </div>
        </>
    )
};


export default CurrentPayPeriod;