import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import axios from "axios"
import { showErrMsg, showSuccessMgs } from "../utils/notification/Notification"
import { dispatchLogin } from "../../redux/actions/authAction"
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { useDispatch } from "react-redux"
const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}
function Login() {
    const [user, setUser] = useState(initialState)
    const dispatch = useDispatch()
    const history = useHistory()

    const { email, password, err, success } = user

    const onChgangeInput = (e) => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post('/user/login', { email, password })
            setUser({ ...user, err: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push("/")
        } catch (err) {
            err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    const responseGoogle =async(response)=>{
        try {
            const res = await axios.post("/user/google_login",{tokenId:response.tokenId})

            setUser({...user,err:'',success:res.data.msg})
            localStorage.setItem("firstLogin",true)

            dispatch(dispatchLogin())
            history.push("/")
        } catch (err) {
            err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: '' }) 
        }
    }
    const responseFacebook = async(response)=>{
        // console.log(response)
        try {
            const {userID,accessToken} = response
            const res = await axios.post("/user/facebook_login",{accessToken,userID})

            setUser({...user,err:'',success:res.data.msg})
            localStorage.setItem("firstLogin",true)

            dispatch(dispatchLogin())
            history.push("/")
        } catch (err) {
            err.response.data.msg && setUser({ ...user, err: err.response.data.msg, success: '' }) 
        }
    }
    return (
        <>
            <div className="login_page">
                <h2>Login</h2>
                {err && showErrMsg(err)}
                {success && showSuccessMgs(success)}
                <form onSubmit={handleSubmit} >
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input type="email" placeholder="Enter your email address" value={email} onChange={onChgangeInput} name="email" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter your password" value={password} onChange={onChgangeInput} name="password" required />
                    </div>
                    <div className="row">
                        <button type="submit">Login</button>
                        <Link to="/forgot_password">Forgot your password</Link>
                    </div>
                </form>
                <div className="hr">
                    Or Login with
                </div>
                <div className="social">
                    <GoogleLogin
                        clientId="820095734499-sce3p9ucoojk5duefpv47e828rpl8t0h.apps.googleusercontent.com"
                        buttonText="Login with google"
                        onSuccess={responseGoogle}
                        // onFailure={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />


                    <FacebookLogin
                    appId="663411058093429"
                    autoLoad={false}
                    fields="name,email,picture"
                    // onClick={componentClicked}
                    callback={responseFacebook} 

                    />
                </div>
                <p>New user? <Link to="/register">Register<i className="arrow fa-solid fa-arrow-right"></i></Link></p>
            </div>
        </>
    )
}

export default Login