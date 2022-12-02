import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function TrackRow(props) {
  const [artist, setArtist] = useState('');
  const [duration, setDuration] = useState('');
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [album, setAlbum] = useState('');

  useEffect(() => {
    setArtist(props.artist);
    setDuration(props.duration);
    setTitle(props.title);
    setId(props.id);
    setAlbum(props.albumName);
  },[props])
  if(props.header) {
    return (<>
      <div className="table-lable"><p>Play</p></div>
      <div className="table-lable"><p>Title</p></div>
      <div className="table-lable"><p>Album</p></div>
      <div className="table-lable"><p>Artist</p></div>
      <div className="table-lable"><p>Duration</p></div>
      <div className="table-lable-ed"><p>Details</p></div>
      </>);
  } else {
    return (<>
      <div className="data-lable-st"><a href={"https://www.youtube.com/results?search_query=" + title + ' by ' + artist} target="_blank">youtube</a></div>
      <div className="data-lable"><p>{title}</p></div>
      <div className="data-lable"><p>{album}</p></div>
      <div className="data-lable"><p>{artist}</p></div>
      <div className="data-lable"><p>{duration}</p></div>
      <div className="data-lable"><Link to={"/track/" + id}>link</Link></div>
      </>);
  }

}
