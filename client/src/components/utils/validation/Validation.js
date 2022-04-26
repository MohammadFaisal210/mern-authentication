export const isEmpty = value =>{
    if(!value) return true
    return false
}

export const isEmail = email=>{
    const re =/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/
    return re.test(email)
}

export const isLength = password =>{
    if(password.length <8) return true
    return false
}

export const isMatch =( password,cf_password)=>{
    if(password === cf_password) return true
    return false
}