import React, {useEffect, useState} from 'react'
import PlaylistIcon from '../PlaylistIcon/PlaylistIcon';
import queryBackend from '../queryBackend';

export default function Home() {
  const [aboutMessage, setAboutMessage] = useState("placeholder");
  const [playlistsInfo, setPlaylistsInfo] = useState([]);

    useEffect(() => {
      async function fetchData() {
      let {resultBody} = await queryBackend('/api/playlists');
      setPlaylistsInfo(resultBody);
      
      let {resultBody : resultBody1} = await queryBackend('/api/about');
      let message = await resultBody1;
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

