const express = require('express');
const path = require('path');
//const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const User = require('./model/user');
const Playlist = require('./model/playlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const youtube = require('scrape-youtube').default
const Song = require('./model/song')

const spotifyAPI = require('./spotyifyapi');

const JWTSECRET = '5n=bq5435n7N$^9bN70GJ-EA04Q)jgr(JOPJTP3-(&^(*%0&nb^(&409nbn^&$b)(#^)';


/*
console.log("handllee");
youtube.search('Short Change Hero').then(results => {
    // Unless you specify a type, it will only return 'video' results
    console.log(results.videos); 
});
*/

const s = new spotifyAPI();






mongoose.connect('mongodb://localhost:27017/final_users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('Database connected')).catch(e => console.log(e));

var app = express();
app.use('/', express.static(path.join(__dirname, 'build')));
app.use(express.json());


app.post('/api/home', async (req, res) => {
    console.log("setting stoken");
    const spotifytoken = await s.getToken();
    s.setToken(spotifytoken.access_token)

    const { token } = req.body;

    try {
        const user = jwt.verify(token, JWTSECRET);
        //const user = await User.findOne({username}).lean();

        res.json({ status: 'ok', data: user });
    } catch (e) {
        res.json({ status: 'error', error: "invalid request" });
    }


})


app.post('/api/createPlaylist', async (req, res) => {
    console.log("creating",req.body);

    const { token, username, newplay } = req.body;
    try {
        const user = jwt.verify(token, JWTSECRET);
        const response = await Playlist.create({ owner: username, name: newplay })
        res.json({ status: 'ok' });
    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})


app.post('/api/spotifySearch', async (req, res) => {
    const { token, query } = req.body
    if (!query) {
        return res.json({ status: 'error', error: "empty search" });
    }
    try {
        const user = jwt.verify(token, JWTSECRET);
        const result = await s.searchSpotify(query);
        let resultarray = [];
        result.forEach((el) => {
            resultarray.push({
                artistName: el.artists[0].name,
                songName: el.name
            })
        })
        res.json(resultarray);

    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})

app.post('/api/youtubeSearch', async (req, res) => {
    const { token, query} = req.body
    if (!query) {
        return res.json({ status: 'error', error: "empty search" });
    }
    try {
        const user = jwt.verify(token, JWTSECRET);
        const result = await youtube.search(query +'audio')/*.then((res) => {
            res.videos[0].id,
            res.videos[0].duration
          });*/
          console.log("result from youtube",{
              videoId:result.videos[0].id,
              duration:result.videos[0].duration
          });
        res.json({
            videoId:result.videos[0].id,
            duration:result.videos[0].duration
        });

    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})

app.post('/api/getPlaylists', async (req, res) => {

    const { token, username } = req.body;
    try {
        const user = jwt.verify(token, JWTSECRET);
        const response = await Playlist.find({ owner: username })
        //console.log(response);
        res.json(response);
    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }

})

app.post('/api/selectPlaylist', async (req, res) => {
    console.log("select it");
    const { token, id } = req.body;
    try {
        const user = jwt.verify(token, JWTSECRET);
        const response = await Playlist.findOne({ _id: id })
        console.log(response.songs);
        
        let songData = []
        const songs = await Song.find({_id:{$in:response.songs}})
        songs.forEach((song)=>{
        songData.push({
                songName:song.title,
                artist:song.artist,
                id:song.videoId,
                duration:song.duration
        })});
       
        console.log(songData);
        res.json(songData);
    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})

app.post('/api/deletePlaylist', async (req, res) => {
    console.log("delete it");
    const { token, id } = req.body;
    try {
        const user = jwt.verify(token, JWTSECRET);
        const response = await Playlist.deleteOne({ _id: id })
        return res.json({status:'ok'});
    } catch (e) {
        console.log(e);
        return res.json({ status: 'error', error: "invalid request" });
    }
})

app.post('/api/deleteSong', async (req, res) => {
    console.log("deleting",req.body);
    const { token, playlistId,videoId } = req.body;
    try {
        const user = jwt.verify(token, JWTSECRET);
        const song = await Song.findOne({ videoId: videoId })
        const playlist = await Playlist.findOne({_id:playlistId})
        let arr = playlist.songs;
        let index = arr.indexOf(song._id);
        if(index !== -1){
            arr.splice(index,1);
        }
        await Playlist.updateOne({ _id: playlistId }, { $set: { songs: arr } });
        return res.json({status:'ok'});
    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})

app.post('/api/addSong', async (req, res) => {
    const { token, songName, artist, duration, videoId, playlistId } = req.body;
    console.log("songname",songName);
    console.log("artist",artist);
    console.log("duration",duration);
    console.log("videoid",videoId);
    console.log("playlistid",playlistId);
    
    try {
        const user = jwt.verify(token, JWTSECRET);
        const response = await Song.findOne({ videoId })
        console.log(response);
        let songIds = await Playlist.findOne({ _id: playlistId }).then((val) => val.songs);
        if (response == null) {
            const addedSong = await Song.create({ title: songName, artist: artist, videoId: videoId, duration: duration })
            console.log("added song to songbase");

            if (!songIds.includes(addedSong._id)) {
                songIds.push(addedSong._id);
                await Playlist.updateOne({ _id: playlistId }, { $set: { songs: songIds } });
            } else {
                console.log("song in playlist already");
            }

            res.json(addedSong);
        } else {
            console.log("already added to list of songs");

            if (!songIds.includes(response._id)) {
                songIds.push(response._id);
                await Playlist.updateOne({ _id: playlistId }, { $set: { songs: songIds } });
            } else {
                console.log("song in playlist already");
            }
            res.json(response);
        }

    } catch (e) {
        console.log(e);
        res.json({ status: 'error', error: "invalid request" });
    }
})



app.post('/api/register', async (req, res) => {

    const { username, password: unhashedPassword } = req.body;

    if (unhashedPassword.length < 7) {
        return res.json({ status: 'error', error: 'password too short' });
    }

    const password = await bcrypt.hash(unhashedPassword, 5)



    try {
        const response = await User.create({
            username, password
        });
        console.log("user created", response)
    } catch (e) {
        console.log(e);
        if (e.code == 11000) {
            return res.json({ status: 'error', error: 'username already used' });
        }
        throw error;
    }


    res.json({ status: 'ok' });
})


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    if (!user) {
        return res.json({ status: 'error', error: 'Invalid username/password' });
    }

    if (await bcrypt.compare(password, user.password)) {

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username
            },
            JWTSECRET)

        return res.json({ status: 'ok', data: token });
    }

    res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/changepassword', async (req, res) => {
    const { token, newPassword: plainTextPassword } = req.body;


    if (!plainTextPassword || typeof plainTextPassword != 'string' || plainTextPassword.length < 7) {
        return res.json({ status: 'error', error: 'Invalid password' });
    }
    console.log(jwt.verify(token, JWTSECRET));
    try {
        const user = jwt.verify(token, JWTSECRET);
        const _id = user.id;
        console.log(user.id);
        const password = await bcrypt.hash(plainTextPassword, 5);
        await User.updateOne(
            { _id }, {
            $set: { password }
        }
        )
        console.log('decoded', user);
        res.json({ status: 'ok' });
    } catch (e) {
        res.json({ status: 'error', error: "invalid request" });
    }
})


app.listen(3000, () => {
    console.log("server to 3000");
})


