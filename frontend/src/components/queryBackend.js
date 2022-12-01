//////////////////////////////////////////////test this pile of crap
export default async function queryBackend(path, init = {}, admin = false) {
  
  //adds the access token to the query
  let accessToken = localStorage.getItem('accessToken');
  //if the user is trying to query data for users logged in and has an access token add the access token
  if(accessToken && path.slice(0, 21) === '/api/account/loggedin') {
    init = {...init, headers : {...init.headers, 'authorization' : 'BEARER ' + accessToken}}
  }

  //executes the query
  let result = await fetch(path, init);
  let tempFix = await result.json();
  //if it is 'forbidden' and only for users then get a new token otherwise return the value
  if(result.status === 403 && (tempFix.accessLevel === 'logged in user' || admin)) {
    let token = await fetch('/api/account/accesstoken', {
      method : 'POST',
      headers : {
        'authorization' : 'Bearer ' + localStorage.getItem('refreshToken') 
      }
    });
    
    if(token.ok) {
      token = await token.json();
      localStorage.setItem('accessToken', token.accessToken);
      return await fetch(path, init);
    } else {
      alert('You need to be logged in to do this query');
      //reset the ui so shows as the user logged out
    }
  } else {
    return {resultHTTP : result, resultBody : tempFix};
  }
}

export async function logOut() {
  let refreshToken = localStorage.getItem('refreshToken');
  let result;

  if(refreshToken) {
     result = await fetch('/api/account/logout', {
      method : 'DELETE',
      headers : {
        'authorization' : 'Bearer ' + refreshToken
      }
    });
    if(result.ok) {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');
      return true;
    } else {
      alert("There was an issue trying to log you out");
      return false;
    }
  } else {
    alert("You have already been logged out");
    return true;
  }
}