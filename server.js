var express= require("express"),
    dotenv = require("dotenv"),
    path = require("path"),
    mongoose = require("mongoose"),
    routes = require(process.cwd() + "/app/routes/index.js");
    
var app = express();

dotenv.load();
// db connection 
var db = mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/urlShort");

//middlewares 
app.use("/public", express.static(path.join(process.cwd(), "public")));

app.use("/controllers", express.static(path.join(process.cwd(), "app", "controllers")));

//routes

routes(app);

//server listening

app.listen(process.env.PORT || 8080, function(){
    console.log("express server is listening on port " + process.env.PORT || 8080);
});
