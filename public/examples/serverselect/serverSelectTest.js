/*
 * *
 *  Copyright 2014 Comcast Cable Communications Management, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 * /
 */

(function () {
    'use strict';

    //setting the initialization method for latency test suite
    var oldOnload = window.onload;
    window.onload = function () {
        void (oldOnload instanceof Function && oldOnload());
        //init for test
        initTest();
    };

    //test button node will be made available through this variable
    var testButton;
    //private object to track event calls and results
    var auditTrail;
    //reference to event audit trail parent dom el
    var eventsEl;
    //test protocols
    var testProtocols;
    //reference to input elements allowing users to choose IP version for test
    var testVersions;
    //get the base url and server information from local node server to be used to run tests
    var testPlan;
    //array used to setup up ordering for test execution based on IP version
    var testRunner = [];
    //the type of test. options are upload, latency, latency
    var testType = 'latency';
    //event binding method for buttons
    function addEvent(el, ev, fn) {
        void (el.addEventListener && el.addEventListener(ev, fn, false));
        void (el.attachEvent && el.attachEvent('on' + ev, fn));
        void (!(el.addEventListener || el.attachEvent) && function (el, ev) { el['on' + ev] = fn } (el, ev));
    }

    //callback for xmlHttp complete event
    function auditTrailLogger(actionName, subActionName, results) {
        //store call in event audit trail
        auditTrail.push({ event: [actionName, ' - ', subActionName].join(''), results: results });
        // //update field value
        // console.log(testName);
        // console.log(results);
        // if (testName === 'onComplete') {
        //     //display to end user
        //     document.querySelector('#test').value = "hi";
        // }
        //update the audit trail on screen
        displayAuditTrail();
    };

    function onComplete(testProtocol, version, results) {
        genericEventHandler.call(undefined, 'onComplete', testProtocol, version, results);
    }

    //callback for xmlHttp error event
    function onError(testProtocol, version, results) {
        genericEventHandler.call(undefined, 'onError', testProtocol, version, results);
    }

    //callback for xmlHttp abort event
    function onAbort(testProtocol, version, results) {
        genericEventHandler.call(undefined, 'onAbort', testProtocol, version, results);
    }

    //callback for xmlHttp timeout event
    function onTimeout(testProtocol, version, results) {
        genericEventHandler.call(undefined, 'onTimeout', testProtocol, version, results);
    }

    //callback for xmlHttp progress event
    function onProgress(testProtocol, version, results) {
        genericEventHandler.call(undefined, 'onProgress', testProtocol, version, results);
    }

    //displays event trail from start to completion and they api results at those different points
    //creates table for displaying event audit trail
    function displayAuditTrail() {
        var arr = [];
        eventsEl.innerHTML = '';
        if (auditTrail.length) {
            arr.push('<table><tr><th></th><th>Event</th><th>Results</th></tr>');
            for (var i = 0; i < auditTrail.length; i++) {
                void (auditTrail[i].event && arr.push(
                    ['<tr>',
                        '<td>' + (i + 1) + '</td>',
                        '<td>' + auditTrail[i].event + '</td>',
                        '<td class="results">' + JSON.stringify(auditTrail[i].results) + '</td>',
                        '</tr>'].join('')));
            }
            arr.push('</table>');
            eventsEl.innerHTML = arr.join('');
        }
    }

    // //basic click event binding
    // function clickEventHandler(e, version) {
    //     var checked = {};
    //     var testVersionChecked;
    //     var testProtocolChecked;
    //     //reset audit trail
    //     //reset audit trail list
    //     eventsEl.innerHTML = 'No Event Trail. <p>Click "Run Test" to begin</p>';
    //     for (var i = 0; i < testVersions.length; i++) {
    //         checked[testVersions[i].value] = testVersions[i].checked;
    //         if (testVersions[i].checked && !testVersionChecked) {
    //             testVersionChecked = true;
    //         }
    //     }
    //
    //     for (var i = 0, el; i < testProtocols.length; i++) {
    //         checked[testProtocols[i].value] = testProtocols[i].checked;
    //         if (testProtocols[i].checked && !testProtocolChecked) {
    //             testProtocolChecked = true;
    //         }
    //     }
    //
    //     // document.querySelector('input.http.IPv4').style.display = (checked['http'] && checked['IPv4']) ? 'block' : 'none';
    //     // document.querySelector('input.http.IPv4').value = '';
    //     // document.querySelector('label.http.IPv4').style.display = (checked['http'] && checked['IPv4']) ? 'block' : 'none';
    //     // document.querySelector('input.http.IPv6').style.display = (checked['http'] && checked['IPv6']) ? 'block' : 'none';
    //     // document.querySelector('input.http.IPv6').value = '';
    //     // document.querySelector('label.http.IPv6').style.display = (checked['http'] && checked['IPv6']) ? 'block' : 'none';
    //     // document.querySelector('input.webSocket.IPv4').style.display = (checked['webSocket'] && checked['IPv4']) ? 'block' : 'none';
    //     // document.querySelector('input.webSocket.IPv4').value = '';
    //     // document.querySelector('label.webSocket.IPv4').style.display = (checked['webSocket'] && checked['IPv4']) ? 'block' : 'none';
    //     // document.querySelector('input.webSocket.IPv6').style.display = (checked['webSocket'] && checked['IPv6']) ? 'block' : 'none';
    //     // document.querySelector('input.webSocket.IPv6').value = '';
    //     // document.querySelector('label.webSocket.IPv6').style.display = (checked['webSocket'] && checked['IPv6']) ? 'block' : 'none';
    //     // testButton.disabled = !(testVersionChecked && testProtocolChecked);
    // }

    var callback = function (func) {
        return function (event) {
            func.call(this, event);
        };
    };

    function getSortedKeys(dict) {
        // Create items array
        var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        });

        // Sort the array based on the second element
        items.sort(function(first, second) {
            return first[1] - second[1];
        });

        return items;
    };

    //load event callback
    function initTest() {
        auditTrail = [];
        testButton = document.querySelector('.action-start');
        eventsEl = document.querySelector('.bigevents');
        var candidateCran = null;
        var cranTimes = {};
        window.getServerList(auditTrailLogger, function (serverInfo) {
            console.log("server list: " + JSON.stringify(serverInfo['serverList']));
            var serverList = serverInfo['serverList'];
            // test each CRAN
            for (var key in serverList) {
                auditTrailLogger('initTest', 'testing CRAN', key);
                var cran = serverList[key];
                console.log(JSON.stringify(cran));

                var item = cran[Math.floor(Math.random()*cran.length)];
                auditTrailLogger('initTest', 'testing IP', item);
                window.requestServerPing(item, auditTrailLogger, function (serverLatency) {
                    console.log(JSON.stringify(serverLatency));
                    cranTimes[key] = serverLatency['time'];
                    auditTrailLogger('initTest', [key, '/', item, 'time'].join(' '), serverLatency['time']);
                })
            }

            auditTrailLogger('initTest', 'CRANSCAN done (unsorted)', cranTimes);
            var sortedCrans = getSortedKeys(cranTimes);
            auditTrailLogger('initTest', 'CRANSCAN done (sorted)', sortedCrans);

            candidateCran = sortedCrans[0];
            auditTrailLogger('initTest', 'selecting CRAN', candidateCran);
            var candidateList = serverList[candidateCran[0]];
            auditTrailLogger('initTest', 'deep dive', candidateList);

            var bestCranTimes = {};
            for (var i = 0; i < candidateList.length; i++) {
                window.requestServerPing(candidateList[i], auditTrailLogger, function (serverLatency) {
                    console.log(JSON.stringify(serverLatency));
                    bestCranTimes[candidateList[i]] = serverLatency['time'];
                    auditTrailLogger('initTest', [candidateCran[0], '/', candidateList[i], 'time'].join(' '), serverLatency['time']);
                })
            }

            auditTrailLogger('initTest', [candidateCran[0], 'CRANSCAN done (unsorted)'].join(' '), bestCranTimes);
            var sortedBestCranTimes = getSortedKeys(bestCranTimes);
            auditTrailLogger('initTest', [candidateCran[0], 'CRANSCAN done (sorted)'].join(' '), sortedBestCranTimes);

            auditTrailLogger('initTest', 'BEST CRAN', ['<b>', sortedBestCranTimes[0][0], '</b>'].join(''));
        });

    }

})();


