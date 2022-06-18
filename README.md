# Auth Service

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A user authentication and authorization service.

## Getting Started

To get you a copy of the production version of the project up and running on your local machine run:

```shell script
docker-compose up -d --force-recreate
```

## Database Design

![Auth service database scheme](./screenshoots/dbSchema.png "Auth service database scheme")

## System workflow

Authentication workflow:

user [post /users/login] --> Api gateway --> Auth service [response] --> Api gateway --> user

Authorization workflow:

user [get /products] --> Api gateway --> product service [post /authorize] with request body {httpMethod:'get',path:'/products'} --> Auth service [response] --> product service [response] --> Api gateway --> user

## Contribution

check [contribution guide](./CONTRIBUTION.md)

## Api

### `POST /users`

Register a new user to the system.

Request:

```js
{
    firstName:   String,
    lastName:    String,
    email:       String,
    password:    String,
    phoneNumber: String
}
```

Response:

```js
{
    user : {
        roleId : Number,
        id : Number,
        firstName : String,
        lastName : String,
        email : String,
        phoneNumber : String
    },
    accessToken : String,
    refreshToken : String
}
```

Status codes:

```yaml
201:
  The user created and the user info returned.
422:
  Error in one or more inputs format as a weak password or putting an invalid email.
409:
  There's an account with the same email.
```

### `POST /users/login`

Authenticate user credentials and log him into the system.

Request:

```js
{
    email:       String,
    password:    String,
}
```

Response:

```js
{
    user : {
        roleId : Number,
        id : Number,
        firstName : String,
        lastName : String,
        email : String,
        phoneNumber : String
    },
    accessToken : String,
    refreshToken : String
}
```

Status codes:

```yaml
200:
  The user credentials are correct and he logged into the system.
401:
  The user credentials are wrong.
```

### `Get /users/logout`

logout the user from this session.

Status codes:

```yaml
        200:
          The user logged out successfully.
        401:
          can't logout the user.
```

### `Get /users/logoutall`

logout the user from all sessions.

Status codes:

```yaml
        200:
          The user logged out successfully.
        401:
          can't logout the user.
```

### `POST /roles`

Add new role.

Request:

```js
{
    roleName: String
}
```

Response:

```js
{
  id : String,
  roleName : String,
}
```

Status codes:

```yaml
201:
  new role created.
401:
  user unauthorized to create new role.
409:
  There's a role with the same name.
```

### `POST /permissions`

Add a new permission to access a resource to a role.

Request:

```js
{
    httpMethod: String,
    path: String,
    roleId: Number
}
```

Response:

```js
{
    httpMethod: String,
    path: String,
    roleId: Number
}
```

Status codes:

```yaml
201:
  permission created.
401:
  unauthorized to create a permission.
```

### `POST /authorize`

check if user authorized to access an endpoint on another service.

Request:

```js
{
    httpMethod: String,
    path: String
}
```

Response:

```js
{
  authorized: Boolean
}
```

Status codes:

```yaml
200:
  authorized.
401:
  unauthorized.
```

### `Delete /permissions/:id`

Delete a permission with it's id.

Response:

```js
{
    httpMethod: String,
    path: String,
    roleId: Number
}
```

Status codes:

```yaml
200:
  permission deleted.
401:
  unauthorized to delete a permission.
```
