import React, {useState} from 'react'
import PlaylistIcon from '../PlaylistIcon/PlaylistIcon';

export default function Home() {
  const [aboutMessage, setAboutMessage] = useState("asdl;fkldjjlk;afjkl;afjk;lafjk;lafjkl;fljk;sljk;flkj;fjkl;sskjl;;dfsk;lfkjs;dfksd;fk;sdfkas;dfksdf;kdf;kssd;kdkjdk;sfdk;asfdk;sfdk;;kfdkjdsdlfd;kkjds;fdkdkfdk;kdfs kjlkjlf;dkj;lafkjl;fajklfa;jkl;afjkl;fakjl;dfkj;las;ladfskjfdsetiuoweipropiueowpieowqipoerwdsklvcnlmvcxndlnkldsa")
  const [playlistsInfo, setPlaylistsInfo] = useState([{
    playlistName: "list 1",
    tracksCount : 1,
    playTime : '5:10',
    rating : 9.5}, {
    playlistName: "list 2",
    tracksCount : 2,
    playTime : '52:11',
    rating : 7.2}, {
      playlistName: "list 3",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }, {
      playlistName: "list 4",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }, {
      playlistName: "list 5",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }, {
      playlistName: "list 6",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }, {
      playlistName: "list 7",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }, {
      playlistName: "list 8",
      tracksCount : 4,
      playTime : '213:10',
      rating : 1.5
    }]);
  return (
  <>
  <p>{aboutMessage}</p>
  <div className="preview-public-playlists">
    {playlistsInfo.map((list) => (<PlaylistIcon key={list.playlistName} playlistName={list.playlistName} tracksCount={list.tracksCount} playTime={list.playTime} rating={list.rating}/>))}
  </div>
  </>);
}

