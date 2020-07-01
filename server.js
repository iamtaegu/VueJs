var http = require('http'); 
var https = require('https'); 
var express = require('express'); 
var app = express(); //create express server
var routerHTMl = express.Router(); //make router 
var router = express.Router(); //make router 
var morgan = require('morgan'); //make log
var cookieParser = require('cookie-parser');

var fs = require('fs'); // 파일 읽기, 쓰기 등 을 할 수 있는 모듈
var url = require('url');
const { allowedNodeEnvironmentFlags } = require('process');
const { response } = require('express');

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

/* Application Server  
 
* Router 페이지 라우팅 모듈 분리 
* static 지정한 폴더에 있는 내용을 모두 웹 서버 루트에 올림 
* morgan 로그 출력 
* cookie-parser 쿠키 출력 
*/ 

// cookie-parser Start 
app.use(cookieParser());

app.get('/getCookie', function(request, response){
    response.send(request.cookies);
});

app.get('/setCookie', function(request, response){
    response.cookie('string', 'cookie');
    response.cookie('json', {
        name: 'cookie',
        property: 'pt'
    });

    response.redirect('/getCookie');
});
// cookie-parser End 

// morgan Start
app.use(morgan('combined'));
// morgan End 

// Static Start
app.use(express.static(__dirname+'/web_folder'));
// Static End 

// Router start 
routerHTMl.get('/:id', function(request, response){
    response.send('HTML ROUTER');
});

router.get('/:id', function(request, response){
    response.send('Basic ROUTER');
});

app.use('/html', routerHTMl);
app.use('/', router);
// Router end

//All Selector 
app.all('*', function (request, response){
    response.status(404).send('<h2>Not Found'+request.url+'</h2>');
});

//Start app server
app.listen(8888, function() {
    console.log("Application Running at port 8888");
})

/* Web Server 

*/ 
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

// web server 
http.createServer(onRequest).listen(portForHttp);
https.createServer(options, onRequest).listen(portForHttps);
  