import React, { useEffect, useState } from 'react'
import { fetchWrapper } from '../../queryBackend';
import UserRow from './UserRow';
import './ViewUsers.css';

export default function ViewUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();

  },[]);
  const getUsers = async () => {
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/users');

    if(result.ok) {
      setUsers(() => body);

    } else {
      alert(body && body.error ? body.error : "There was an issue when getting the users.");
    }
  }

  return (<>
    <div className='tracks users-grid'>
      <UserRow isHeader={true}/>
      {users.map((user) => {if(user.userName !== 'administrator') {
        return <UserRow key={user.id} isHeader={false} onUpdateUsers={getUsers} {...user}/>
      }})}
    </div>
  
  </>)
}
