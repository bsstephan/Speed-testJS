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

(function() {
  'use strict';
  /**
  * extend webSocket
  * @param string method post or get request
  * @param stirng url address for request
  * @param integer timeout timeout for request
  * @param function callback for onloaded function
  * @param function callback for onprogress function
  */
  function webSocket(url, type, transferSize, callbackOnMessage, callbackOnError){
  this.url = url;
  this.type= type;
  this.transferSize = transferSize;
  this.callbackOnMessage = callbackOnMessage;
  this.callbackOnError = callbackOnError;
}

/**
 * Initiate the request
 */
webSocket.prototype.start = function(){
  if (this._request === null ||
     typeof this._request === 'undefined') {
     this._request = new WebSocket(this.url);
     this._request.onopen = this._handleOnOpen.bind(this);
     this._request.onmessage = this._handleOnMessage.bind(this);
     this._request.onclose = this._handleOnClose.bind(this);
     this._request.onerror = this._handleOnError.bind(this);
   }
};

webSocket.prototype._handleOnOpen = function(){
      var obj = { 'data': Date.now().toString(), 'flag': 'latency' };
      this._request.send(JSON.stringify(obj), { mask: true });
};

webSocket.prototype._handleOnMessage = function(event){
  var finaltime = Date.now() - parseInt(event.data);
  var result={};
  result.time = finaltime;
  result.unit = 'ms';
  this.callbackOnMessage(result);

};
webSocket.prototype._handleOnError = function(event){
  this.callbackOnMessage(event);
};

webSocket.prototype._handleOnClose = function(){

  this._request.close();
};


window.webSocket = webSocket;

  })();
