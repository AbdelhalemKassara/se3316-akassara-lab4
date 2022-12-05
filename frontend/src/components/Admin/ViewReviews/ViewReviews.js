import React, { useEffect, useState } from 'react'
import { fetchWrapper } from '../../queryBackend';
import TrackRow from '../../TrackRow/TrackRow';
import './ViewReviews.css';
import ViewReviewsRows from './ViewReviewsRows';

export default function ViewReviews() {
  const [query, setQuery] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    queryReviews();
  }, []);

  const queryReviews = async () => {
    let val = '/api/account/loggedin/admin/reviews?userName' + (query !== "" ? "="+ query : "");
    let {result, body} = await fetchWrapper(val);

    if(result.ok) {
      setReviews(body);
    } else {
      alert(body && body.error ? body.error : "There was an issue with geting the reviews.");
    }
  }

  console.log(reviews);
  return (<>
    <div className="search-reviews-bar">
      <input type="text" placeholder='please enter a username here' value={query} onChange={(e) => setQuery(e.target.value)}/>
      <button onClick={() => queryReviews()}>Search</button>
    </div>
    <br/><br/>
    <div className="view-reviews-table">
      <ViewReviewsRows header={true}/>
      {reviews.map((review) => (<ViewReviewsRows key={review.reviewID} header={false} onUpdateReviews={queryReviews} {...review}/>))}
    </div>
  </>)
}
