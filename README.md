# FrontCamp_NodeJS

## Start Up

To start the project:

1. Open bash
2. run npm i
3. run npm start
3. run npm start
 
 The api should be available at localhost:4000
 All requests are written in file
 
## Basic Authentication

1. Send a request to `/api/register` with a body like `{ "username": "{{you-name}}", "password": "{{your-pass}}", "password2": "{{your-pass}}" }`
2. Start postman open **Authentication** tab and select **Basic Authentication**. Add username and password you used for registration.
3. Execute `POST /api/news` with news body. 
4. Execute `GET /api/news` to ensure news added.
5. Empty username and password and run post request. Ensure that **401 Unauthorised** is returned.

## Facebook Authentication

1. Provide `FB_APP_ID` and `FB_APP_SECRET` as environment variables.
2. Navigate to `http://localhost:4000/auth/facebook` in private window.
3. When redirected to FB login page provide the credentials.
4. As soon as you was redirected to a landing page open Developer Tools. 
5. To ensure that POST is working run code mentioned below in console:   
```javascript
  const data = { "name": "Rockenrolla", "genre": "action", "id": "tt0110352"}
  fetch("/api/news", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json'
      }
  }).then(console.log);
```
Ensure that **201 Created** status code is returned
