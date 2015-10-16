var express = require('express');
var app = express();
var moment = require('moment');
var Mustache = require('mustache');
var request = require('request');

app.get('/', function (req, res) {

  //get the date from 30 days ago
  var thirtydaysago = moment().subtract(30, 'days').format('YYYY-MM-DD')

    //build a SODA API call... eww
    var apiCall = Mustache.render("https://data.cityofnewyork.us/resource/fhrw-4uyv.geojson?$where=created_date>='{{date}}'&$limit=500000",{date:thirtydaysago});

    //GET the API call and pipe it to the response
    request.get(apiCall).pipe(res);
});


var port = process.env.PORT || 3000;

var server = app.listen(port, function () {


  console.log('Example app listening on port  ',port);
});