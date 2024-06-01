import axios from 'axios'
import qs from "qs"


const loginAction = async (info) => {
    // console.log(process.env.REACT_APP_API_ENDPOINT)
    console.log(info)

    if(!info || !info.username || !info.password){
        return null;
    }

    let data = qs.stringify({
      'username': info.username,
      'password': info.password
    });

    console.log("xx")
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${process.env.REACT_APP_API_ENDPOINT}/admin-login`,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    
    return new Promise((resolve, reject)=>{
      axios.request(config)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        });  
    })  
    
}

export {
  loginAction
}