# scheduledChanges-backend

Create local database
- `createdb -U postgres scheduled_changes_db`

Log into local database
- `psql -U postgres scheduled_changes_db`

Add user to database
- `CREATE USER node_user WITH SUPERUSER PASSWORD 'node_password';`

##To Debug Node.js
- Use command in terminal `node --inspect bin/server.js ` to run the backend in debug mode
- Run the front end

## On lightsail server production

- To ssh into server
    - `chmod 600 KEYFILE`
    - `ssh -i KEYFILE bitnami@SERVER-IP`
 
- Root folder `/opt/bitnami/apps/firstapp`
    - `cd stack`
    - `sudo ./use_nodejs`
    - `mkdir apps`
    - `cd apps`
    - `mkdir firstapp`

This is to change port 80 (http) to something else - changed to port 8080 so we can run app on port 80
> vim /opt/bitnami/apache2/conf/httpd.conf


This is to change port 80 (http) to something else - changed to port 8080 so we can run app on port 80
> vim /opt/bitnami/apache2/conf/bitnami/bitnami.conf


This is to restart after updating server settings
> sudo /opt/bitnami/ctlscript.sh restart apache

On NPM 
> npm install -g parcel
>
> npm install -g nodemon
>
> npm install -g foreman
>
> npm install pm2@latest -g

Procfile
> frontend: parcel ./frontend/src/index.html --port 80

On Frontend
- Update `.env` file 
```js
 BACKEND_ADDRESS='http://localhost:3001'
```

On Backend
- Add `/secrets/` folder with `databaseConfiguration.js`

```js
module.exports = {
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432
};
``` 

and `index.js` 

```js
const APP_SECRET = 'secretString';

module.exports = { APP_SECRET };
```

- Inside `backend/secrets/frontendConfiguration.js` change url `localhost:1234` to frontend address url
```js
module.exports = {
  url: 'http://localhost:1234'
};
```

- Make sure you deploy `.sql` queries on database, using `pgAdmin`

- Use `npm run start` on root to start server

- For local database, run `psql -U node_user dragonstackdb` to login

- `/backend/app/api/helper.js` update with secure uncommented

```js
const setSessionCookie = ({ sessionString, res}) => {
  res.cookie('sessionString', sessionString, {
    expire: Date.now() + 3600000,
    httpOnly: true,
    secure: true // use with https
  });
};
```

- `/frontend/src/config.js` add https to url

- `/backend/app/index.js` add https to url

- Use frontend port 443 for https

On backend file

- `/backend/bin/server.js`

```js
const app = require('../app');
var fs = require('fs');
var https = require('https');

const port = 3000;

https.createServer({
  key: fs.readFileSync(__dirname + '/server.key'),
  cert: fs.readFileSync(__dirname + '/server.crt')
}, app).listen(port, () => console.log(`listen on port ${port}`));
```

### NPM Install

Run `npm install` before pm2

### To run the frontend
- Use command `sudo pm2 start npm --name frontend -- run start` based on `pm2 start npm --name "{app_name}" -- run {script_name}`

### To run the backend
- Use command `sudo pm2 start npm --name backend -- run start`

#### If running backend/frontend on separate servers
- Run on port 80 on their respective servers 

### Restart on production

`pm2 restart app_name`

- If restarting frontend, run `npm run build` then restart the frontend app