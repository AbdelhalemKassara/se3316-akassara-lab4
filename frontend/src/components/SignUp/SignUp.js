import React, {useRef} from 'react'
import queryBackend from '../queryBackend';

export default function SignUp() {
  const email = useRef('');
  const username = useRef('');
  const password = useRef('');
  const confirmPassword = useRef('');

  async function createUser() {

    if(password.current.value === '') {alert("Password is blank"); return;}
    if(password.current.value !== confirmPassword.current.value) {alert("passwords don't match"); return;}
    if(username.current.value === '') {alert("username is blank"); return;}
    if(email.current.value === '') {alert("Email is blank"); return;}

    //check if there is an existing user
    if(true) {
      //add user
      let {resultHTTP, resultBody} = await queryBackend('/api/account/createAccount', {
        method : 'POST',
        headers : {
          'Content-Type': 'application/json'
        },
        body : JSON.stringify({
          email : email.current.value,
          userName : username.current.value,
          password : password.current.value
        })
      })

      if(resultHTTP.ok) {
        if(window.confirm('this will take you to verify your account.')) {
          window.location.href = resultBody.verificationLink;
        }
      }
    }

    
  }

  return (
  <div id="Authentication"> 
    <div className="AuthenticationInput">
      <div>
        <p>Email address</p>
        <input type="text" placeholder="email" id="signUpEmail" ref={email}/>
      </div>
      <div>
        <p>User Name</p>
        <input type="text" placeholder="username " id="signUpUserName" ref={username}/>
      </div>
      <div>
        <p>Password</p>
        <input type="password" placeholder="password" id="signUpPassword" ref={password}/>
      </div>
      <div>
        <p>Password Confirmation</p>
        <input type="password" placeholder="confirm password" id="signUpPasswordConfirmation" ref={confirmPassword}/>
      </div>
    </div>
    
    <button id="login" onClick={createUser}>Sign Up</button>
  </div>);
}
