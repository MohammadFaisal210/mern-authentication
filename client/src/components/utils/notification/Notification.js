import React from "react"
import "./notification.css"


export const showErrMsg=(msg)=>{
    return <div className="errMsg">{msg}</div>
}

export const showSuccessMgs=(msg)=>{
    return <div className="successMsg">{msg}</div>
}