import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const Register = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        nric: "",
        first_name: "",
        last_name: "",
        dob: "",
        address: "",
        gender: ""
    });

    const { username, password, nric, first_name, last_name, dob, address, gender } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                setAuth(true);
                toast.success("Registration successful");
            } else {
                setAuth(false);
                toast.error(data.message || "Registration failed");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow p-5 w-75" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" name="username" value={username} onChange={onChange} 
                            className="form-control form-control-lg" placeholder="Enter username" required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" name="password" value={password} onChange={onChange} 
                            className="form-control form-control-lg" placeholder="Enter password" required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">NRIC</label>
                        <input 
                            type="text" name="nric" value={nric} onChange={onChange} 
                            className="form-control form-control-lg" placeholder="Enter NRIC" required 
                        />
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">First Name</label>
                            <input 
                                type="text" name="first_name" value={first_name} onChange={onChange} 
                                className="form-control form-control-lg" placeholder="Enter first name" required 
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Last Name</label>
                            <input 
                                type="text" name="last_name" value={last_name} onChange={onChange} 
                                className="form-control form-control-lg" placeholder="Enter last name" required 
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input 
                            type="date" name="dob" value={dob} onChange={onChange} 
                            className="form-control form-control-lg" required 
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input 
                            type="text" name="address" value={address} onChange={onChange} 
                            className="form-control form-control-lg" placeholder="Enter address" required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Gender</label>
                        <select name="gender" value={gender} onChange={onChange} 
                            className="form-control form-control-lg" required>
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100 btn-lg">Register</button>
                </form>
                <p className="text-center mt-4">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

Register.propTypes = {
    setAuth: PropTypes.func.isRequired,
};

export default Register;
