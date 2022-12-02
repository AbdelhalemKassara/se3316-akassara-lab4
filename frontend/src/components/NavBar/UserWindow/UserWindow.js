import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './UserWindow.css';


export default function UserWindow(props) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const toggleState = () => {
    setDisplayMenu(!displayMenu);
  }

  useEffect(() => {
    if(!props.userName) {
      setDisplayMenu(false);
    }
  }, [props.userName]);

  if(props.userName) {//if user is logged in
    if(displayMenu) {
      return (<>
        <Link className="Nav-Bar-Item" id="User" onClick={toggleState}>{props.userName}</Link>
            <div id="user-window"> 
            <Link to='/loggedin/changepassword' onClick={toggleState}>Change Password</Link>
            <Link to='user/playlists' onClick={toggleState}>Playlists</Link>
            <Link onClick={() => {props.onLogout()}}>Log out</Link>
            </div>
          </>
        )
    } else {
      return (<Link className="Nav-Bar-Item" id="User" onClick={toggleState}>{props.userName}</Link>);
    }
  } else {
    return (<Link to='/account/login' className="Nav-Bar-Item" id="User">Log In</Link>);
  }
}