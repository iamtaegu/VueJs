var http = require('http'); 
var https = require('https'); 
var express = require('express'); 
var app = express();
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var url = require('url');

/*
* SSL, 개인키 / 디지털 인증서
*/
var options = {
    key: fs.readFileSync('./fake-keys/key.pem'),

    cert: fs.readFileSync('./fake-keys/cert.pem')
};
/*
* 맥은 80, 443 로컬에서 사용중
*/
var portForHttp = 8080;
var portForHttps = 8081;

function onRequest(request, response){ 

    var _url = request.url;
    var pathData = url.parse(_url, true).path;

    response.writeHead(200,{"Content-Type":"text/html"}); 
    if(_url == '/' || _url == '/favicon.ico'){    
        fs.createReadStream("index.html").pipe(response); 
    } else {
        fs.createReadStream('.'+pathData).pipe(response); 
    }

}

http.createServer(onRequest).listen(portForHttp);
https.createServer(options, onRequest).listen(portForHttps);