var express = require('express')
  , moment = require('moment')
  , Mustache = require('mustache')
  , request = require('request')
  , split2 = require('split2')
  , through2 = require('through2')
  , moment = require('moment')
  ;

var app = express();


app.get('/:anything', function (req, res) {

  //SODA API defaults to 1000, set the limit higher than what we will need for 90 days
  var sourceLimit = 1000000;

  //get a date string for 90 days ago
  var ninety_days_ago = moment().subtract(90, 'days').format('YYYY-MM-DD')

  //SODA API Template
  //  var sourceTemplate = 'https://data.cityofnewyork.us/resource/fhrw-4uyv.csv?$LIMIT={{sourceLimit}}&$ORDER=created_date%20DESC&$WHERE=created_date>=%27{{ninety_days_ago}}%27';
  var sourceTemplate = 'https://data.sfgov.org/resource/p8zf-gnjt.csv?$LIMIT={{sourceLimit}}&$ORDER=created_date%20DESC&$WHERE=created_date>=%27{{ninety_days_ago}}%27';
  //build a SODA API call
  var sourceURL = Mustache.render( sourceTemplate, { 
    sourceLimit: sourceLimit,
    ninety_days_ago: ninety_days_ago 
  });

  //set Content-disposition header so that browsers will treat it as a download
  res.setHeader('Content-disposition', 'attachment; filename=data.csv');

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

//transform function, finds all timestamps and converts them to GMT
var transform = through2(function(chunk, encoding, cb) {
  chunk = chunk.toString();

  chunk = chunk.replace(/(\d{4}\-\d\d\-\d\d[tT][\d:\.]*)/g, function(match) {
    var newTime = shiftTime(match);
    return shiftTime(match);
  });

  //re-add the newline character
  chunk += '\n';

  cb(null, chunk);
})
  .on('error', function(err) {
  console.log(err, err.toString());
});

//shift time to GMT
function shiftTime(timestamp) {
  if(timestamp.length > 0 ) {
    timestamp = moment(timestamp).add(5,'hours').format('MM/DD/YYYY HH:mm:ss');
  }

  return timestamp;
}