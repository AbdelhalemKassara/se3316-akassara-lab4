import React, {useEffect, useState} from 'react'
import PlaylistIcon from '../PlaylistIcon/PlaylistIcon';
import queryBackend from '../queryBackend';

export default function Home() {
  const [aboutMessage, setAboutMessage] = useState("placeholder");
  const [playlistsInfo, setPlaylistsInfo] = useState([]);

    useEffect(() => {
      async function fetchData() {
      let result = await queryBackend('/api/playlists');
      setPlaylistsInfo(await result.json());
      
      let aboutMessage = await queryBackend('/api/about');
      aboutMessage = await aboutMessage.json();
      setAboutMessage(aboutMessage.message);
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

