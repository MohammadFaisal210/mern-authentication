import React, { useEffect } from "react"
import {BrowserRouter as Router} from "react-router-dom"
import {useDispatch,useSelector} from "react-redux"
import Body from "./components/body/Body";
import Header from "./components/header/Header";
import {dispatchLogin,dispatchGetUser,fetchUser} from "./redux/actions/authAction"
import axios from "axios";
function App() {
  const dispatch = useDispatch()
  const token = useSelector(state=>state.token)
  const auth = useSelector(state=>state.auth)

  useEffect(()=>{
    const firstLogin = localStorage.getItem('firstLogin')
    if(firstLogin){
      const getToken = async()=>{
        const res = await axios.post("/user/refresh_token")
        dispatch({type:'GET_TOKEN',payload:res.data.access_token})
      }
      getToken()
    }
  },[auth.isLogged,dispatch])

  useEffect(()=>{
    if(token){
      const getUser =()=>{
        dispatch(dispatchLogin())

        return fetchUser(token).then(res => {
          dispatch(dispatchGetUser(res))
        })
      }
      getUser()
    }
  },[token,dispatch])
  return (
    <Router>
    <div className="App">
    <Header/>
    <Body/>
    </div>
    </Router>
  );
}

export default App;
