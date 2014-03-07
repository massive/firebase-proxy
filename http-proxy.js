var https = require('https'),
    http  = require('http'),
    util  = require('util'),
    path  = require('path'),
    fs    = require('fs'),
    colors = require('colors'),
    url = require('url'),
    httpProxy = require('http-proxy'),
    dotenv = require('dotenv');

dotenv.load();

var proxy = httpProxy.createProxyServer({});
var host = process.env['FIREBASE_HOST'];

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var server = require('http').createServer(function(req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    var path = url.parse(req.url, true).path;

    req.headers.host = host;
    proxy.web(req, res, {
        target: "https://"+host+path,
        secure: true,
        agent  : https.globalAgent
    });

}).listen(8011);

proxy.on('proxyRes', function (res) {
    console.log('RAW Response from the target', JSON.stringify(res.headers, true, 2));
});


util.puts('Proxying '+ host +'. Server'.blue + ' started '.green.bold + 'on port '.blue + '8011'.yellow);
