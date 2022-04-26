import React, { useEffect, useState } from "react"
import {useHistory,useParams} from "react-router-dom"
import {showErrMsg,showSuccessMgs} from "../utils/notification/Notification"
import {useSelector} from "react-redux"
import axios from "axios"
function EditUser(){
    const {id} = useParams()
    const history = useHistory()

    const [editUser,setEditUser] = useState([])

    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)

    console.log(id);
    const [checkAdmin,setCheckAdmin] = useState(false)
    const [err,setErr] = useState(false)
    const [success,setSuccess] = useState(false)
    const [num,setNum] = useState(0)

    const handleChange=(e)=>{
        const {name,value} = e.target;
        setEditUser({...editUser,[name]:value,err:'',success:''})
    }
    useEffect(()=>{
        if(users.length !== 0){
            users.forEach(user => {
                if(user._id === id){
                    setEditUser(user)
                    setCheckAdmin(user.role === 1 ? true : false)
                }
            })
        }else{
            history.push("/profile")
        }
    },[users,id,history,setEditUser])

    const handleUpdate =async()=>{
        try {
            if(num % 2 !== 0 ){
                const res = await axios.patch(`/user/update_role/${editUser._id}`,{
                    role:checkAdmin ? 1 : 0
                },{
                    headers : {Authorization: token}
                })
                setSuccess(res.data.msg)
                setNum(0)
            }
        } catch (err) {
            err.response.data.msg && setErr(err.response.data.msg)
        }
    }
    const handleCheck=()=>{
        setSuccess('')
        setErr('')
        setCheckAdmin(!checkAdmin)
        setNum(num+1)
    }
    return (
        <>              
               <div className="profile_page edit_user">
               <div className="row">
                   <button className="go_back" onClick={()=>history.goBack()}>
                   <i className="fa-solid fa-left-long"></i> Go Back
                   </button>
               </div>
               <div className="col-left">
               <h2>Edit User {editUser.name}</h2>
               <div className="form-group">
                   <label htmlFor="name">Your name</label>
                   <p>{editUser.name}</p>
                   <input type="text" name="name" placeholder="Your Name" defaultValue={editUser.name} onChange={handleChange} disabled />
               </div>
               <div className="form-group">
                   <label htmlFor="email">Your email address</label>
                   <input type="email" name="email" placeholder="Your email" defaultValue={editUser.email} disabled />
               </div>
               <div className="form-group">
                   <input type="checkbox" name="" id="isAdmin" onChange={handleCheck} />
                   <label htmlFor="isAdmin">isAdmin</label>
               </div>
            
               <button  onClick={handleUpdate}>Update</button>
               {err && showErrMsg(err)}
               {success && showSuccessMgs(success)}
           </div>
               </div>   
        </>
    )
}

export default EditUser;

