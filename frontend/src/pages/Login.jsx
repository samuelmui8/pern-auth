import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

const Login = ({ setAuth }) => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const { username, password } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                setAuth(true);
                toast.success("Login successful");
            } else {
                setAuth(false);
                toast.error(data.message || "Login failed");
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card shadow-lg p-5 w-100" style={{ maxWidth: "600px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="form-label">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control form-control-lg" 
                            placeholder="Enter username" 
                            value={username} 
                            onChange={onChange} 
                            required 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control form-control-lg" 
                            placeholder="Enter password" 
                            value={password} 
                            onChange={onChange} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 btn-lg">Login</button>
                </form>
                <p className="text-center mt-4">
                    Don&apos;t have an account? <a href="/register">Register here</a>
                </p>
            </div>
        </div>
    );
};

Login.propTypes = {
    setAuth: PropTypes.func.isRequired,
};

export default Login;
