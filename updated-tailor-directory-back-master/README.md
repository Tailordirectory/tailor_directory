# Application

### tech stack

Express/mongodb

### run

> Just run script in console ./deploy.sh

### api documentation

Here is only documentation by postman

> ./\_doc/tailors-directory.postman_collection.json

### env

> env example - ./\_deployment/local/docker-compose.yml

### express-acl and express-jwt

> ACL config - ./src/config/acl.json
> and path where you can use without JWT token - ./src/config/no-auth-paths.js

How is working acl?

> Firstly express-jwt check JWT token if it's valid the decoded JWT sets in `req.user`, then we use `userId` from decoded token for search user in database and get his role. We sets the role in
> `req.session.role` and express-acl checking is user have access or not.  
> example middleware -`./src/middleware/user-by-token.js`

### database

In this project using mongodb with mongoose

> models - ./src/models  
> /classes/models-controllers

### Sentry (third party error debug service)

> Sentry it's third party service for logging errors, so if you wanna normally
> log your errors firstly you must create Sentry account and got key, that we fill into env param `SENTRY_DSN` then init it like in example

Example:

```js
const Raven = require('raven');
Raven.config(config.SENTRY_DSN).install();
app.use(Raven.errorHandler());
```
