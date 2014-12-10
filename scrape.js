"use strict";
var fs = require('fs'),
  injects = ['eval.js', 'lib/moment.min.js', 'lib/URI.js', 'lib/Autolinker.js'];
var moment = require('lib/moment.min.js');
var path = require('lib/path.js');
//env?sys?

console.log('Starting task on ' + moment().format('MMMM Do YYYY, h:mm:ss a'));

var senateScraper = {
  dataPath: '/var/www/html/hearings/data/',
  hearingPath: '/var/www/html/hearings',
  getVidUrl: 'http://metaviddemo01.ucsc.edu/asdf/getvid.php',
  pdfurl: 'http://localhost/hearingHandler/pdf.php'

};

phantom.injectJs('hearings.js');



var intel = new Committee({
  committee: "Intelligence",
  chamber: "senate",
  url: "http://www.intelligence.senate.gov",
  sessions: [110, 111, 112, 113]
});

console.log("Scraping Sessions!");
intel.scrapeSessions().then(function (result) {
  console.log("what hey?");

  console.log("Processing Hearings!");
  return intel.processHearings();
}).then(function (result) {
  for (var hearing of intel.hearings) {
    //process links found on hearing pages
    hearing.scrapeLinks();
  }
}).then(function (result) {
  for (var hearing of intel.hearings) {
    //get more links and process witnesses
    hearing.scrapeWitnesses();
  }
}).then(function (result) {
  for (var hearing of intel.hearings) {
    //another link processing pass with the new ones
    hearing.scrapeLinks();
  }
}).then(function (result) {
  for (var hearing of intel.hearings) {
    //and another witness check based on the new links
    hearing.scrapeWitnesses();
  }
}).then(function (result) {
  for (var hearing of intel.hearings) {
    //fix media links
    hearing.sanitizeMedia();
  }
  //write JSON
  intel.fileify();
  intel.report();


  phantom.exit();
});
//intel.getVideosFromJSON();
//intel.processWitnesses();
//intel.scrapeHDS();
//hearing.getPdfs();