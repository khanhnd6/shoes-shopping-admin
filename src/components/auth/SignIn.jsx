import React, { memo, useState } from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink, useNavigate } from 'react-router-dom';
import { Spinning } from '../../animation-loading';
import { auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { loginAction } from '../../services/auth';



const SignIn = ({ signUp,  setResetPassword }) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  })

  const handleInput = (e) => {
    console.log(e.target.value)
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    })
  }


  const handleSignIn = (e) => {
    e.preventDefault();
    setLoading(true)

    if (!loading) {
      
      loginAction(loginInfo)
        .then((res)=>{
          if(res.data.status == -1){
            toast.error('Đăng nhập thất bại', {
              autoClose: 1200,
            });
            return;
          }

          toast.success('Đăng nhập thành công', {
            autoClose: 1200,
          });

          console.log(res)
          const { id, username, password, token} = res.data.data
          localStorage.setItem("token", token)
          localStorage.setItem("id", id)
          localStorage.setItem("username", username)
          localStorage.setItem("password", password)
          localStorage.setItem("logined", "true")
          window.open("/admin/home")
          
        })
        .catch(err => {
          console.log(err)
        })
        .finally(()=>{
          setLoading(false)
        })

    }
  }

  return (
    <>
      <div className={`absolute top-0 transition-all duration-[0.6s] ease-in-out h-full left-0 w-1/2 z-[2] ${signUp ? "translate-x-[100%]" : ""}`}>
        <form onSubmit={handleSignIn} className='bg-white flex justify-center flex-col px-[50px] h-full'>
          <h1 className="font-bold m-0 text-[30px] text-center">Đăng nhập</h1>
          <input
            name="username"
            onChange={handleInput}
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-3 px-[15px] my-2 w-full' type="text" placeholder="Username" />
          <input
            name="password"
            onChange={handleInput}
            className='bg-[#f3f3f4] transition-all ease-linear duration-150 border border-[#fff] focus:bg-white outline-none focus:shadow-shadowPink focus:border focus:border-[#ea4c8966] py-3 px-[15px] my-2 w-full' type="password" placeholder="Password" />
          <NavLink
            onClick={() => setResetPassword(true)}
            className=' text-[#333] text-[14px] underline my-[15px]'>
            Quên mật khẩu?
          </NavLink>
          <button
            type='submit'
            className='bg-primary text-white text-[13px] leading-5 font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>
            {loading ? <Spinning /> : "Đăng nhập"}
          </button>
        </form>
      </div>
    </>
  );
};

export default memo(SignIn);