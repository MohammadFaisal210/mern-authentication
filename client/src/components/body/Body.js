import React from "react"
import Login from "../auth/Login"
import Register from "../auth/Register"
import ActivationEmail from "../auth/ActivationEmail"
import {Switch,Route} from "react-router-dom"
import {useSelector} from "react-redux"
import Notfound from "../utils/notfound/Notfound"
import ForgotPassword from "../auth/ForgotPassword"
import ResetPassword from "../auth/ResetPassword"
import Profile from "../profile/Profile"
import EditUser from "../profile/EditUser"
import Home from "../home/Home"
export default function Body(){
    const auth = useSelector(state=>state.auth)
    const {isLogged,isAdmin} = auth
    return(
        <>
            <section>
                <Switch>
                <Route path="/" component={Home} exact/>
                <Route path="/login" component={ isLogged ? Notfound : Login} exact/>
                <Route path="/register" component={ isLogged ? Notfound : Register} exact/>

                <Route path="/forgot_password" component={isLogged ? Notfound : ForgotPassword} />
                <Route path="/user/reset/:token" component={isLogged ? Notfound : ResetPassword} />

                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />

                <Route path="/profile" component={isLogged ? Profile : Notfound} exact />
                <Route path="/edit_user/:id" component={isAdmin ? EditUser : Notfound} exact />
                </Switch>
            </section>    
        </>
    )
}