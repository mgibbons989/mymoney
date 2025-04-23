import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
                const res = await fetch("http://localhost:5000/api/employee", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Unauthorized");
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("Error fetching user", err);
                setUser(null); // fallback
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
