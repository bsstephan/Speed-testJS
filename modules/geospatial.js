
var geolib = require('geolib');

// This should be configurable
var servers = [
    {
        'IPv4Address': '69.241.70.138',
        'IPv6Address': '',
        'Fqdn': '127.0.0.1:8080',
        'Latitude': '40.333439',
        'Longitude': '-74.591697'
    },
    {
        'IPv4Address': '69.241.74.66',
        'IPv6Address': '',
        'Fqdn': '127.0.0.1:8080',
        'Latitude': '34.048238',
        'Longitude': '-118.257128'
    }
];

// Sort by Distance value
function sortServerDistance(a, b) {
    return a['Distance'] - b['Distance'];
}

function getClosestServers(latitude, longitude, numServers) {

    // clone server list
    var serversWithDistance = JSON.parse(JSON.stringify(servers));

    // loop through server list
    for (var i = 0; i < serversWithDistance.length; i++) {

        server = serversWithDistance[i];

        // determine distance in meters
        server['Distance'] = geolib.getDistance(
            {latitude: latitude, longitude: longitude},
            {latitude: server['Latitude'], longitude: server['Longitude']}
        );
    }

    // sort by distance
    serversWithDistance.sort(sortServerDistance);

    return serversWithDistance.slice(0, numServers)
}


module.exports = {
    getClosestServers: getClosestServers
};
