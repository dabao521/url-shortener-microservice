
var urls = require("../models/urls.js");
var counts = require("../models/counts.js");

module.exports = function(app){
    app.get("/", function(req, res, next){
        return res.sendfile(process.cwd() + "/public" + "/index.html");
    });
    
    app.get("/new", function(req, res, next){
        return res.json({
            error: "please provide the url to be shortened."
        });
    });
    
    app.get("/new/:url*", function(req, res, next){
       // console.log(req.url);
        var inputurl = req.url.substring(5);
      //  console.log(inputurl);
        if(!validate(inputurl)) {
            return res.json({
                "error" : "Please provide valid url staring http or https"
            });
        }
        findUrl(inputurl, function(isThere, urldb){
          //  console.log(isThere);
            if(!isThere){
                var newurl = new urls();
                newurl.original_url = inputurl;
                counts.findOne({}, function(err, result){
                    if(err) {
                        throw err;
                    }
                    if(result){
                        counts.update({}, {$inc: {"count" : 1}}, function(err){
                            if(err) {
                                throw err;
                            }
                            newurl.short_url = process.env.APP_URL + "/" + result.count.toString();
                            newurl.save(function(err){
                                if(err) {
                                    throw err;
                                }
                                var rt = {
                                    "short_url" : newurl.short_url,
                                    "original_url" : newurl.original_url                                    
                                }
                                return res.json(rt);
                            });
                        });
                    }else {
                        counts.create({
                            "count" : 2
                        }, function(err){
                            if(err) {
                                throw err;
                            }
                            newurl.short_url = process.env.APP_URL + "/" + "1";
                            newurl.save(function(err){
                                if(err) {
                                    throw err;
                                }
                                var rt = {
                                    "short_url" : newurl.short_url,
                                    "original_url" : newurl.original_url,
                                }
                                return res.json(rt);
                            });                            
                            
                        });
                    }
                });
            }else {
                return res.json(urldb);
            }
        });
    });
    
    app.get("/\\S+", function(req, res, next){
        req.url = req.url.substring(1);
        if(/^\/new\//.test(req.url)) {
           // console.log("adfadf: " + req.url);
            return;
        }
        var shortUrl = process.env.APP_URL + "/" + req.url;
        //console.log("short url  = " + shortUrl);
        urls.findOne({"short_url" : shortUrl}, function(err, url){
            if(err) {
                throw err;
            }
            if(url) {
                return res.redirect(url.original_url);
            }else {
                return res.json({
                    error:  "this short url is not registered yet!"
                });
            }
        });
    });

    
    function validate(url) {
        return /^https?:\/\/w{3}\..*\.(?:com|net|org|gov)$/.test(url);
    }
    
    
    function findUrl(targetUrl, callback) {
        
        urls.findOne({"original_url" : targetUrl}, {"_id" : false, "__v" : false})
            .exec(function(err, url){
                if(err) {
                    throw err;
                }
            //    console.log(url);
                if(url) {
                    callback(true, url);
                }else {
                    callback(false, url);
                }
            });
    }
};