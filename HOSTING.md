## Host Your Own Service

You can host this Service in your own Server or can embed in your project according to the MIT License.

### Table of contents

- [Infrastructure](#infrastructure-providers)
- [Guide](#guide)

## Infrastructure Providers:

- [Railway.app](https://railway.app)
- [Heroku](https://www.heroku.com/)
- Your own Server

## Guide

**NOTE**: Go to spotify developer site and create a application with no scopes

1. Hosting on Paas like Railway, Heroku, etc.

   - Make a .env and add
     - `Client_ID` var with your Spotify Dev Application Details
     - `Client_Secret` var with your Spotify Dev Application Details
   - or add them directly from the dashboard of the Paas you are using
   - Edit `Procfile` and `package.json` according to the service you are using.

2. Hosting on your own server (without docker)

   - Make sure `Screen` is installed and running (If using Unix Based System)
   - Clone the Repo and run `npm install`
   - Make a .env and add
     - `Client_ID` var with your Spotify Dev Application Details
     - `Client_Secret` var with your Spotify Dev Application Details
   - Run the server `node index.js`

3. Hosting on your own server (with docker)

   - Make sure traefik is installed. You can follow this [tutorial](https://fossian.com/simplify-deployment-traefik-walk-through/) to deploy traefik on your server.
   - Make sure to change the network on **line 12 and 23** according to the network on which traefik is listening. Like in the above mentioned tutorial traefik is listening on `web` network so change it according to it.
   - Change Host on **line 18** to whatever subdomain or domain you are using. Spotify cards will be available on that host.
   - Finally run `docker-compose up -d` or `docker compose up -d` . The web app should be accessible on the subdomain or domain which you entered above.
   - For any issues or reporting bugs: [Issues](https://github.com/AmreshSinha/Spotify-Cards-API/issues)
