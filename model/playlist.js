const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    owner: {type:String, required:true},
    name:{ type:String,required:true},
    songs:{type:Array}
},
{collection:'playlists'});

const model = mongoose.model('PlaylistSchema',PlaylistSchema);
module.exports = model;

