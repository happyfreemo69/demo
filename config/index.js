'use strict';

var pathModule = require('path');
var Logger = require('nodelibs').Logger;
/**
 * override this config in privateConfig.js for ... private details
 */
exports = module.exports;
exports.http = false;
exports.port = 4004;
exports.https = true;
exports.httpsPort = 4009;
exports.debug = true;
exports.phase = 'dev';
exports.mode = 'dev';
exports.host = "http://127.0.0.1:"+exports.port;
exports.hostname = require('os').hostname();
exports.synty_url = 'https://synty-api-dev.citylity.com';
exports.asset_url = 'http://127.0.0.1:3002';
exports.hot = {};
exports.hot.compression_enable = true;
exports.hot.logLvl = 0;
exports.hot.logToConsole = false;
exports.hot.logMaxFileSize = 5000000;
exports.hot.logLineMaxSize =  exports.mode == 'prod'?4096:4000000;
exports.hot.reqToStdout =  false;
exports.hot.winston_enable = false;

var res = require('fs').existsSync(__dirname+'/privateConfig.js') && require('./privateConfig.js');
for(var i in res){
    exports[i] = res[i];
}

exports.hot.winston_slackPptDownMessage = exports.phase+' - '+exports.hot.winston_hostname+':papertrails is down (%date%)';
exports.logger = new Logger({path: __dirname+'/../log/'}, exports.hot);