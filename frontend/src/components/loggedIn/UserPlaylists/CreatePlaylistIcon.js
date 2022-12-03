import React, { useRef } from 'react'
import './CreatePlaylistIcon.css';
import { fetchWrapper } from '../../queryBackend';

export default function CreatePlaylist() {
  const listName = useRef();

  async function createlist() {
    let {result, body} = await fetchWrapper("/api/account/loggedin/createPlaylist", {
      method : "POST",
      headers : { "Content-Type" : "application/json"},
      body : JSON.stringify({name : listName.current.value})
    });
    if(result.ok) {
      alert("Your playlist has been created");
      window.location.reload();
    } else {
      alert(body && body.error ? body.error : "There was an issue when creating your playlist.");
    }
  }

  return (
    <div className="playlist-icon-create">
      <input type="text" ref={listName}/>
      <br/>
      <button onClick={() => createlist()}>Create Playlist</button>
    </div>
    )
}
