import React, {useRef} from 'react'

export default function SignUp() {
  const email = useRef('');
  const username = useRef('');
  const password = useRef('');
  const confirmPassword = useRef('');

  async function createUser() {

    if(password.current.value == '') {alert("Password is blank"); return;}
    if(password.current.value != confirmPassword.current.value) {alert("passwords don't match"); return;}
    if(username.current.value == '') {alert("username is blank"); return;}
    if(email.current.value == '') {alert("Email is blank"); return;}

    //check if there is an existing user
    if(true) {
      //add user
      let result = await fetch('/api/account/createAccount', {
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

      if(result.ok) {
        result = await result.json();
        if(window.confirm('this will take you to verify your account.')) {
          window.location.href = result.verificationLink;
        }
      }
    }

    
  }

  return (
  <div id="Authentication"> 
        <button id="signUpWithGoogle">Continue With Google</button>
      <p>or</p>

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
