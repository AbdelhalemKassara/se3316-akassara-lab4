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
        <Link className={props.isAdmin ? 'Nav-Bar-Item admin' : 'Nav-Bar-Item'} id="User" onClick={toggleState}>{props.userName}</Link>
            <div id="user-window"> 
            <Link to='/loggedin/changepassword' onClick={toggleState}>Change Password</Link>
            {props.isAdmin ?(<>
                <Link to='/admin/view/users' onClick={toggleState}>View Users</Link>
                <Link to='/admin/view/reviews' onClick={toggleState}>View Reviews</Link>
                <Link to='/admin/edit/securityandprivacypolicy' onClick={toggleState}>Edit Security and Privacy Policy</Link>
                <Link to='/admin/edit/dmcapolicy' onClick={toggleState}>Edit DMCA Policy</Link>
                <Link to='/admin/edit/acceptableusepolicy' onClick={toggleState}>Edit Acceptable Use Policy</Link>
              </>)
              :
              <></>
            }
            <Link to='/loggedin/playlists' onClick={toggleState}>Playlists</Link>
            <Link onClick={() => {props.onLogout()}}>Log out</Link>
            </div>
          </>
        )
    } else {
      return (<Link className={props.isAdmin ? 'Nav-Bar-Item admin' : 'Nav-Bar-Item'} id="User" onClick={toggleState}>{props.userName}</Link>);
    }
  } else {
    return (<Link to='/account/login' className="Nav-Bar-Item" id="User">Log In</Link>);
  }
}