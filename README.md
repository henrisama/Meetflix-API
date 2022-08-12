# Meetflix API 🍿

### Run

```
git clone https://github.com/henrisama/Meetflix-API.git
cd Meetflix-API
```

> #### With Docker
>
> You can create 2 or more instances (server).
>
> ```
> docker-compose up --scale instance=2 -d
> ```
>
> You can request http://localhost:3000/api/test-2 to see which intance responds. It will return their hostname.

> #### Without Docker
>
> Requirements:
>
> - [Nodejs](https://nodejs.org/)
> - [MongoDB](https://www.mongodb.com/try/download/community)
> - [Redis](https://redis.io/docs/getting-started/)
>
> yarn
>
> ```
> yarn
> yarn dev
> ```
>
> npm
>
> ```
> npm install
> npm run dev
> ```

### Conf.d

- REDIS: set memory cache. Default is 41943040 (40mb).
- NGINX: set listen and location. Default port is 3000.

### Environment variable:

```
PORT=3000
HOST=http://localhost:3000
MONGO_URI=mongodb://mongo:27017/meetflix
REDIS_PORT=6379
REDIS_HOST=redis
REDIS_PASSWORD=Imyourfather
TMDB_API={{TMDB_API}}
TOKEN_SECRET={{TOKEN_SECRET}}
GMAIL_USER={{GMAIL_USER}}
GMAIL_PASS={{GMAIL_PASS}}
GOOGLE_CLIENT_ID={{GOOGLE_CLIENT_ID}}
GOOGLE_CLIENT_SECRET={{GOOGLE_CLIENT_SECRET}}
FACEBOOK_CLIENT_ID={{FACEBOOK_CLIENT_ID}}
FACEBOOK_CLIENT_SECRET={{FACEBOOK_CLIENT_SECRET}}
```
| Environment Variable | Default | Description |
| --- | --- | --- |
| PORT | 3000| App port
| HOST | http://localhost:3000 | App host
| MONGO_URI | mongodb://mongo:27017/meetflix | Uri to database, host is mongo (configured for container created in docker by docker-compose). If you run the app on local without docker you need to change to mongodb://localhost:27017/meetflix
| REDIS_PORT | 6379 | port to redis
| REDIS_HOST | redis | Host is redis (configured for container created in docker by docker-compose). If you run the app on local without docker you need to change to localhost
| REDIS_PASSWORD | Imyourfather | Password to redis, you can change the password on docker-compose file.
| TMDB_API | - | Your [TMDB key](https://developers.themoviedb.org/3/getting-started/introduction).
| TOKEN_SECRET | - | For json web token on login, just a random string.
| GMAIL_USER and GMAIL_PASS | - | A Google account to send the confirmation email.
| GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET | - | Your [google credentials](https://console.cloud.google.com/apis/credentials/) to login with google.
| FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET | - | Your [facebook credentials](https://developers.facebook.com/docs/facebook-login/) to login with facebook.
