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

  //check if there is a body
  const contentType = result.headers.get("content-type");
  if(contentType && contentType.indexOf('application/json') !== -1) {

  }

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


async function fetchWrapper(path, init ={}) {
  let accessToken = localStorage.getItem('accessToken');

  if(accessToken && path.slice(0, 21) === '/api/account/loggedin') {//acessing something that needs jwt token
    init = {...init, headers : {...init.headers, 'authorization' : 'BEARER ' + accessToken}}
  }

  let result = await fetch(path, init);

  if(result.status === 403) {//forbidden
    let newAccessToken = await fetch('/api/account/accesstoken', {
      method : 'POST',
      headers : {
        'authorization' : 'Bearer ' + localStorage.getItem('refreshToken') 
      }
    });

    if(newAccessToken.ok) {
      newAccessToken = await newAccessToken.json();
      localStorage.setItem('accessToken', newAccessToken.accessToken);

      return fetchWrapper(path, init);//try again

    } else if(newAccessToken.status === 403) {
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('accessToken');

      window.location.reload();//refresh
      alert('You need to be logged in to do this query');
    } 
  }
  return {result : result, body : await getBody(result)};
}
async function getBody(result) {
  let contentType = result.headers.get("content-type");
  if(contentType && contentType.indexOf('application/json') !== -1) return await result.json();
  
  return undefined;
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
      return false;
    }
  } else {
    return true;
  }
}