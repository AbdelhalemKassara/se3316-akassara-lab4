import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom'
import './UserWindow.css';


export default function UserWindow(props) {
  const [displayMenu, setDisplayMenu] = useState(false);
  const toggleState = () => {
    setDisplayMenu(!displayMenu);
  }

  if(props.user) {//if user is logged in
    if(displayMenu) {
      return (<>
        <Link className="Nav-Bar-Item" id="User" onClick={toggleState}>{props.user}</Link>
            <div id="user-window"> 
            <Link>link 1</Link>
            <Link to='user/playlists'>Playlists</Link>
            <Link onClick={() => props.onLogout()}>Log out</Link>
            </div>
          </>
        )
    } else {
      return (<Link className="Nav-Bar-Item" id="User" onClick={toggleState}>{props.user}</Link>);
    }
  } else {
    return (<Link to='/account/login' className="Nav-Bar-Item" id="User">Log In</Link>);
  }
}