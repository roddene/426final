const fetch = require('node-fetch');
var Buffer = require('buffer').Buffer;

module.exports = class SpotifyAPI{
    constructor(){
        this.token ='';
    }

getToken = async () =>{


    const clientId='88c4873926fe42f6ae40f7918df460c0';
    const clientSecret = 'a3930cbafb0f42bea770f94eefa644c3';

    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' +  Buffer.from(clientId + ':' + clientSecret).toString('base64')
        }, 
        body: 'grant_type=client_credentials'
    });

    const data = result.json();
    return data;
}
setToken = (token) =>{
    this.token = token;
}



searchSpotify = async (query) =>{
    
    console.log("thistoken",this.token);
    const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track&market=US&limit=5`, {
      method: 'GET',
      headers: { 'Authorization' : 'Bearer ' + this.token}
  });
    const data = await result.json()
    return data.tracks.items;
}
}
