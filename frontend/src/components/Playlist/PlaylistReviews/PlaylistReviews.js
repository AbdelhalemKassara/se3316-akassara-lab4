import React, { useEffect, useState } from 'react'
import { fetchWrapper } from '../../queryBackend';
import PlaylistReview from './PlaylistReview';
import './PlaylistReviews.css';

export default function PlaylistReviews(props) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {

    async function fetchData() {
      let query = props.canEdit && props.loggedIn ? "/api/account/loggedin/playlist/reviews/" : "/api/playlist/reviews/";
      let {result, body} = await fetchWrapper(query + props.id);

      if(result.ok) {
        setReviews(body);
      } else {
        alert(body && body.error ? body.error : "There was an issue with getting the playlist's reviews.");
      }
    }
    if(!isNaN(props.id)) fetchData();
  }, [props.id])
  return (<>
  <div className="review-table">
    <div className='table-lable'><p>Rating</p></div>
    <div className='table-lable'><p>Review</p></div>
    <div className='table-lable-ed'><p>User</p></div>
    {reviews.map((review) => (<PlaylistReview key={review.reviewID}
    rating={review.rating} review={review.review} userName={review.userName}/>))}
  </div>
  </>)
}
//seems to have an issue with the map that is above