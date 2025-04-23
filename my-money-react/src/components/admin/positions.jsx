import { useState, useEffect } from "react";
import AddPosition from "./addPosModal";


function Positions() {
    const [modalOpen, setModalOpen] = useState(false);
    const [positions, setPositions] = useState([]);
    // const [user, setUser] = useState({privs:false})

    // useEffect(() => {
    //     const token = localStorage.getItem("access_token");

    //     const fetchData = async () => {
    //         // const resUser = await fetch("http://localhost:5000/currentUser", {
    //         //     headers: { Authorization: `Bearer ${token}` },
    //         // });
    //         // const userData = await resUser.json();
    //         // setUser(userData);

    //         const resPositions = await fetch("http://localhost:5000/positions");
    //         setPositions(await resPositions.json());
    //     };

    //     fetchData();
    // }, []);

    useEffect(() => {
        const token = localStorage.getItem("access_token");

        const fetchData = async () => {
            const resPositions = await fetch("http://localhost:5000/positions", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setPositions(await resPositions.json());
        };

        fetchData()
    }, []);

    const handleAddPosition = async (formData) => {
        const token = localStorage.getItem("access_token");
        const res = await fetch("http://localhost:5000/addPosition", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const newPos = await res.json();
            setPositions((prev) => [...prev, newPos]);
        }
    };

    return (
        <>
            <div className="pos-list">
                <h3>Positions</h3>

                <div >
                    <ul className="positionlist">
                        {positions.length === 0 ? (
                            <li>No posiitions</li>
                        ) :
                            (
                                positions.map(pos => (
                                    <li key={pos.id} className="posNames">
                                        <div className="pos-det">
                                            <span className="posName">{pos.positionName}</span>
                                            <span>Wage: ${pos.hourly_wage}/hr</span>
                                            <span>Granted Privileges? {pos.privs ? "Yes" : "No"}</span>
                                        </div>

                                        <div className="posChange">
                                            <button className="edit">Edit</button>
                                            <button className="delete">Delete</button>
                                        </div>

                                    </li>
                                ))
                            )}
                    </ul>
                </div>

                <button onClick={() => setModalOpen(true)} className="posAdd">Add Position</button>

                <AddPosition
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onAdd={handleAddPosition}
                />

            </div>
        </>
    )
}

export default Positions;