import { joinPaths } from '@remix-run/router';
import React from 'react'
import { fetchWrapper } from '../../queryBackend'

export default function ViewReviewsRows({header, disabled, name, playlistID, rating, review, reviewID, userID, userName, onUpdateReviews}) {
  
  async function updateVisibility() {
    let {result, body} = await fetchWrapper('/api/account/loggedin/admin/review/setdisable', {
      method : 'PUT',
      headers : {
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify({
          reviewID : reviewID,
          disabled : Number(!disabled)
      })
    });

    if(result.ok) {
      alert("The visibility has been updated");
      onUpdateReviews();
    } else {
      alert(body && body.error ? body.error : "There was an issue with setting the visibility.");
    }
  }

  if(header) {
    return(<>
      <div className="table-lable"><p>Cur Visibility</p></div>
      <div className='table-lable'><p>User ID</p></div>
      <div className='table-lable'><p>User Name</p></div>
      <div className='table-lable'><p>Playlist ID</p></div>
      <div className='table-lable'><p>Playlist Name</p></div>
      <div className='table-lable'><p>Review ID</p></div>
      <div className='table-lable-ed'><p>Review</p></div>  
      <div className='table-lable'><p>Rating</p></div>
    </>)
  } else {
    return (<>
      <div className='data-lable-st'><button onClick={() => updateVisibility()}>{disabled == 1 ? 'disabled' : 'visible'}</button></div>
       <div className='data-lable'><p>{userID}</p></div>
       <div className='data-lable'><p>{userName}</p></div>
       <div className='data-lable'><p>{playlistID}</p></div>
       <div className='data-lable'><p>{name}</p></div>
       <div className='data-lable'><p>{reviewID}</p></div>
       <div className='data-lable'><p>{review}</p></div>
       <div className='data-lable'><p>{rating}</p></div>
  </>)
  }
}
