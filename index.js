const path = require("path");
const express = require("express");
const SpotifyWebApi = require("spotify-web-api-node");
const cors = require("cors");
const fs = require("fs");

var svg_text = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" height="168px" width="559px" version="1.1" viewBox="0 0 559 168">
 <path fill="#fff" d="m83.996 0.277c-46.249 0-83.743 37.493-83.743 83.742 0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l0.001-0.004zm38.404 120.78c-1.5 2.46-4.72 3.24-7.18 1.73-19.662-12.01-44.414-14.73-73.564-8.07-2.809 0.64-5.609-1.12-6.249-3.93-0.643-2.81 1.11-5.61 3.926-6.25 31.9-7.288 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.802c-1.89 3.072-5.91 4.042-8.98 2.152-22.51-13.836-56.823-17.843-83.448-9.761-3.453 1.043-7.1-0.903-8.148-4.35-1.04-3.453 0.907-7.093 4.354-8.143 30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-0.001zm0.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219-1.254-4.14 1.08-8.513 5.221-9.771 29.581-8.98 78.756-7.245 109.83 11.202 3.73 2.209 4.95 7.016 2.74 10.733-2.2 3.722-7.02 4.949-10.73 2.739zm94.56 3.072c-14.46-3.448-17.03-5.868-17.03-10.953 0-4.804 4.52-8.037 11.25-8.037 6.52 0 12.98 2.455 19.76 7.509 0.2 0.153 0.46 0.214 0.71 0.174 0.26-0.038 0.48-0.177 0.63-0.386l7.06-9.952c0.29-0.41 0.21-0.975-0.18-1.288-8.07-6.473-17.15-9.62-27.77-9.62-15.61 0-26.52 9.369-26.52 22.774 0 14.375 9.41 19.465 25.67 23.394 13.83 3.187 16.17 5.857 16.17 10.629 0 5.29-4.72 8.58-12.32 8.58-8.44 0-15.33-2.85-23.03-9.51-0.19-0.17-0.45-0.24-0.69-0.23-0.26 0.02-0.49 0.14-0.65 0.33l-7.92 9.42c-0.33 0.4-0.29 0.98 0.09 1.32 8.96 8 19.98 12.22 31.88 12.22 16.82 0 27.69-9.19 27.69-23.42 0.03-12.007-7.16-18.657-24.77-22.941l-0.03-0.013zm62.86-14.26c-7.29 0-13.27 2.872-18.21 8.757v-6.624c0-0.523-0.42-0.949-0.94-0.949h-12.95c-0.52 0-0.94 0.426-0.94 0.949v73.601c0 0.52 0.42 0.95 0.94 0.95h12.95c0.52 0 0.94-0.43 0.94-0.95v-23.23c4.94 5.53 10.92 8.24 18.21 8.24 13.55 0 27.27-10.43 27.27-30.369 0.02-19.943-13.7-30.376-27.26-30.376l-0.01 0.001zm12.21 30.375c0 10.149-6.25 17.239-15.21 17.239-8.85 0-15.53-7.41-15.53-17.239 0-9.83 6.68-17.238 15.53-17.238 8.81-0.001 15.21 7.247 15.21 17.237v0.001zm50.21-30.375c-17.45 0-31.12 13.436-31.12 30.592 0 16.972 13.58 30.262 30.91 30.262 17.51 0 31.22-13.39 31.22-30.479 0-17.031-13.62-30.373-31.01-30.373v-0.002zm0 47.714c-9.28 0-16.28-7.46-16.28-17.344 0-9.929 6.76-17.134 16.07-17.134 9.34 0 16.38 7.457 16.38 17.351 0 9.927-6.8 17.127-16.17 17.127zm68.27-46.53h-14.25v-14.566c0-0.522-0.42-0.948-0.94-0.948h-12.95c-0.52 0-0.95 0.426-0.95 0.948v14.566h-6.22c-0.52 0-0.94 0.426-0.94 0.949v11.127c0 0.522 0.42 0.949 0.94 0.949h6.22v28.795c0 11.63 5.79 17.53 17.22 17.53 4.64 0 8.49-0.96 12.12-3.02 0.3-0.16 0.48-0.48 0.48-0.82v-10.6c0-0.32-0.17-0.63-0.45-0.8-0.28-0.18-0.63-0.19-0.92-0.04-2.49 1.25-4.9 1.83-7.6 1.83-4.15 0-6.01-1.89-6.01-6.11v-26.76h14.25c0.52 0 0.94-0.426 0.94-0.949v-11.126c0.02-0.523-0.4-0.949-0.93-0.949l-0.01-0.006zm49.64 0.057v-1.789c0-5.263 2.02-7.61 6.54-7.61 2.7 0 4.87 0.536 7.3 1.346 0.3 0.094 0.61 0.047 0.85-0.132 0.25-0.179 0.39-0.466 0.39-0.77v-10.91c0-0.417-0.26-0.786-0.67-0.909-2.56-0.763-5.84-1.546-10.76-1.546-11.95 0-18.28 6.734-18.28 19.467v2.74h-6.22c-0.52 0-0.95 0.426-0.95 0.948v11.184c0 0.522 0.43 0.949 0.95 0.949h6.22v44.405c0 0.53 0.43 0.95 0.95 0.95h12.94c0.53 0 0.95-0.42 0.95-0.95v-44.402h12.09l18.52 44.402c-2.1 4.66-4.17 5.59-6.99 5.59-2.28 0-4.69-0.68-7.14-2.03-0.23-0.12-0.51-0.14-0.75-0.07-0.25 0.09-0.46 0.27-0.56 0.51l-4.39 9.63c-0.21 0.46-0.03 0.99 0.41 1.23 4.58 2.48 8.71 3.54 13.82 3.54 9.56 0 14.85-4.46 19.5-16.44l22.46-58.037c0.12-0.292 0.08-0.622-0.1-0.881-0.17-0.257-0.46-0.412-0.77-0.412h-13.48c-0.41 0-0.77 0.257-0.9 0.636l-13.81 39.434-15.12-39.46c-0.14-0.367-0.49-0.61-0.88-0.61h-22.12v-0.003zm-28.78-0.057h-12.95c-0.52 0-0.95 0.426-0.95 0.949v56.481c0 0.53 0.43 0.95 0.95 0.95h12.95c0.52 0 0.95-0.42 0.95-0.95v-56.477c0-0.523-0.42-0.949-0.95-0.949v-0.004zm-6.4-25.719c-5.13 0-9.29 4.152-9.29 9.281 0 5.132 4.16 9.289 9.29 9.289s9.28-4.157 9.28-9.289c0-5.128-4.16-9.281-9.28-9.281zm113.42 43.88c-5.12 0-9.11-4.115-9.11-9.112s4.04-9.159 9.16-9.159 9.11 4.114 9.11 9.107c0 4.997-4.04 9.164-9.16 9.164zm0.05-17.365c-4.67 0-8.2 3.71-8.2 8.253 0 4.541 3.51 8.201 8.15 8.201 4.67 0 8.2-3.707 8.2-8.253 0-4.541-3.51-8.201-8.15-8.201zm2.02 9.138l2.58 3.608h-2.18l-2.32-3.31h-1.99v3.31h-1.82v-9.564h4.26c2.23 0 3.69 1.137 3.69 3.051 0.01 1.568-0.9 2.526-2.21 2.905h-0.01zm-1.54-4.315h-2.37v3.025h2.37c1.18 0 1.89-0.579 1.89-1.514 0-0.984-0.71-1.511-1.89-1.511z"/>
