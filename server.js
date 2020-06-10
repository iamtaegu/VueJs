var http = require('http'); 
var https = require('https'); 
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var url = require('url');

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

http.createServer(onRequest).listen(8080);