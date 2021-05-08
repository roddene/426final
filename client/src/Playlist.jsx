import React from 'react';
import Song from './Song';


class Playlist extends React.Component {
  constructor(props){
    super(props); 
    this.state = {
    name:props.name,
    owner:props.owner,
    songs:props.songs,
    songCount:props.songs.length

    
  }
  
  this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);
  this.deleteSong = this.deleteSong.bind(this);
}

componentWillReceiveProps(nextProps) {
  this.setState({ songs:nextProps.songs,
    songCount:nextProps.songs.length
  })
}

  
 playSong = (id,name,artist,duration) => {
  this.props.playSongHandler(id,name,artist,duration);
 }


  async deleteSong (songId,playlistId) {
    try{
      const result = await fetch('/api/deleteSong',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token:localStorage.getItem('token'),
            videoId:songId,
            playlistId,playlistId
        })
       
    }).then((res)=>res.json())
    } catch(e){
      console.log(e);
    }
    let filtered = this.state.songs.filter(function(item){
      return item.id !=songId
    })
    const count = filtered.length;
    this.setState((state)=>({
      songs:filtered,
      songCount:count
    }))
  }

  

  render(){
  return (
    <div className="playlist">
      <h2>{this.state.name}</h2>
      
      <button onClick = {() =>this.props.clearPlaylist()}>Go to all playlists</button>
      {this.state.songCount ? this.state.songs.map(song=>{
        const {songName,artist,id,duration} = song;
        return(
      <Song name = {songName} artist = {artist} id ={id} playlistId = {this.props.playlistId} duration = {duration} deleteHandler = {this.deleteSong} playHandler = {this.playSong}/>
      )}) : <p>Playlist Empty</p>
      }
    </div>
  );
  }
}
export default Playlist;
