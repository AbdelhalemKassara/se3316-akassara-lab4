import React, { useEffect, useState } from 'react'
import { fetchWrapper } from '../../queryBackend';

export default function UserRow(props) {

  async function updatePermission() { 
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/userpermission', {
      method : 'PUT',
      headers : {
        'Content-Type' : "application/json"
      },
      body : JSON.stringify({
        userID : props.id,
        admin : Number(!props.admin)
      })
    });

    if(result.ok) {
      alert("The users permissions has been updated.");
      props.onUpdateUsers();
    } else {
      alert(body && body.error ? body.error : "There was an issue when updating the users permission");
    }

  }
  async function updateAccountState() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/disabled', {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
        userID : props.id,
        disabled : Number(!props.disabled)
      })
    });

    if(result.ok) {
      alert("The user's account state has been modified.");
      props.onUpdateUsers();
    } else {
      alert(body && body.error ? body.error : "There was an issue when disabling the user.");
    }
  }
  if(props.isHeader) {
    return (<>
      <div className="table-lable"><p>Permission</p></div>
      <div className='table-lable'><p>Account State</p></div>
      <div className="table-lable"><p>Verified Email</p></div>
      <div className='table-lable-ed'><p>User Name</p></div>
      <div className='table-lable-ed'><p>Email</p></div>
    </>)
  } else {
    return (<>
      <div className='data-lable data-lable-st'><button onClick={() => updatePermission()}>{props.admin === 1? 'admin' : 'user'}</button></div>
      <div className='data-lable'><button onClick={() => updateAccountState()}>{props.disabled == 1? 'disabled' : 'enabled'}</button></div>
      <div className='data-lable'><p>{props.verifiedEmail == 1 ? 'yes' : 'no'}</p></div>
      <div className='data-lable'><p>{props.userName}</p></div>
      <div className='data-lable'>{props.email}</div>
    </>)
  }

}
