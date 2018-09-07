var express = require('express');
var https = require("https");
var http = require("http");
var request = require("request");
var fse = require("fs-extra");
var path = require('path');


var privateKey  = fse.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fse.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

// start express module
var app = express();

app.use(express.static(path.join(__dirname, 'public')));



// start the server
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.PORT || 3000, function () {
    var host = httpsServer.address().address;
    var port = httpsServer.address().port;

    console.log('WeedDJ started at https://%s:%s', host, port);
});




app.get('/getPurchases', function(req, res) {
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;
    res.setHeader('Content-Type', 'application/json');
    GetOrders(start_date, end_date, function(data) {
        res.send(data);
    }, function(error) {
        res.status(500);
        res.send(error);
    });
});
app.get('/getPurchase', function(req, res) {
    var barcode = req.query.barcode;
    res.setHeader('Content-Type', 'application/json');
    GetOrderByBarcode(barcode, function(data) {
        res.send(data);
    }, function(error) {
        res.status(500);
        res.send(error);
    });
});
app.get('/getPlaylist', function(req, res) {
    var search = req.query.search;
    console.log(search);
    res.setHeader('Content-Type', 'application/json');
    SearchLyrics(search, function(data) {
        res.send(data);
    }, function(error) {
        res.status(500);
        res.send(error);
    });
});

//'2018-04-01'
//'2018-04-30'



function GetOrders(start_date, end_date, success, fail) {
    var options = { method: 'GET',
      url: 'https://hack4.trellisgrows.ca/api/purchase_order/index',
      qs: 
       { first_result: '0',
         max_result: '10',
         start_created: start_date,
         end_created: end_date,
         authorized: '1' },
      headers: 
       { 'X-AUTH-TOKEN': '9339722150577933' } };
    
    request(options, function (error, response, body) {
      if (error) fail(error);
      else success(body);
    });    
}
function GetOrderByBarcode(barcode, success, fail) {
    var options = { method: 'GET',
      url: 'https://hack4.trellisgrows.ca/api/purchase_order/show/' + barcode,
      headers: 
       { 'X-AUTH-TOKEN': '9339722150577933' } };
    
    request(options, function (error, response, body) {
      if (error) fail(error);
      else success(body);
    });    
}
function SearchLyrics(searchStr, success, fail) {
    var options = { method: 'GET',
    url: 'https://api.lyricfind.com/search.do',
    qs: 
     { apikey: 'd8b0e7e093bcb8e55239de1336e15e58',
       territory: 'US',
       reqtype: 'default',
       searchtype: 'track',
       all: searchStr,
       output: 'json' },
       headers:  { }
     };
  
       request(options, function (error, response, body) {
        if (error) fail(error);
        else success(body);
      });   
}







/*
function GetOrder(barcode, success, fail) {
    var count = 0;
    var strain_names = [];
    GetOrderByBarcode(barcode, function(data) {
        var obj = JSON.parse(data);
        obj.purchaseOrderItems.map(function(item) {
            var id = item.id;
            var classification = item.classification;
            var strain = item.strain;
            var name = strain.title;
            strain_names.push(name);
        });
        if (++count == barcodes.length) {
            SearchLyricsH(strain_names, success, fail);
        }
    }, function(error) {
        fail(error);
    });
}
function SearchLyricsH(strain_names, success, fail) {
    console.log(strain_names);
    var count = 0;
    var playlist = [];
    strain_names.map(function(name) {
        SearchLyrics(name, function(data){
            var obj = JSON.parse(data);
            console.log('STRAIN', name, obj.tracks.length);
            for(var i=0; i<Math.min(2, obj.tracks.length); i++) {
                var track = obj.tracks[i];
                playlist.push(track);
            }
            if (++count == strain_names.length) {
                success(playlist);
            }
        }, function(error) {
            fail(error);
        });
    });
}
*/

/*
GetPlayList(function(data) {
    console.log(data.length);
}, function(error) {
    console.log(error);
});
*/