import React, { useEffect, useState } from 'react'
import PlaylistIcon from '../../PlaylistIcon/PlaylistIcon';
import {fetchWrapper} from '../../queryBackend';
import CreatePlaylist from './CreatePlaylistIcon';

export default function UserPlaylists(props) {
  useEffect(() => {
  }, [props.userPlaylists]);

  return (<>
  <div className="preview-user-playlists">
    {props.userPlaylists.map((list) => (<PlaylistIcon 
    key={list.playlistID} id={list.playlistID}
    playlistName={list.name} tracksCount={list.numOfTracks}
    playTime={list.duration} rating={list.averageRating}
    dateLastChanged={list.dateLastChanged} user={list.userName}
    url={'/loggedin/playlist/'}/>
    ))}
    <CreatePlaylist />
  </div>
    </>);
}
