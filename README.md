
# Angular Authentication
This Angular 16 application provides a secure and user-friendly authentication system using access tokens and refresh tokens. It includes basic features like user registration, login, forgot password and reset password components.

This authentication, with short-lived access tokens and long-lived refresh tokens (stored in cookies), enhances security by limiting the exposure of the access tokens while providing a seamless user experience through automatic silent token renewal.


## Authentication Workflow

![image](https://is.docs.wso2.com/en/5.10.0/assets/img/using-wso2-identity-server/oauth-refresh-token-diagram.png)

This authentication involves two types of tokens:

- **Access Token**: A short-lived token that grants access to protected server resources and is included in HTTP headers for authentication.

- **Refresh Token**: A long-lived token, stored as an HTTP cookie, that allows obtaining a new access token when the current one expires, maintaining user sessions without re-login (silent refresh).


### Overview

1. **Login and Token Retrieval**: During login, the server provides both an access token (in the response body) and a refresh token (as an HTTP cookie). The access token is stored in session storage.

2. **HTTP interceptor**: The access token is attached to outgoing requests, ensuring proper authentication.

3. **Unauthorized Requests (401 Responses)**: When a protected API request returns a 401 unauthorized response, the interceptor will initiate the refresh token mechanism to obtain a new access token.

4. **Refresh Token**: A new request is sent to refresh the access token. If the refresh token is valid, the server responds with a new access token. Update session storage with the new token and retry the original request.


## Getting Started

1. Clone the repository 
```
git clone https://github.com/David-Corona/auth-angular16-front.git
```
2. Navigate to the project folder
```
cd auth-angular16-front
```
3. Install the dependencies
```
npm install
```
4. Configure your backend API and modify environment.ts to specify the API url:
```
export const environment = {
  apiURL: 'http://localhost:3000/api',
};

```
5. Start the development server
```
npm run start
```
6. Open your browser to access the application.
```
http://localhost:4200/
```


## Technologies
- Angular 16
- RxJS 7
- Angular CLI 16
- Bootstrap 5


## License
[MIT](https://choosealicense.com/licenses/mit/)