</svg>`;

// Express Config
const app = express();
const port = process.env.PORT || 3000;

// CORS
app.use(
  cors({
    origin: "*",
  })
);

// Static Dirs
app.use("/css", express.static("public/css"));
app.use("/fonts", express.static("fonts"));
app.use("/img", express.static("public/img"));
app.use("/assets/css", express.static("public/assets/css"));
app.use("/assets/fontawesome", express.static("public/assets/fontawesome"));
app.use("/assets/js", express.static("public/assets/js"));
app.use("/assets/plugins", express.static("public/assets/plugins"));
app.use("/assets/scss", express.static("public/assets/scss"));

// Loading Dotenv if running on VPS
require("dotenv").config();

// Setting ClientID and ClientSecret
let spotifyApi = new SpotifyWebApi({
  clientId: process.env.Client_ID,
  clientSecret: process.env.Client_Secret,
  redirectUri: "http://localhost:8888/callback",
});

// Defining Vars
let songName, songArtist, songImageURL; // Not Used

// Fonts for Card (Will switch back to Spotify Version of Gotham on production server)
const { registerFont, createCanvas, loadImage } = require("canvas");
registerFont("./fonts/GothamBold.ttf", { family: "GothamBold" });
registerFont("./fonts/Gotham-Black.otf", { family: "GothamBlack" });
registerFont("./fonts/GothamBook.ttf", { family: "GothamBook" });
registerFont("./fonts/GothamMedium.ttf", { family: "GothamMedium" });

// Client Credentials Flow with Auto Token Renew after 1 hour
function newToken() {
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      console.log("The access token expires in " + data.body["expires_in"]);
      // console.log('The access token is ' + data.body['access_token']);

      // Save the access token so that it's used in future calls
      spotifyApi.setAccessToken(data.body["access_token"]);
      return data.body["access_token"];
    },
    function (err) {
      console.log("Something went wrong when retrieving an access token", err);
    }
  );
}
newToken();
tokenRefreshInterval = setInterval(newToken, 1000 * 60 * 60);

// Theme Color Extraction
let rgb2hex = (c) =>
  "#" + c.match(/\d+/g).map((x) => (+x).toString(16).padStart(2, 0)).join``;
async function getAverageColor(img) {
  return new Promise((resolve) => {
    const tempCanvas = createCanvas(1080, 1080);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.drawImage(img, 0, 0, 1, 1);
    const rgb = tempCtx.getImageData(0, 0, 1, 1).data.slice(0, 3).join(", ");
    const hex = rgb2hex(rgb);
    resolve(hex);
  });
}

// Function, Name, Color
async function searchTracksbyName(name, color, orientation, res, colorGiven) {
  let totalArtist;
  let artistList = [];
  let artistString = "";
  let songName;
  let imageURL;
  var width,
    height,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    songX,
    songY,
    songFont,
    songNameX,
    songNameY,
    songArtistX,
    songArtistY,
    songArtistFont,
    bottomTextX,
    bottomTextY,
    bottomTextFont,
    dmX,
    dmY,
    dmW,
    dmH;
  const text = "SONG";
  const bottomText = "LISTEN ON";

  if (orientation === "landscape") {
    width = 1200;
    height = 630;
    imageX = 105;
    imageY = 115;
    imageWidth = 400;
    imageHeight = 400;
    songX = 560;
    songY = 200;
    songNameX = 560;
    songNameY = 250;
    songFont = "bold 100px";
    songFontMax = "100";
    songFontMin = "70";
    songArtistX = 560;
    songArtistY = 380;
    songArtistFont = "bold 40px";
    songArtistFontMax = "40";
    songArtistFontMin = "30";
    bottomTextX = 805;
    bottomTextY = 542;
    bottomTextFont = "20px";
    dmX = 960;
    dmY = 520;
    dmW = 199.64;
    dmH = 60;
  } else if (orientation === "square") {
    width = 1080;
    height = 1080;
    imageX = 0;
    imageY = 330;
    imageWidth = 750;
    imageHeight = 750;
    songNameX = 70;
    songNameY = 50;
    songFont = "50px";
    songArtistX = 70;
    songArtistY = 160;
    songArtistFont = "68px";
    bottomTextX = 815;
    bottomTextY = 850;
    bottomTextFont = "30px";
    dmX = 795;
    dmY = 920;
    dmW = 250;
    dmH = 75;
  } else if (orientation === "portrait") {
    width = 1080;
    height = 1920;
    imageX = 146;
    imageY = 240;
    imageWidth = 788;
    imageHeight = 788;
    songX = 115;
    songY = 1127;
    songNameX = 115;
    songNameY = 1215;
    songFont = "bold 150px";
    songFontMax = "150";
    songFontMin = "130";
    songArtistX = 115;
    songArtistY = 1390;
    songArtistFont = "bold 60px";
    songArtistFontMax = "60";
    songArtistFontMin = "40";
    bottomTextX = 475;
    bottomTextY = 1800;
    bottomTextFont = "40px";
    dmX = 770;
    dmY = 1780;
    dmW = 266.19;
    dmH = 80;
  }

  const data = await spotifyApi.searchTracks(name, {
    market: "US",
    limit: 1,
    offset: 0,
  });
  if (data.body.tracks.total === 0 || data.body.tracks.items.length === 0) {
    res.send("Invalid name");
    return false;
  }

  // Track Name
  songName = data.body.tracks.items[0].name;

  // Image URL 640x640
  imageURL = data.body.tracks.items[0].album.images[0].url;

  // Artist List
  totalArtist = data.body.tracks.items[0].artists.length;
  for (let i = 0; i < totalArtist; i++) {
    artistList[i] = data.body.tracks.items[0].artists[i].name;
  }

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const image = await loadImage(imageURL);
  const avcolor = await getAverageColor(image);
  if (!colorGiven) {
    color = avcolor;
  }
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  context.textBaseline = "top";

  fontColor = getFontColor(color, avcolor);
  context.fillStyle = fontColor;
  if (orientation === "landscape") {
    context.font = "bold 22px GothamBlack";
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  } else if (orientation == "portrait") {
    context.font = "bold 40px GothamBlack";
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  }
  if (orientation === "landscape") {
    // textWrap returns the downward shift that next element has to undergo
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      580,
      context,
      songNameX,
      songNameY,
      "bold ",
      "px GothamBold"
    );
  } else if (orientation === "portrait") {
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      850,
      context,
      songNameX,
      songNameY,
      "bold ",
      "px GothamBold"
    );
  } else {
    context.font = `${songFont} GothamBold`;
    context.fillText(songName, songNameX, songNameY);
  }

  artistString = artistList.join(", ");
  if (orientation === "landscape") {
    let downShift = textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook"
    );
    bottomTextY += downShift;
    dmY += downShift;
  } else if (orientation === "portrait") {
    textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook"
    );
  } else {
    context.font = `${songArtistFont} GothamBook`;
    context.fillText(artistString, songArtistX, songArtistY);
  }

  new_svg_text = svg_text.replace("#fff", fontColor);
  fs.writeFile(
    path.resolve(__dirname, "logo/Spotify_logo_with_text.svg"),
    new_svg_text,
    function (err) {
      if (err) {
        return console.log(err);
      }
      context.font = `${bottomTextFont} GothamBold`;
      var cbottomText = bottomText.split("").join(String.fromCharCode(8202));
      context.fillText(cbottomText, bottomTextX, bottomTextY);
      loadImage("./logo/Spotify_logo_with_text.svg").then((image) => {
        context.drawImage(image, dmX, dmY, dmW, dmH);
        loadImage(imageURL).then((image) => {
          context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
          const buffer = canvas.toBuffer("image/png");
          const cardURL = buffer.toString("base64");
          const img = Buffer.from(cardURL, "base64");
          res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": img.length,
          });
          res.end(img);
        });
      });
    }
  );
}

// Function ID, Color
async function searchTracksbyID(id, color, orientation, res, colorGiven) {
  let totalArtist;
  let artistList = [];
  let artistString = "";
  let songName;
  let imageURL;
  var width,
    height,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    songX,
    songY,
    songFont,
    songNameX,
    songNameY,
    songArtistX,
    songArtistY,
    songArtistFont,
    bottomTextX,
    bottomTextY,
    bottomTextFont,
    dmX,
    dmY,
    dmW,
    dmH;
  const text = "SONG";
  const bottomText = "LISTEN ON";

  if (orientation === "landscape") {
    width = 1200;
    height = 630;
    imageX = 105;
    imageY = 115;
    imageWidth = 400;
    imageHeight = 400;
    songX = 560;
    songY = 200;
    songNameX = 560;
    songNameY = 250;
    songFont = "bold 100px";
    songFontMax = "100";
    songFontMin = "70";
    songArtistX = 560;
    songArtistY = 380;
    songArtistFont = "bold 40px";
    songArtistFontMax = "40";
    songArtistFontMin = "30";
    bottomTextX = 805;
    bottomTextY = 542;
    bottomTextFont = "20px";
    dmX = 960;
    dmY = 520;
    dmW = 199.64;
    dmH = 60;
  } else if (orientation === "square") {
    width = 1080;
    height = 1080;
    imageX = 0;
    imageY = 330;
    imageWidth = 750;
    imageHeight = 750;
    songNameX = 70;
    songNameY = 50;
    songFont = "50px";
    songArtistX = 70;
    songArtistY = 160;
    songArtistFont = "68px";
    bottomTextX = 815;
    bottomTextY = 850;
    bottomTextFont = "30px";
    dmX = 795;
    dmY = 920;
    dmW = 250;
    dmH = 75;
  } else if (orientation === "portrait") {
    width = 1080;
    height = 1920;
    imageX = 146;
    imageY = 240;
    imageWidth = 788;
    imageHeight = 788;
    songX = 115;
    songY = 1127;
    songNameX = 115;
    songNameY = 1215;
    songFont = "bold 150px";
    songFontMax = "150";
    songFontMin = "130";
    songArtistX = 115;
    songArtistY = 1390;
    songArtistFont = "bold 60px";
    songArtistFontMax = "60";
    songArtistFontMin = "40";
    bottomTextX = 475;
    bottomTextY = 1800;
    bottomTextFont = "40px";
    dmX = 770;
    dmY = 1780;
    dmW = 266.19;
    dmH = 80;
  }

  var data;
  try {
    data = await spotifyApi.getTrack(id, { market: "US", limit: 1, offset: 5 });
  } catch (e) {
    res.send("Invalid ID");
    return false;
  }

  // Track Name
  songName = data.body.name;

  // Image URL 640x640
  imageURL = data.body.album.images[0].url;

  // Artist List
  totalArtist = data.body.album.artists.length;

  for (let i = 0; i < totalArtist; i++) {
    artistList[i] = data.body.album.artists[i].name;
  }

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");
  const image = await loadImage(imageURL);
  const avcolor = await getAverageColor(image);
  if (!colorGiven) {
    color = avcolor;
  }
  context.fillStyle = color;
  context.fillRect(0, 0, width, height);

  context.textBaseline = "top";

  let fontColor = getFontColor(color, avcolor);
  context.fillStyle = fontColor;
  if (orientation === "landscape") {
    context.font = "bold 22px GothamBlack";
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  } else if (orientation == "portrait") {
    context.font = "bold 40px GothamBlack";
    var ctext = text.split("").join(String.fromCharCode(8202));
    context.fillText(ctext, songX, songY);
  }
  if (orientation === "landscape") {
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      580,
      context,
      songNameX,
      songNameY,
      "bold ",
      "px GothamBold"
    );
  } else if (orientation === "portrait") {
    songArtistY += textWrap(
      songName,
      songFontMax,
      songFontMin,
      850,
      context,
      songNameX,
      songNameY,
      "bold ",
      "px GothamBold"
    );
  } else {
    context.font = `${songFont} GothamBold`;
    context.fillText(songName, songNameX, songNameY);
  }

  artistString = artistList.join(", ");
  if (orientation === "landscape") {
    let downShift = textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook"
    );
    bottomTextY += downShift;
    dmY += downShift;
  } else if (orientation === "portrait") {
    textWrap(
      artistString,
      songArtistFontMax,
      songArtistFontMin,
      500,
      context,
      songArtistX,
      songArtistY,
      "bold ",
      "px GothamBook"
    );
  } else {
    context.font = `${songArtistFont} GothamBook`;
    context.fillText(artistString, songArtistX, songArtistY);
  }

  new_svg_text = svg_text.replace("#fff", fontColor);
  fs.writeFile(
    path.resolve(__dirname, "logo/Spotify_logo_with_text.svg"),
    new_svg_text,
    function (err) {
      if (err) {
        return console.log(err);
      }
      context.font = `${bottomTextFont} GothamBold`;
      var cbottomText = bottomText.split("").join(String.fromCharCode(8202));
      context.fillText(cbottomText, bottomTextX, bottomTextY);
      loadImage("./logo/Spotify_logo_with_text.svg").then((image) => {
        context.drawImage(image, dmX, dmY, dmW, dmH);
        loadImage(imageURL).then((image) => {
          context.drawImage(image, imageX, imageY, imageWidth, imageHeight);
          const buffer = canvas.toBuffer("image/png");
          const cardURL = buffer.toString("base64");
          const img = Buffer.from(cardURL, "base64");
          res.writeHead(200, {
            "Content-Type": "image/png",
            "Content-Length": img.length,
          });
          res.end(img);
        });
      });
    }
  );
}

function textWrap(text, max, min, maxWidth, ctx, x, y, fontPre, fontPost) {
  let currentFontSize;
  for (
    currentFontSize = parseInt(max);
    currentFontSize >= parseInt(min);
    currentFontSize--
  ) {
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

    for (
      currentFontSize = parseInt(max);
      currentFontSize >= parseInt(min);
      currentFontSize--
    ) {
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
      if (tobreak) {
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
            let currentLineWidth = ctx.measureText(
              secondLine + " " + word
            ).width;
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

      for (
        currentFontSize = parseInt(max);
        currentFontSize >= parseInt(min);
        currentFontSize--
      ) {
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
        if (tobreak) {
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
app.get("/", (req, res) => {
  // Currently Only Song Name
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/docs-page.html", (req, res) => {
  // Currently Only Song Name
  res.sendFile(path.join(__dirname, "public/docs-page.html"));
});

// API
app.get("/api", (req, res) => {
  let imageColor;
  let colorGiven = req.query.color != null;
  let songName = req.query.name;
  let songID = req.query.id;
  let orientation = req.query.orientation;
  if (req.query.color != null) {
    imageColor = "#" + req.query.color;
  }
  if (
    orientation === null ||
    !["landscape", "square", "portrait"].includes(orientation)
  ) {
    orientation = "landscape";
  }
  if (colorGiven && !isHexCode(req.query.color)) {
    res.send("given hex is not valid, make sure not to add # at start");
  } else if (songName != null && songID == null) {
    searchTracksbyName(songName, imageColor, orientation, res, colorGiven);
  } else if (songID != null && songName == null) {
    searchTracksbyID(songID, imageColor, orientation, res, colorGiven);
  } else {
    res.send("name or id not provided or both provided instead of one");
  }
});

// Running Server
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
isHexCode = function (hex) {
  allowedChars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
  ];
  if (hex.length != 3 && hex.length != 6) {
    return false;
  }
  for (let i = 0; i < hex.length; i++) {
    if (!allowedChars.includes(hex[i])) {
      return false;
    }
  }
  return true;
};

function getFontColor(bgcolor, averagecolor) {
  // checking if white works
  e = deltaE(hexToRgb(bgcolor), hexToRgb("FFFFFF"));
  if (e < 10) {
    // checking if average color works
    e = deltaE(hexToRgb(bgcolor), hexToRgb(averagecolor));
    if (e < 10) {
      return "#000000";
    } else {
      return averagecolor;
    }
  } else {
    return "#FFFFFF";
  }
}

function deltaE(rgbA, rgbB) {
  let labA = rgb2lab(rgbA);
  let labB = rgb2lab(rgbB);
  let deltaL = labA[0] - labB[0];
  let deltaA = labA[1] - labB[1];
  let deltaB = labA[2] - labB[2];
  let c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  let c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  let deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  let sc = 1.0 + 0.045 * c1;
  let sh = 1.0 + 0.015 * c1;
  let deltaLKlsl = deltaL / 1.0;
  let deltaCkcsc = deltaC / sc;
  let deltaHkhsh = deltaH / sh;
  let i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}

function rgb2lab(rgb) {
  let r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x,
    y,
    z;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}
