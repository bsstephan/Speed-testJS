/*
 * *
 *  Copyright currently unclear so let's let TDS Legal weigh on this
 */
/**
 * Created by pc on 11/3/16.
 */

var netping = require ("net-ping");
var ping = require ("ping");

function pingIp(nodereq, noderes, ip, protocol) {
    // note - only ipv4 is supported for now
    console.log("ping start to " + ip + " on " + protocol);
    var error = null;
    try {
        ping.promise.probe(ip).then(
            function(pingres) {
                console.log(pingres);
                noderes.json({'time': pingres.time, 'approach': 'ping'});
            }
        );
        console.log("ping promised");
    }
    catch (error) {
        console.log(error);
    }
    return {'latencies': [1, 1, 2, 3, 5, 8, 13, 21, 34, 55], 'protocolVersion': protocol, 'error': error};
}



module.exports = {
    pingIp: pingIp
};
