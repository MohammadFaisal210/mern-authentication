import axios from "axios"
import React, { useEffect, useState } from "react"
import {useSelector,useDispatch} from "react-redux"
import {showErrMsg,showSuccessMgs} from "../utils/notification/Notification"
import {isLength,isMatch} from "../utils/validation/Validation"
import {Link} from "react-router-dom"
import {fetchAllUsers,dispatchGetAllUsers} from "../../redux/actions/userAction"
const initialState = {
    name: '',
    password:'',
    cf_password:'',
    err:'',
    success:''
}
export default function Profile(){
    const [data,setData] = useState(initialState)
    const [avatar,setAvatar] = useState(false)
    const [loading,setLoading] = useState(false)
    const [callback,setCallback] = useState(false)

    const auth = useSelector(state=>state.auth)
    const token = useSelector(state=>state.token)
    const users = useSelector(state=>state.users)

    const {name,password,cf_password,err,success} = data

    const {user,isAdmin} = auth
    const dispatch = useDispatch()
    useEffect(()=>{
        if(isAdmin){
            return fetchAllUsers(token).then(res=>{
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token,isAdmin,dispatch,callback])

    const handleChange=(e)=>{
        const {name,value} = e.target;
        setData({...data,[name]:value,err:'',success:''})
    }

    const changeAvatar=async(e)=>{
        try {
            const file = e.target.files[0]

            if(!file) return setData({...data,err:"No files were upload.",success:''})

            if(file.size > 1024*1024*3)
                return setData({...data,err:'Size too large',success:''})

            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data,err:"File formate is incorrect.",success:''})
            let formData = new FormData()
            formData.append('file',file)

            setLoading(true)
            const res = await axios.post('/api/upload_avatar',formData,{
                headers:{'content-type':'multipart/form-data',Authorization:token}
            })

            setLoading(false)
            setAvatar(res.data.url)
        } catch (err) {
            setData({...data,err:err.response.data.msg,success:''})
        }
    }
    const updateInfor=async()=>{
        try {
            const res = await axios.patch("/user/update",{
                name:name ? name : user.name,
                avatar: avatar ? avatar : user.avatar
            },{
                headers:{Authorization:token}
            })
            setData({...data,err:'',success:res.data.msg})
        } catch (err) {
            err.response.data.msg && setData({...data,err:err.response.data.msg,success:''})
        }
    }


   const updaPassword=async()=>{
       if(isLength(password)){
           return setData({...data,err:"Password must be at least 8 characters long.",success:''})
       }
       if(!isMatch(password,cf_password)){
           return setData({...data,err:'Password did not match',success:''})
       }
       try {
            await axios.post("/user/reset",{password},{
               headers:{Authorization:token}
           })
           return setData({...data,err:'',success:"Password successfully changed!"})
       } catch (err) {
           err.response.data.msg && setData({...data,err:err.response.data.msg,success:''})
       }
   }

   const handleUpdate=()=>{
       if(name || avatar) updateInfor()
       if(password) updaPassword()
   }

   const handleDelete =async (id) =>{
    if(user._id !== id){
        if(window.confirm('Are you sure want to delete this account ? ')){
            setLoading(true)
            axios.delete(`/user/delete/${user._id}`,{
                headers : {Authorization : token}
            })
            setLoading(false)
            setCallback(!callback)
        }
    }
   }

    return(
        <>
        <div>
            {err && showErrMsg(err)}
            {success && showSuccessMgs(success)}
            {loading && <h3>Loading............</h3>}
        </div>
       <div className="profile_page">
           <div className="col-left">
               <h2>{isAdmin ? "Admin Profile" : "User Profile"}</h2>
               <div className="avatar">
                   <img src={avatar ? avatar : user.avatar} alt="" />
                   <span>
                   <i className="fa-solid fa-camera"></i>
                       <p>Change</p>
                       <input type="file" name="file" id="file_up" onChange={changeAvatar} />
                   </span>
               </div>

               <div className="form-group">
                   <label htmlFor="name">Your name</label>
                   <input type="text" name="name" id="name" placeholder="Your Name" defaultValue={user.name} onChange={handleChange} />
               </div>
               <div className="form-group">
                   <label htmlFor="email">Your email address</label>
                   <input type="email" name="email" id="email" placeholder="Your email" defaultValue={user.email} disabled />
               </div>
               <div className="form-group">
                   <label htmlFor="password">New password</label>
                   <input type="password" name="password" id="password" placeholder="Password"  value={password} onChange={handleChange} />
               </div>
               <div className="form-group">
                   <label htmlFor="cf_password">Confirm new password</label>
                   <input type="password" name="cf_password" id="cf_password" placeholder="Confirm password" value={cf_password} onChange={handleChange}/>
               </div>
               <div>
                   <em style={{color:"crimson"}}>
                       * If you update your password here, you will not be able to login quickly using google and facebook.
                   </em>
               </div>
               <button disabled={loading} onClick={handleUpdate}>Update</button>
           </div>
           <div className="col-right">
            <h2>{isAdmin ? "Users" : "My Orders"}</h2>

            <div style={{overflowX:"auto"}}>
                <table className="customers">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>name</th>
                            <th>email</th>
                            <th>admin</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        users.map(user => (
                            <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{
                                user.role === 1 
                                ? <i className="fa-solid fa-check" title="Admin"></i>
                                :<i className="fa-solid fa-xmark" title="User"></i>
                            }
                            </td>
                            <td>
                                <Link to={`/edit_user/${user._id}`}>
                                <i className="fa-solid fa-pen-to-square" title="Edit"></i>
                                </Link>
                                <i className="fa-solid fa-trash-can" onClick={()=>handleDelete(user._id)} title="Remove"></i>
                            </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
           </div>
       </div>
       </>
    )
}