import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { showErrMsg, showSuccessMgs } from "../utils/notification/Notification";
import {isEmpty, isEmail,isLength,isMatch} from "../utils/validation/Validation";

const intialState = {
    name: "",
    email: "",
    password: "",
    cf_password: "",
    err: "",
    success: "",
};
function Login() {
    const [user, setUser] = useState(intialState);

    const { name, email, password, cf_password, err, success } = user;

    const onChgangeInput = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value, err: "", success: "" });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEmpty(name) || isEmpty(email))
            return setUser({
                ...user,
                err: "Please fill in all fields.",
                success: "",
            });

        if (!isEmail(email))
            return setUser({ ...user, err: "Invalid Emails.", success: "" });

        if (isLength(password))
            return setUser({
                ...user,
                err: "Password must be at least 8 characters long.",
                success: "",
            });

        if (!isMatch(password, cf_password))
            return setUser({ ...user, err: "Password did not match!", success: "" });

        try {
            const res = await axios.post("/user/register", {
                name, email, password
            })
            setUser({ ...user, err: "", success: res.data.msg });
        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: "" });
        }
    };
    return (
        <>
            <div className="login_page">
                <h2>Register</h2>
                {err && showErrMsg(err)}
                {success && showSuccessMgs(success)}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="name"
                            placeholder="Enter your name address"
                            value={name}
                            onChange={onChgangeInput}
                            name="name"
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={onChgangeInput}
                            name="email"
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={onChgangeInput}
                            name="password"
                        />
                    </div>
                    <div>
                        <label htmlFor="cf_password">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Enter your confirm password"
                            value={cf_password}
                            onChange={onChgangeInput}
                            name="cf_password"
                        />
                    </div>
                    <div className="row">
                        <button type="submit">Register Now</button>
                    </div>
                </form>
                <p>
                    Already an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </>
    );
}

export default Login;
