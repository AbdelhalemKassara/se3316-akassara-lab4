export async function fetchWrapper(path, init ={}) {
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