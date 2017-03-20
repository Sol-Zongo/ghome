var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ghome');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Succesfull connect to mongo db - ghome');
});

module.exports = mongoose;