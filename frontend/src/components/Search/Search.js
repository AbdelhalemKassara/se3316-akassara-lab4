import React, {useEffect, useRef, useState} from 'react'
import './Search.css';

export default function Search() {
  const searchBar = useRef('');
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');
  const [genre, setGenre] = useState('');
  const [active, setActive] = useState('artist');

  useEffect(() => {

  }, [searchBar.current]);

  function toggleButton(str) {
    
    if(active === 'genre') {
      setGenre(searchBar.current.value);
    } else if(active === 'track') {
      setTrack(searchBar.current.value);
    } else if(active === 'artist') {
      setArtist(searchBar.current.value);
    } 

    setActive(str);
    if(str === 'genre') {
      searchBar.current.value = genre;
    } else if(str === 'track') {
      searchBar.current.value = track;
    } else if(str === 'artist') {
      searchBar.current.value = artist;
    } else {
      searchBar.current.value = "";
    }

    console.log(artist, ' ' , track, ' ', genre);
  }
  function clearAllVals() {
    setGenre('');
    setTrack('');
    setArtist('');
    searchBar.current.value = "";
  }
  async function search() {
    
  }
  return (<>
  <div className="search-bar"> 
    <button onClick={() => clearAllVals()}>Clear All Values</button>
    <input type="text" placeholder={active} ref={searchBar} disabled={active === 'all'}/>
    <button onClick={() => search()}>Search</button>
  </div>
  <div className="search-terms">
      <button onClick={() => toggleButton('all')}>All</button>
      <button onClick={() => toggleButton('artist')}>Artist</button>
      <button onClick={() => toggleButton('track')}>Track</button>
      <button onClick={() => toggleButton('genre')}>genre</button>
    </div>
  </>)
}
