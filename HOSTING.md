## Host Your Own Service

You can host this Service in your own Server or can embed in your project according to the MIT License.

### Table of contents

* [Infrastructure](#infrastructure-providers)
* [Guide](#guide)

## Infrastructure Providers:
- [Railway.app](https://railway.app)
- [Heroku](https://www.heroku.com/)
- Your own Server

## Guide

**NOTE**: Go to spotify developer site and create a application with no scopes

1) Hosting on Paas like Railway, Heroku, etc.
    - Make a .env and add
        - ```Client_ID``` var
        - ```Client_Secret``` var
    - or add them directly from the dashboard of the Paas you are using
    - Edit ```Procfile``` and ```package.json``` according to the service you are using.

2) Hosting on your own server (without docker)
    - Make sure ```Screen``` is installed and running
    - Clone the Repo and run ```npm install```
    - Run the server ```node index.js```

3) Will add docker steps soon!

