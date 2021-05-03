# Yatzer backend

A GraphQL backend for Yatzer made with Node.js Apollo-server-express and TypeScript.

Backend is running in Heroku: https://yatzer-backend.herokuapp.com/
Frontend can be found on netlify: https://trusting-babbage-99c0e2.netlify.app/

## Some example queries/mutations

Sign Up

```
mutation {
    signUp(username: "USERNAME", password: "PASSWORD") {
        username
    }
}
```

Sign In 

```
query {
    signIn(username: "USERNAME", password: "PASSWORD") {
        username
        token
    }
}
```

Get count of all the users

```
query {
    getUserCount
}
```

Get count of all the games

```
query {
    getGameCount
}
```