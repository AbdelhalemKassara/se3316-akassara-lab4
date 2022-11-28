import './LogIn.css';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { auth } from '../../config/firebase-config';

export default function LogIn() {

  const loginWithGoogle = () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((userCre) => {
      console.log(userCre);
    })
  }

  return (
    <div id="Authentication"> 
      <button id="loginGoogle" onClick={loginWithGoogle}>Login With Google</button>
      <p>or</p>
      <div className="AuthenticationInput">
        <div>
          <p>Email address</p>
          <input type="text" placeholder="email" id="loginEmail"/>
        </div>
        <div>
          <p>Password</p>
          <input type="password" placeholder="password" id="loginPassword"/>
        </div>
      </div>
      <p>Forgot Password</p>
      <button id="login">Login</button>
      <a href="/account/signup">Create Account</a>
    </div>);
}
