const path = require("path")
const express = require('express')
const SpotifyWebApi = require('spotify-web-api-node')
const cors = require('cors');

// Express Config
const app = express()
const port = process.env.PORT || 3000

// CORS
app.use(cors({
    origin: '*'
}));

// Static Dirs
app.use('/css', express.static('public/css'));
app.use('/fonts', express.static('fonts'));
app.use('/img', express.static('public/img'));

// Loading Dotenv if running on VPS
require('dotenv').config()

// Setting ClientID and ClientSecret
let spotifyApi = new SpotifyWebApi({
    clientId: process.env.Client_ID,
    clientSecret: process.env.Client_Secret,
    redirectUri: 'http://localhost:8888/callback',
});

// Defining Vars
let songName, songArtist, songImageURL; // Not Used

// Fonts for Card (Will switch back to Spotify Version of Gotham on production server)
const { registerFont, createCanvas, loadImage } = require('canvas');
registerFont("./fonts/GothamBold.ttf", { family: "GothamBold" });
registerFont("./fonts/Gotham-Black.otf", { family: "GothamBlack" });
registerFont("./fonts/GothamBook.ttf", { family: "GothamBook" });
registerFont("./fonts/GothamMedium.ttf", { family: "GothamMedium" });

// Client Credentials Flow with Auto Token Renew after 1 hour
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

// Theme Color Extraction
let rgb2hex=c=>'#'+c.match(/\d+/g).map(x=>(+x).toString(16).padStart(2,0)).join``
async function getAverageColor(img) {
    return new Promise(resolve => {
        const tempCanvas = createCanvas(1080, 1080);
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.drawImage(img, 0, 0, 1, 1);
        const rgb = tempCtx.getImageData(0, 0, 1, 1).data.slice(0,3).join(", ")
        const hex = rgb2hex(rgb)
        resolve(hex);
    });
}

