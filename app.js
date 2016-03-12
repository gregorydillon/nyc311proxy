var express = require('express');
var app = express();
var moment = require('moment');
var Mustache = require('mustache');
var request = require('request');

app.get('/:anything', function (req, res) {

  var sourceLimit = 1000000;
  //get the date from 90 days ago
  var ninety_days_ago = moment().subtract(90, 'days').format('YYYY-MM-DD')

  var sourceTemplate = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$LIMIT={{sourceLimit}}&$ORDER=created_date%20DESC&$WHERE=created_date>=%27{{ninety_days_ago}}%27';


    //build a SODA API call... eww
    var sourceURL = Mustache.render( sourceTemplate, { 
      sourceLimit: sourceLimit,
      ninety_days_ago: ninety_days_ago 
    });

    console.log(sourceURL);

    //GET the API call and pipe it to the response
    request.get(sourceURL).pipe(res);
});


var port = process.env.PORT || 3000;

var server = app.listen(port, function () {


  console.log('Example app listening on port  ',port);
});