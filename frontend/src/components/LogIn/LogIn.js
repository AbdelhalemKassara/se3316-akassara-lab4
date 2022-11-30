import './LogIn.css';
import { Link } from 'react-router-dom';

export default function LogIn() {

  return (
    <div id="Authentication"> 
      <button id="loginGoogle">Login With Google</button>
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
      <Link to="/account/signup">Create Account</Link>
    </div>);
}
