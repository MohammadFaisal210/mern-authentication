import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import axios from "axios"
import {showErrMsg,showSuccessMgs} from "../utils/notification/Notification"
function ActivationEmail(){
    const [err,setErr] = useState('')
    const [success,setSuccess] = useState('')
    const {activation_token} = useParams()
    useEffect(()=>{
        if(activation_token){
            const activationEmail = async()=>{
                try {
                    const res = await axios.post('/user/activation',{activation_token})
                    setSuccess(res.data.msg)
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg)
                }
            }
            activationEmail()
        }
    },[activation_token])
    return(
    <div className="active_page">
    {err && showErrMsg(err)}
    {success && showSuccessMgs(success)}
    </div>
    )
}

export default ActivationEmail