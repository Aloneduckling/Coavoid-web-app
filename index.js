// Dependencies
const express = require("express");
const ejsMate = require("ejs-mate");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const https = require("https");

//configure
require("dotenv").config();
const mapBoxToken = process.env.MAPBOX_TOKEN;
const bestAppKey = process.env.BEST_APP_KEY;

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const app = express();

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const axiosInstance = axios.create({
  //60 sec timeout
  timeout: 60000,

  //keepAlive pools and reuses TCP connections, so it's faster
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  //follow up to 10 HTTP 3xx redirects
  maxRedirects: 10,

  //cap the maximum content length we'll accept to 50MBs, just in case
  maxContentLength: 50 * 1000 * 1000,
});
//===========================
//middleware
async function fetchData(req, res, next) {
  //this is a middleware function which will fetch the data from the API
  const { venue_name, venue_address } = req.body.search;

  const params = new URLSearchParams({
    api_key_private: `${bestAppKey}`,
    venue_name,
    venue_address,
  });

  const geoData = await geocoder
    .forwardGeocode({
      query: venue_name + venue_address,
      limit: 1,
    })
    .send();
  res.locals.geometry = geoData.body.features[0].geometry;

  await axiosInstance
    .post(`https://besttime.app/api/v1/forecasts?${params}`)
    .then((data) => {
      if (data.data.status === "error") {
        error = data.data.message;
      } else {
        res.locals.placeData = {
          venue_name,
          venue_address,
          traffic: data.data,
        };
      }
    })
    .catch((e) => console.log(e));  

  return next();
}
/*
Some Other things about this web app:

1.This app can accomodate more features like hourly crowd data 
using ineractive graphs and charts.

2. Show live crowd data.
*/

//===========================
//routes
app.get("/", (req, res) => {
  res.redirect("/place");
});

app.get("/place", (req, res) => {
  res.render("index");
});

app.post("/place", fetchData, (req, res) => {
  res.render("results");
});

app.get("*", (req, res) => {
  res
    .status(404)
    .send('<h1 style="text-align: center;">404 Page not found</h1>');
});

//error handling middleware
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  const message =
    "Error forecasting this venue. Address not precise enough. Or the venue is found, but there is not enough data to forecast this venue.";
  res.status(status).render("error", { message });
});

//listener
app.listen(3000, () => console.log("listening on port 3000"));
