const Promise = require('bluebird');
const rp = require('request-promise');
const fs = Promise.promisifyAll(require('fs'));

module.exports = function() {
  return fs.readFileAsync('animalsUpdater.json')
    .then(function(fileContents){
      return fetchRedditData(fileContents);
    });
};

function fetchRedditData(fileContents) {
  let promises = [];
  const parsed = JSON.parse(fileContents);

  for(let i = 0; i < parsed.length; i++) {
    promises.push(rp(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${parsed[i].latlong}&sensor=true`));
  }

  return Promise.map(promises, function(res, index) {
    return {
      googleApi: res,
      animal: parsed[index],
    };
  }, {concurrency: 1});
}