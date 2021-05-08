const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    title: {type:String, required:true},
    artist:{ type:String,required:true},
    videoId:{type:String,required:true,unique:true},
    duration:{type:Number,required:true}
},
{collection:'songs'});

const model = mongoose.model('SongSchema',SongSchema);
module.exports = model;

