import React, { useRef } from 'react'
import { useAuth } from '../AuthContext';

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();

  const signUpWithGoogle = () => {

  };

  function handleSubmit(e) {
    e.preventDefault();

    if(passwordRef)
    signup(emailRef.current.value, passwordRef.current.value);
  }
  return (
  <div id="Authentication"> 
        <button id="signUpWithGoogle" onClick={signUpWithGoogle}>Continue With Google</button>
      <p>or</p>

    <div className="AuthenticationInput">
      <div>
        <p>Email address</p>
        <input type="text" placeholder="email" id="signUpEmail"/>
      </div>
      <div>
        <p>User Name</p>
        <input type="text" placeholder="username " id="signUpUserName"/>
      </div>
      <div>
        <p>Password</p>
        <input type="password" placeholder="password" id="signUpPassword"/>
      </div>
      <div>
        <p>Password Confirmation</p>
        <input type="password" placeholder="confirm password" id="signUpPasswordConfirmation"/>
      </div>
    </div>
    
    <button id="login">Sign Up</button>
  </div>);
}
