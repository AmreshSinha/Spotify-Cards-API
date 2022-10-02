<p align="center">
<img src="https://spotify-cards.x-axis.me/api?id=05iALOptaNoV3EmXnxz1IJ&color=A0C3D2" />
</p>

An unofficial open-source Spotify PromoCards API built to serve Song Cards. For more information on using this API, see <a href="https://spotify-cards.x-axis.me/">Docs</a>

# Table of contents

* [Usage](#usage)
* [Support](#support)
* [Release Versions](#release-versions)
* [Hosting your own](#host-your-own)
* [Run Locally](#run-locally)
* [Contributing](#contributing)
* [License](#license)

## Usage

### By Song Track Name*
*Results can differ as there can be another song with the Same Name
```
https://spotify-cards.x-axis.me/api?name={song name}&color={color hex without #}
```

**Example**
```
https://spotify-cards.x-axis.me/api?name=Silver%20Lining&color=A0C3D2
```

### By Song Track ID {Recommended}
```
https://spotify-cards.x-axis.me/api?id={song id}&color={color hex without #}
```

**Example**
```
https://spotify-cards.x-axis.me/api?id=05iALOptaNoV3EmXnxz1IJ&color=A0C3D2
```

### Orientation

**Landscape**{Default} or **Square**

**Example**
```
https://spotify-cards.x-axis.me/api?id={song id}&color={color hex without #}&orientation={landscape/square}
```

### How to get Spotify Song Track ID?

* Go to your song
* Right Click >> Share (Keep Ctrl Pressed) >> Copy Spotify URI
* The ID after ```spotify:``` is the Spotify Song Track ID


## Support

To log any issue or help in any issue, check out
[Issues Section](https://github.com/AmreshSinha/Spotify-Cards-API/issues).

## Release Versions

* **1.0.0**: Supports only Song Tracks. Can take input from user as name or id only currently.

## Host Your Own

See [HOSTING](https://github.com/AmreshSinha/Spotify-Cards-API/blob/master/HOSTING.md) for instructions on how to host your own service

## Run Locally

1. Clone the Repository
```
git clone https://github.com/AmreshSinha/Spotify-Cards-API.git
```
2. Get into project folder and install node modules
```
npm i
```
3. Go to Spotify Developer Dashboard and Create a New Application with no scopes
Make a .env and add
- `Client_ID` var with your Spotify Dev Application Details
- `Client_Secret` var with your Spotify Dev Application Details
4. Start and Run the Project
```
node index.js
```
Server will start on port 3000

## Contributing

### Help Needed

* Text Wrap: If the Song Name is too long then text size should decrease and wrap into 2 lines. Spacing between "SONG" and Song Name, and Song Name and Artist name should change accordingly.
* <strike>Theme Color Extraction from image instead of Black as Default Color.</strike> Done Thanks to <a href="https://github.com/delivey">@delivey</a>
* <strike>Adding Portrait Orientation.</strike> Done Thanks to <a href="https://github.com/delivey">@delivey</a>

All the Issues are in <a href="https://github.com/AmreshSinha/Spotify-Cards-API/issues">ISSUES</a> section.

Also, before making a PR checkout <a href="https://github.com/AmreshSinha/Spotify-Cards-API/blob/master/CODE_OF_CONDUCT.md">Code of Conduct</a>

## License

Spotify Cards API is available under the
[MIT license](https://opensource.org/licenses/MIT). Spotify Cards API also includes external libraries that are available under a variety of licenses. See [LICENSE](https://github.com/AmreshSinha/Spotify-Cards-API/blob/master/LICENSE) for the full license text.
