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
    console.log("ping start");
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


/********************************************************************************************************************/

// // netping methods not currently working
// function netpingIp(req, res, ip, protocol) {
//     console.log("netping start");
//     var protocolVersion = null;
//     var error = null;
//     try {
//         if (protocol == '4') {
//             protocolVersion = netping.NetworkProtocol.IPv4;
//         } else if (protocol == '6') {
//             protocolVersion = netping.NetworkProtocol.Ipv6;
//         } else {
//             errorMessage = "Invalid protocol version " + protocol;
//             console.log(errorMessage);
//             throw errorMessage;
//         }
//         console.log("netping protocol determined");
//         var session = netping.createSession( {
//             networkProtocol: protocolVersion,
//             packetSize: 16, // ICMP packet size in bytes 12 minimum, 16 default
//             retries: 1,
//             sessionId: (process.pid % 65535),
//             timeout: 1000,
//             ttl: 128
//         });
//         runNetping(req, res, responses, errors, desired_response_count, session, target);
//         console.log("netping running");
//     }
//     catch (error) {
//         console.log(error);
//     }
//     return {'latencies': [1, 1, 2, 3, 5, 8, 13, 21, 34, 55], 'protocolVersion': protocolVersion, 'error': error};
// }
//
// function processNetping(req, res, responses, errors, desired_response_count, session, error, target, sent, rcvd) {
//     console.log("process ping " + sent + " - " + rcvd);
//     var duration = rcvd - sent;
//     if (error != null) {
//         console.log("Error from " + target + " : " + error);
//         errors.push(duration);
//     } else {
//         responses.push(duration);
//     }
//     runNetping(req, res, responses, errors, desired_response_count, session, target);
//     console.log("pp running ping.  result was " + duration);
// }
//
// function runNetping(req, res, responses, errors, desired_response_count, session, target) {
//     console.log("runping");
//     if ((responses.len() + errors.len()) < desired_response_count) {
//         session.pingHost(target, function(error, target, sent, rcvd) {
//             processNetping(req, res, responses, desired_response_count, session, error, target, sent, rcvd);
//         })
//     } else {
//         res.send({'responses': responses, 'errors': errors, 'target': target});
//     }
// }

module.exports = {
    pingIp: pingIp,
    // netpingIp: netpingIp
};
