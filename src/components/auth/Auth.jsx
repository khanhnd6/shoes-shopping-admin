import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React, { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase/config';
import "./auth.scss"
import SignIn from './SignIn';
import SignUp from './SignUp';
import Reset from './Reset';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

// Responsive: Truyền cả 2 thằng là false để nó đều cùng ở bên trái dễ responsive
// - signIn: Truyền <SignIn signUp={false} /> là false để nó bay sang bên phải (để cùng bên phải với signUp tiện cho việc làm responsive)
// - signUp: Truyền <SignUp signUp={false} /> là false và đổi opacity-0 thành opacity-100 ở thằng cha để nó hiện

//setSignUp thành true để hiện ra sign up, thành false để hiện ra sign in
const Auth = () => {
  const [resetPassword, setResetPassword] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();


  return (
    <>
      <div className={`my-[35px] mx-auto bg-white shadow-shadowAuth relative overflow-hidden w-[768px] max-w-full min-h-[480px] ${signUp ? "right-panel-active" : ""}`} id="container">
        {
          resetPassword
            ? <Reset signUp={signUp} setResetPassword={setResetPassword} />
            : <SignIn signUp={signUp} setResetPassword={setResetPassword} />
        }
        <SignUp signUp={signUp} setSignUp={setSignUp} />
        {/* overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 translate-x-0 transition-transform ease-in-out duration-[0.6s] overlay-left">
              <h1 className="font-bold m-0 text-[25px]">Đăng nhập vào Shoes Plus</h1>
              <p className="text-[14px] font-[300] leading-5 tracking-[0.5px] mt-5 mb-[30px]">Đã có tài khoản? Vui lòng đăng nhập ở đây</p>
              <button
                onClick={() => setSignUp(false)}
                className="  border border-solid border-white bg-transparent text-white text-[13px] font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in duration-[80ms] active:scale-95 focus:outline-none"
                id="signIn"
              >
                Đăng nhập
              </button>
            </div>
            <div className="absolute flex items-center justify-center flex-col px-10 text-center top-0 h-full w-1/2 translate-x-0 transition-transform ease-in-out duration-[0.6s] overlay-right">
              <h1 className="font-bold m-0 text-[25px]">Shoes shopping administration</h1>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default memo(Auth);