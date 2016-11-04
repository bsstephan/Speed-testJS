
var geolib = require('geolib');

var servers = [
    {
        'IPv4Address': '1.2.3.4',
        'IPv6Address': '',
        'Fqdn': 'plainsboro-nj.example.com',
        'Latitude': '-74.591697',
        'Longitude': '40.333439'
    },
    {
        'IPv4Address': '5.6.7.8',
        'IPv6Address': '',
        'Fqdn': 'losangeles-ca.example.com',
        'Latitude': '-118.257128',
        'Longitude': '34.048238'
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

    return serversWithDistance.slice(0, numServers - 1)
}


module.exports = {
    getClosestServers: getClosestServers
};