
function CurrentPayPeriod() {
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