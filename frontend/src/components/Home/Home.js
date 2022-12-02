import React, {useEffect, useState} from 'react'
import PlaylistIcon from '../PlaylistIcon/PlaylistIcon';
import {fetchWrapper} from '../queryBackend';

export default function Home() {
  const [aboutMessage, setAboutMessage] = useState("placeholder");
  const [playlistsInfo, setPlaylistsInfo] = useState([]);

  useEffect(() => {
    async function fetchData() {
    let {body} = await fetchWrapper('/api/playlists');
    setPlaylistsInfo(body);
    
    let {body : about} = await fetchWrapper('/api/about');
    let message = await about;
    setAboutMessage(message.message);
  }
  fetchData();
  }, [])

  return (
  <>
  <p>{aboutMessage}</p>
  <div className="preview-public-playlists">
    {playlistsInfo.map((list) => (<PlaylistIcon key={list.playlistID} playlistName={list.name} tracksCount={list.numOfTracks} playTime={list.duration} rating={0} dateLastChanged={list.dateLastChanged} user={list.userName}/>))}
  </div>
  </>);
}

