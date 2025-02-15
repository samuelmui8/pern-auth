import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const Dashboard = ({ setAuth }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:3000/dashboard", {
                    method: "GET",
                    headers: { "token": `${localStorage.getItem("token")}` },
                });
                
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                } else {
                    alert("Failed to fetch user data");
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
            }
        };
        
        fetchUserData();
    }, []);

    const logout = () => {
        localStorage.removeItem("token");
        setAuth(false);
        toast.success("Logout successful");
    };

    return (
        <div className="container mt-5">
            <div className="card mx-auto p-4 shadow" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">Dashboard</h2>
                {user ? (
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>NRIC:</strong> {user.nric}</li>
                        <li className="list-group-item"><strong>Name:</strong> {user.first_name} {user.last_name}</li>
                        <li className="list-group-item"><strong>Date of Birth:</strong> {formatDate(user.dob)}</li>
                        <li className="list-group-item"><strong>Address:</strong> {user.address}</li>
                        <li className="list-group-item"><strong>Gender:</strong> {user.gender === 'M' ? 'Male' : 'Female'}</li>
                    </ul>
                ) : (
                    <p className="text-center">Loading user data...</p>
                )}
                <button className="btn btn-danger mt-4" onClick={logout}>Logout</button>
            </div>
        </div>
    );
};

const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0]; // Outputs YYYY-MM-DD
};

Dashboard.propTypes = {
    setAuth: PropTypes.func.isRequired,
};

export default Dashboard;