// Function, Name, Color
async function searchTracksbyName(name, color, orientation, res) {
    let totalArtist;
    let artistList = [];
    let artistString = '';
    let songName;
    let imageURL;
    var width, height, imageX, imageY, imageWidth, imageHeight,
    songX, songY, songFont, songNameX, songNameY, songArtistX, songArtistY, songArtistFont,
    bottomTextX, bottomTextY, bottomTextFont, dmX, dmY, dmW, dmH;
    const text = 'SONG'
    const bottomText = 'LISTEN ON'

    if (orientation === "landscape") {
        width = 1200
        height = 630
        imageX = 105;
        imageY = 115;
        imageWidth = 400
        imageHeight = 400
        songX = 560
        songY = 200
        songNameX = 560
        songNameY = 250
        songFont = "bold 100px"
        songFontMax = "100"
        songFontMin = "70"
        songArtistX = 560
        songArtistY = 380
        songArtistFont = "bold 40px"
        songArtistFontMax = "40"
        songArtistFontMin = "30"
        bottomTextX = 805
        bottomTextY = 542
        bottomTextFont = "20px"
        dmX = 960
        dmY = 520
        dmW = 199.64
        dmH = 60
    } else if (orientation === "square") {
        width = 1080;
        height = 1080;
        imageX = 0;
        imageY = 330;
        imageWidth = 750
        imageHeight = 750
        songNameX = 70
        songNameY = 50
        songFont = "50px"
        songArtistX = 70
        songArtistY = 160
        songArtistFont = "68px"
        bottomTextX = 815
        bottomTextY = 850
        bottomTextFont = "30px"
        dmX = 795
        dmY = 920
        dmW = 250
        dmH = 75
    }

    const data = await spotifyApi.searchTracks(name, {market:'US', limit:1, offset:0})
    if (data.body.tracks.total === 0 || data.body.tracks.items.length === 0) {
        res.send("Invalid name")
        return false;
    }

    // Track Name
    songName = data.body.tracks.items[0].name;

    // Image URL 640x640
    imageURL = data.body.tracks.items[0].album.images[0].url

    // Artist List
    totalArtist = data.body.tracks.items[0].artists.length;
    for (let i = 0; i < totalArtist; i++) {
        artistList[i] = data.body.tracks.items[0].artists[i].name;
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    if (color === "#000") {
        const image = await loadImage(imageURL)
        color = await getAverageColor(image)
    }
    context.fillStyle = color;
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'top'

    context.fillStyle = '#fff'
    if (orientation === "landscape") {
        context.font = 'bold 22px GothamBlack'
        var ctext = text.split("").join(String.fromCharCode(8202))
        context.fillText(ctext, songX, songY)
    }
    if (orientation === "landscape") {
        // textWrap returns the downward shift that next element has to undergo
        songArtistY += textWrap(songName, songFontMax, songFontMin, 580, context, songNameX, songNameY, "bold ", "px GothamBold");
    } else {
        context.font = `${songFont} GothamBold`
        context.fillText(songName, songNameX, songNameY)
    }

    artistString = artistList.join(", ")
    if (orientation === "landscape") {
        let downShift = textWrap(artistString, songArtistFontMax, songArtistFontMin, 500, context, songArtistX, songArtistY, "bold ", "px GothamBook");
        bottomTextY += downShift;
        dmY += downShift;
    } else {
        context.font = `${songArtistFont} GothamBook`
        context.fillText(artistString, songArtistX, songArtistY)
    }

    context.font = `${bottomTextFont} GothamBold`
    var cbottomText = bottomText.split("").join(String.fromCharCode(8202))
    context.fillText(cbottomText, bottomTextX, bottomTextY)
    loadImage('./logo/Spotify_logo_with_text.svg').then(image => {
        context.drawImage(image, dmX, dmY, dmW, dmH)
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


// Function ID, Color 
async function searchTracksbyID(id, color, orientation, res) {
    let totalArtist;
    let artistList = [];
    let artistString = '';
    let songName;
    let imageURL;
    var width, height, imageX, imageY, imageWidth, imageHeight,
    songX, songY, songFont, songNameX, songNameY, songArtistX, songArtistY, songArtistFont,
    bottomTextX, bottomTextY, bottomTextFont, dmX, dmY, dmW, dmH;
    const text = 'SONG'
    const bottomText = 'LISTEN ON'

    if (orientation === "landscape") {
        width = 1200
        height = 630
        imageX = 105;
        imageY = 115;
        imageWidth = 400
        imageHeight = 400
        songX = 560
        songY = 200
        songNameX = 560
        songNameY = 250
        songFont = "bold 100px"
        songFontMax = "100"
        songFontMin = "70"
        songArtistX = 560
        songArtistY = 380
        songArtistFont = "bold 40px"
        songArtistFontMax = "40"
        songArtistFontMin = "30"
        bottomTextX = 805
        bottomTextY = 542
        bottomTextFont = "20px"
        dmX = 960
        dmY = 520
        dmW = 199.64
        dmH = 60
    } else if (orientation === "square") {
        width = 1080;
        height = 1080;
        imageX = 0;
        imageY = 330;
        imageWidth = 750
        imageHeight = 750
        songNameX = 70
        songNameY = 50
        songFont = "50px"
        songArtistX = 70
        songArtistY = 160
        songArtistFont = "68px"
        bottomTextX = 815
        bottomTextY = 850
        bottomTextFont = "30px"
        dmX = 795
        dmY = 920
        dmW = 250
        dmH = 75
    }

    var data;
    try {
        data = await spotifyApi.getTrack(id, {market:'US', limit:1, offset:5})
    } catch (e) {
        res.send("Invalid ID")
        return false;
    }

    // Track Name
    songName = data.body.name;

    // Image URL 640x640
    imageURL = data.body.album.images[0].url

    // Artist List
    totalArtist = data.body.album.artists.length;

    for (let i = 0; i < totalArtist; i++) {
        artistList[i] = data.body.album.artists[i].name;
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    if (color === "#000") {
        const image = await loadImage(imageURL)
        color = await getAverageColor(image)
    }
    context.fillStyle = color;
    context.fillRect(0, 0, width, height)

    context.textBaseline = 'top'

    context.fillStyle = '#fff'
    if (orientation === "landscape") {
        context.font = 'bold 22px GothamBlack'
        var ctext = text.split("").join(String.fromCharCode(8202))
        context.fillText(ctext, songX, songY)
    }
    if (orientation === "landscape") {
        songArtistY += textWrap(songName, songFontMax, songFontMin, 580, context, songNameX, songNameY, "bold ", "px GothamBold");
    } else {
        context.font = `${songFont} GothamBold`
        context.fillText(songName, songNameX, songNameY)
    }

    artistString = artistList.join(", ")
    if (orientation === "landscape") {
        let downShift = textWrap(artistString, songArtistFontMax, songArtistFontMin, 500, context, songArtistX, songArtistY, "bold ", "px GothamBook");
        bottomTextY += downShift;
        dmY += downShift;
    } else {
        context.font = `${songArtistFont} GothamBook`
        context.fillText(artistString, songArtistX, songArtistY)
    }

    context.font = `${bottomTextFont} GothamBold`
    var cbottomText = bottomText.split("").join(String.fromCharCode(8202))
    context.fillText(cbottomText, bottomTextX, bottomTextY)
    loadImage('./logo/Spotify_logo_with_text.svg').then(image => {
        context.drawImage(image, dmX, dmY, dmW, dmH)
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

function textWrap(text, max, min, maxWidth, ctx, x, y, fontPre, fontPost) {
    let currentFontSize;
    for(currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
        ctx.font = fontPre + currentFontSize + fontPost;
        let currentWidth = ctx.measureText(text).width;
        if (currentWidth < maxWidth) {
            break;
        }
    }

    if (currentFontSize >= parseInt(min)) {
        // we have found an appropriate font size for 1 line
        ctx.fillText(text, x, y);
        return 0;
    } else {
        // even the shortest font size is overflowing for 1 line

        for (currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
            let tobreak = false;
            ctx.font = fontPre + currentFontSize + fontPost;

            let words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                } else {
                    words = words.splice(_);
                    secondLine = words.join(" ");
                    if (ctx.measureText(secondLine).width < maxWidth) {
                        tobreak = true;
                    }
                    break;
                }
            }
            if(tobreak) {
                break;
            }
        }

        if (currentFontSize >= parseInt(min)) {
            // found an appropriate font size for 2 lines
            ctx.font = fontPre + currentFontSize + fontPost;
            let words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                } else {
                    ctx.fillText(firstLine, x, y);
                    secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        } else {
            // need to remove some words
            let words = text.split(" ");
            firstLine = words[0];
            ctx.font = fontPre + min + fontPost;
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                } else {
                    words = words.splice(_);
                    secondLine = words[0];
                    for (let __ = 1; __ < words.length; __++) {
                        let word = words[__];
                        let currentLineWidth = ctx.measureText(secondLine + " " + word).width;
                        if (currentLineWidth < maxWidth) {
                            secondLine += " " + word;
                        } else {
                            text = firstLine + " " + secondLine + "...";
                            break;
                        }
                    }
                    break;
                }
            }

            for (currentFontSize = parseInt(max); currentFontSize >= parseInt(min); currentFontSize--) {
                let tobreak = false;
                ctx.font = fontPre + currentFontSize + fontPost;
    
                let words = text.split(" ");
                firstLine = words[0];
                for (let _ = 1; _ < words.length; _++) {
                    let word = words[_];
                    let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                    if (currentLineWidth < maxWidth) {
                        firstLine += " " + word;
                    } else {
                        words = words.splice(_);
                        secondLine = words.join(" ");
                        if (ctx.measureText(secondLine).width < maxWidth) {
                            tobreak = true;
                        }
                        break;
                    }
                }
                if(tobreak) {
                    break;
                }
            }

            ctx.font = fontPre + currentFontSize + fontPost;
            words = text.split(" ");
            firstLine = words[0];
            for (let _ = 1; _ < words.length; _++) {
                let word = words[_];
                let currentLineWidth = ctx.measureText(firstLine + " " + word).width;
                if (currentLineWidth < maxWidth) {
                    firstLine += " " + word;
                } else {
                    ctx.fillText(firstLine, x, y);
                    secondLine = words.slice(_).join(" ");
                    ctx.fillText(secondLine, x, y + currentFontSize);
                    return currentFontSize;
                }
            }
        }
    }
}

// Index
app.get('/', (req, res) => {
    // Currently Only Song Name
    res.sendFile(path.join(__dirname, 'public/index.html'))

});

// API
app.get('/api', (req, res) => {
    let imageColor = '#000';
    let songName = req.query.name;
    let songID = req.query.id;
    let orientation = req.query.orientation;
    if (req.query.color != null){
        imageColor = '#' + req.query.color
    }
    if (orientation === null || !["landscape", "square"].includes(orientation)) {
        orientation = "landscape"
    }
    if (songName != null && songID == null){
        searchTracksbyName(songName, imageColor, orientation, res);
    } else if (songID != null && songName == null) {
        searchTracksbyID(songID, imageColor, orientation, res);
    } else {
        res.send('name or id not provided or both provided instead of one')
    }
})

// Running Server
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
});
