import AppError from '../AppError';

export const dataService = {
  getAuthenticationString,
  get,
  post,
  patch,
  _delete,
};

function getAuthenticationString() {
  return window.sessionStorage.getItem("authenticationToken");
}

async function get(url, headers) {
  let getHeaders = {
    'Content-Type': 'application/json',
    'authorization': `${window.sessionStorage.getItem("authenticationToken")}` 
  }; 
  
  const requestOptions = {
    method: 'GET',
    mode: 'cors',
    headers: getHeaders
  };

  return await call(url, requestOptions);
}

async function post(url, body, headers) {
  let postHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `${window.sessionStorage.getItem("authenticationToken")}` 
  };

  const requestOptions = {
    method: 'post',
    mode: 'cors',
    headers: postHeaders,
    body: JSON.stringify(body),
  }
  return await call(url, requestOptions);
}

async function patch(url, body, headers) {
  let patchHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `${window.sessionStorage.getItem("authenticationToken")}` 
  };

  const requestOptions = {
    method: 'PATCH',
    mode: 'cors',
    headers: patchHeaders,
   // credentials: 'include',
    body: JSON.stringify(body),
  };

  return await call(url, requestOptions);
}

async function _delete(url, headers) {
  let deleteHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'authorization': `${window.sessionStorage.getItem("authenticationToken")}` 
  };

  const requestOptions = {
    method: 'delete',
    mode: 'cors',
    headers: deleteHeaders,
    credentials: 'include',
  };

  return await call(url, requestOptions);
}
/* Not used now, maybe need it later
function serializePayload(payload, headers) {
  if (headers['Content-Type'] === 'application/json') {
    if (payload === undefined) payload = {};
    return JSON.stringify(payload);
  }
  return payload;
}
*/
async function call(url, requestOptions) {
  let response = null;
  let body = null;
  response = await fetch(url, requestOptions);
  body = await getBody(response);
  if (url.includes('/login')) {
    window.sessionStorage.setItem("authenticationToken", body);
  }
  return body;
}

async function getBody(response) {
  let responseBody = null;
  try {
    if (isJSON(response)) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
  } catch (err) {
    // check error-information here and rethrow it as app-error
    console.error(err);
    throw new AppError(response.status, responseBody || response.statusText);
  }

  if (response.ok === false) {
    throw new AppError(response.status, responseBody || response.statusText);
  }

  return responseBody;
}

function isJSON(response) {

  let contentTypeHeader =
    response.headers &&
    (response.headers['content-type'] || response.headers.get('content-type'));

  return (
    contentTypeHeader &&
    contentTypeHeader.toLowerCase().includes('application/json')
  );
}
