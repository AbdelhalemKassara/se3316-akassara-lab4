import React, {useEffect, useState} from 'react'
import PlaylistIcon from '../PlaylistIcon/PlaylistIcon';
import {fetchWrapper} from '../queryBackend';

export default function Home(props) {
  const [aboutMessage, setAboutMessage] = useState("");
  
  useEffect(() => {
    async function fetchAboutMessage() {
      let {body : about} = await fetchWrapper('/api/about');
      let message = await about;

      setAboutMessage(message.message);
    }
    fetchAboutMessage();
    }, []);

  return (
  <>
  <p>{aboutMessage}</p>
  <div className="preview-public-playlists">
    {props.publicPlaylists.map((list) => (<PlaylistIcon 
    key={list.playlistID} id={list.playlistID} 
    playlistName={list.name} tracksCount={list.numOfTracks} 
    playTime={list.duration} rating={list.averageRating} 
    dateLastChanged={list.dateLastChanged} user={list.userName}
    url={'/playlist/'}/>))}
  </div>
  </>);
}

