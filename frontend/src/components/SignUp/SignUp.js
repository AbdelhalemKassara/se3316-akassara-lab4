import React, { useRef } from 'react'

export default function SignUp() {
  return (
  <div id="Authentication"> 
        <button id="signUpWithGoogle">Continue With Google</button>
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
