import './LogIn.css';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export default function LogIn(props) {
  const email = useRef('');
  const password = useRef('');

  return (
    <div id="Authentication"> 
      <div className="AuthenticationInput">
        <div>
          <p>Email address</p>
          <input type="text" placeholder="email" id="loginEmail" ref={email}/>
        </div>
        <div>
          <p>Password</p>
          <input type="password" placeholder="password" id="loginPassword" ref={password}/>
        </div>
      </div>
      <p>Forgot Password</p>
      <button id="login" onClick={() => props.onLogin(email.current.value, password.current.value)}>Login</button>
      <Link to="/account/signup">Create Account</Link>
    </div>);
}
