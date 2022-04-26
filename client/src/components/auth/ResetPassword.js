import axios from "axios"
import React, { useState } from "react"
import {useParams} from "react-router-dom"
import {showErrMsg,showSuccessMgs} from "../utils/notification/Notification"
import {isLength,isMatch} from "../utils/validation/Validation"

const initialState = {
    password:'',
    cf_password:'',
    err:'',
    success:''
}
export default function ResetPassword(){
    const [data,setData] = useState(initialState)
    const {token} = useParams()
    const {password,cf_password,err,success} = data

    const handleChangepassword = (e) =>{
        const {name,value} = e.target;
        setData({...data,[name]:value,err:'',success:''})
    }
    const resetPassword=async()=>{
        if(isLength(password)){
           return setData({
                ...data,
                err:"Password must be at least 8 characters long.",
                success:''
            })
        }
        if(!isMatch(password,cf_password)){
           return setData({
                ...data,
                err:"Password did not match.",
                success:''
            })
        }
        try {
            const res = await axios.post("/user/reset",{password},{
                headers:{Authorization:token}
            })
           return setData({...data,err:'',success:res.data.msg})
        } catch (err) {
            err.response.data.msg && setData(err.response.data.msg)
        }
    }
    return (
        <>
        <div className="fg_pass">
            <h2>Reset Your Password</h2>
            <div className="row">
                {err && showErrMsg(err)}
                {success && showSuccessMgs(success)}

                <label htmlFor="password">Enter your password</label>
                <input type="password" name="password" id="password" value={password} onChange={handleChangepassword} />

                <label htmlFor="password">Enter your Confirm password</label>
                <input type="password" name="cf_password" id="cf_password" value={cf_password} onChange={handleChangepassword} />

                <button onClick={resetPassword}>Verify your password</button>
            </div>
        </div>
        </>
    )
}