# Coavoid-web-app
## _Avoid the crowd whenever possible_


Coavoid web app is a tool which enables the user to get informed about the amount crowd at a place beforehand. This project currently have:

- Daily crowd forcast for a place
- Forcast shows quiet and busy hours at a place

## Get Started

- Fork and clone the repo and cd into the project directory
- run `npm install` to install the dependencies
- Obtain the API keys (mapbox)[https://www.mapbox.com/] and (best time app)[https://besttime.app/app]. Make sure to use best time app private API key
- create .env file in the root directory and add the folling code

```
MAPBOX_TOKEN=<your map box token here>
BEST_APP_KEY=<your best app private api key here>
```
- in the terminal run `npm start` to start the server
- go to `localhost:3000` in your browser

## Directions 

- in the name input field in the home page enter the name of the venue
- in the address enter the complete address
- hit search

## Dependencies
```
    "@mapbox/mapbox-sdk": "^0.12.1",
    "axios": "^0.21.1",
    "cors": "^2.8.5",
    "dotenv": "^9.0.0",
    "ejs": "^3.1.6",
    "ejs-mate": "^3.0.0",
    "express": "^4.17.1"
```

## Other Info
This web app uses:
- (mapbox)[https://www.mapbox.com/] for maps
- (best time app)[https://besttime.app/app] for crowd/traffic data
- (bootstrap)[https://getbootstrap.com/] for styling
