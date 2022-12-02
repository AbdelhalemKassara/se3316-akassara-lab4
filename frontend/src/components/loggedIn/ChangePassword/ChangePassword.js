import React, {useRef} from 'react'

export default function ChangePassword(props) {
  let password = useRef('');
  return (<>
      <div className="AuthenticationInput">
        <div>
          <p>Password</p>
          <input type="password" placeholder="password" id="loginPassword" ref={password}/>
        </div>
      </div>
      <button id="login" onClick={() => props.onChangePassword(password.current.value)}>Change Password</button>
  </>)
}
