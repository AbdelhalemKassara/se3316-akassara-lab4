import React from 'react'

export default function PlaylistReview(props) {
  return (<>
  <div className="data-lable-st"><p>{props.rating}</p></div>
  <div className="data-lable"><p>{props.review}</p></div>
  <div className="data-lable"><p>{props.userName}</p></div>
  </>);
}
