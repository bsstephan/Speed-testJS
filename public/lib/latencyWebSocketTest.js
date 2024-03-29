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
  /**
   * Latency testing based on httpRequests
   **/
  function latencyWebSocketTest(url, type, size, iterations, timeout, callbackComplete, callbackProgress, callbackError) {
    this.url = url;
    this.type = type;
    this.size = size;
    this.iterations = iterations;
    this.timeout = timeout;
    this._test = null;
    this._testIndex = 0;
    this._results = [];
    this.clientCallbackComplete = callbackComplete;
    this.clientCallbackProgress = callbackProgress;
    this.clientCallbackError = callbackError;

  };

  /**
   * Execute the request
   */
  latencyWebSocketTest.prototype.start = function () {
    this._test = new window.webSocket(this.url, this.type, this.size, this.onTestComplete.bind(this),
        this.onTestError.bind(this));
    this._testIndex++;
    this._test.start();
  };
  /**
   * onError method
   * @return abort object
   */
  latencyWebSocketTest.prototype.onTestError = function (result) {
    this.clientCallbackError(result);
  };

  /**
   * onComplete method
   * @return array of latencies
   */
  latencyWebSocketTest.prototype.onTestComplete = function (result) {
    this._results.push(result);
    this.clientCallbackProgress(result);
    if (this._testIndex < this.iterations) {
      this.start();
    }
    else {
      this.clientCallbackComplete(this._results);
      this._test._handleOnClose();
    }
  };

  /**
   * init test suite
   */
  latencyWebSocketTest.prototype.initiateTest = function () {
    this._testIndex = 0;
    this._results.length = 0;
    this.start();
  };

  window.latencyWebSocketTest = latencyWebSocketTest;
})();
