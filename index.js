const fetch = require('cross-fetch')
const path = require("path")
const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors');

const app = express()
const port = 3000

app.use(cors({
    origin: '*'
}));

app.use('/css', express.static('public/css'))
app.use('/fonts', express.static('fonts'));

require('dotenv').config()

let spotifyApi = new SpotifyWebApi({
    clientId: process.env.Client_ID,
    clientSecret: process.env.Client_Secret,
    redirectUri: 'http://localhost:8888/callback',
});

// Defining Vars
let songName, songArtist, songImageURL;

// Fonts for Card
const { registerFont, createCanvas, loadImage } = require('canvas');
registerFont("./fonts/GothamBold.ttf", { family: "GothamBold" });
registerFont("./fonts/Gotham-Black.otf", { family: "GothamBlack" });
registerFont("./fonts/GothamBook.ttf", { family: "GothamBook" });
registerFont("./fonts/GothamMedium.ttf", { family: "GothamMedium" });

// Client Credentials Flow
function newToken(){
    spotifyApi.clientCredentialsGrant().then(
        function(data) {
        console.log('The access token expires in ' + data.body['expires_in']);
        // console.log('The access token is ' + data.body['access_token']);
    
        // Save the access token so that it's used in future calls
        spotifyApi.setAccessToken(data.body['access_token']);
        return data.body['access_token']
        },
        function(err) {
        console.log('Something went wrong when retrieving an access token', err);
        }
    );
}
newToken();
tokenRefreshInterval = setInterval(newToken, 1000 * 60 * 60);

// spotifyApi.clientCredentialsGrant().then(
//     function(data) {
//     console.log('The access token expires in ' + data.body['expires_in']);
//     // console.log('The access token is ' + data.body['access_token']);

//     // Save the access token so that it's used in future calls
//     spotifyApi.setAccessToken(data.body['access_token']);
//     return data.body['access_token']
//     },
//     function(err) {
//     console.log('Something went wrong when retrieving an access token', err);
//     }
// );







// Function Returning Name, Artist Name, Image URL 
async function searchTracksbyName(name, color, res) {
    let totalArtist;
    let artistList = [];
    let artistString = '';
    let songName;
    let imageURL;
    const width = 1200
    const height = 630
    const imageX = 105;
    const imageY = 115;
    const imageWidth = 400
    const imageHeight = 400
    const songX = 560
    const songY = 200
    const songNameX = 560
    const songNameY = 250 // 260
    const songArtistX = 560
    const songArtistY = 380
    const bottomTextX = 805
    const bottomTextY = 542
    const text = 'SONG'
    const bottomText = 'LISTEN ON'

    const data = await spotifyApi.searchTracks(name, {market:'US', limit:1, offset:5})
    // Track Name
    songName = data.body.tracks.items[0].album.name;

    // Image URL 640x640
    imageURL = data.body.tracks.items[0].album.images[0].url

    // Artist List
    totalArtist = data.body.tracks.items[0].artists.length;
    for (let i = 0; i < totalArtist; i++) {
        artistList[i] = data.body.tracks.items[0].artists[i].name;
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = color; // theme color extraction implementation still to be done
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'top'

    context.fillStyle = '#fff'
    context.font = 'bold 22px GothamBlack'
    var ctext = text.split("").join(String.fromCharCode(8202))
    context.fillText(ctext, songX, songY)
    context.font = 'bold 100px GothamBlack'
    context.fillText(songName, songNameX, songNameY)
    context.font = 'bold 40px GothamBook'
    for (let i = 0; i < artistList.length; i++) {
        if (i==artistList.length-1) {
            artistString += artistList[i]
        }
        else {
            artistString += artistList[i] + ", "
        }
    }

    context.fillText(artistString, songArtistX, songArtistY)
    context.font = '20px GothamBold'
    var cbottomText = bottomText.split("").join(String.fromCharCode(8202))
    context.fillText(cbottomText, bottomTextX, bottomTextY)
    loadImage('./logo/Spotify_logo_with_text.svg').then(image => {
        context.drawImage(image, 960, 520, 199.64, 60)
        loadImage(imageURL).then(image=> {
            context.drawImage(image, imageX, imageY, imageWidth, imageHeight)
            const buffer = canvas.toBuffer('image/png')
            const cardURL = buffer.toString('base64')
            const img = Buffer.from(cardURL, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            })
            res.end(img)
            // const spotifyCard = {
            //     spotifyCardURL: cardURL
            // }
            // res.render('api', spotifyCard)
            // res.send(cardURL)
            // res.write('<img src = "'+cardURL+'">');
            // console.log(cardURL) // Image which we want
            // fs.writeFileSync('./test.png', buffer)
        })
    })

}



async function searchTracksbyID(id, color, res) {
    let totalArtist;
    let artistList = [];
    let artistString = '';
    let songName;
    let imageURL;
    const width = 1200
    const height = 630
    const imageX = 105;
    const imageY = 115;
    const imageWidth = 400
    const imageHeight = 400
    const songX = 560
    const songY = 200
    const songNameX = 560
    const songNameY = 250
    const songArtistX = 560
    const songArtistY = 380
    const bottomTextX = 805
    const bottomTextY = 542
    const text = 'SONG'
    const bottomText = 'LISTEN ON'

    const data = await spotifyApi.getTrack(id, {market:'US', limit:1, offset:5})
    // Track Name
    songName = data.body.album.name;

    // Image URL 640x640
    imageURL = data.body.album.images[0].url

    // Artist List
    totalArtist = data.body.album.artists.length;

    for (let i = 0; i < totalArtist; i++) {
        artistList[i] = data.body.album.artists[i].name;
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.fillStyle = color; // theme color extraction implementation still to be done
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'top'

    context.fillStyle = '#fff'
    context.font = 'bold 22px GothamBlack'
    var ctext = text.split("").join(String.fromCharCode(8202))
    context.fillText(ctext, songX, songY)
    context.font = 'bold 100px GothamBlack'
    context.fillText(songName, songNameX, songNameY)
    context.font = 'bold 40px GothamBook'
    for (let i = 0; i < artistList.length; i++) {
        if (i==artistList.length-1) {
            artistString += artistList[i]
        }
        else {
            artistString += artistList[i] + ", "
        }
    }

    context.fillText(artistString, songArtistX, songArtistY)
    context.font = '20px GothamBold'
    var cbottomText = bottomText.split("").join(String.fromCharCode(8202))
    context.fillText(cbottomText, bottomTextX, bottomTextY)
    loadImage('./logo/Spotify_logo_with_text.svg').then(image => {
        context.drawImage(image, 960, 520, 199.64, 60)
        loadImage(imageURL).then(image=> {
            context.drawImage(image, imageX, imageY, imageWidth, imageHeight)
            const buffer = canvas.toBuffer('image/png')
            const cardURL = buffer.toString('base64')
            const img = Buffer.from(cardURL, 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            })
            res.end(img)
        })
    })

}













app.get('/', (req, res) => {
    // Currently Only Song Name
    res.sendFile(path.join(__dirname, 'public/index.html'))

});

app.get('/api', (req, res) => {
    let imageColor = '#000';
    let songName = req.query.name;
    let songID = req.query.id;
    if (req.query.color != null){
        imageColor = '#' + req.query.color
    }
    if (songName != null && songID == null){
        searchTracksbyName(songName, imageColor, res);
    } else if (songID != null && songName == null) {
        searchTracksbyID(songID, imageColor, res);
    } else {
        res.send('name or id not provided')
    }
    
    // songName, songArtist, songImageURL = SpotifyTrackSearch('Alchemy')
    // res.send(songName)
})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});
