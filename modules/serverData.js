/**
 * Provide data on the servers in our speedtest network. this is used
 * by clients as part of their choice in finding the appropriate server
 * to hit
 */

// TODO: make this a readable configuration
module.exports = {
    /**
     * server node data is broken up by CRAN. the client chooses servers
     * to find their latency
     */
    serverNodeData: {
        'meshNodes': {
            'NJ': ['69.241.70.138:8080',],
            'CA': ['69.241.74.66:8080',],
        }
    }
};
