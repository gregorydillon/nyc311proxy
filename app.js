var express = require('express');
var app = express();
var moment = require('moment');
var Mustache = require('mustache');
var request = require('request');
var split2 = require('split2');
var stream = require('stream');
var through2 = require('through2');
var moment = require('moment');


var modifyDates = new stream.Transform();

var transform = through2(function(chunk, encoding, cb) {
  chunk = chunk.toString();

  chunk = chunk.replace(/(\d{4}\-\d\d\-\d\d[tT][\d:\.]*)/g, function(match) {
    console.log(match);
    var newTime = shiftTime(match);
    console.log(newTime);
    return shiftTime(match);
  });

  cb(null, chunk);
})

.on('error', function(err) {
  console.log(err, err.toString());
});



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
    request.get(sourceURL)
      .on('end', function() {
        res.end();
      })
      .pipe(split2(), { end: false })
      .pipe(transform)
      .pipe(res);
});


var port = process.env.PORT || 3000;

var server = app.listen(port, function () {


  console.log('Example app listening on port  ',port);
});


//shift time to GMT
function shiftTime(timestamp) {
  if(timestamp.length > 0 ) {
    timestamp = moment(timestamp).add(5,'hours').format('MM/DD/YYYY hh:mm:ss A');
  }

  return timestamp;
}