var mongoose  = require("mongoose");

var Schema = mongoose.Schema;

var countSchema = new Schema({
    "count" : Number
});

module.exports = mongoose.model("Count", countSchema);