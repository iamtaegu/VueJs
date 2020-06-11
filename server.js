var http = require('http'); 
var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈


function onRequest(request, response){ 

    if(request.method == 'GET' && request.url == '/'){ 
        response.writeHead(200,{"Content-Type":"text/html"}); 
        fs.createReadStream("./countup.html").pipe(response); 
    } 
}

http.createServer(onRequest).listen(8080);