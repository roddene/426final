import React from 'react';
import PlaylistSelector from './PlaylistSelector';
import Player from './Player';



class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoCode: "dQw4w9WgXcQ",
      artist: "Playlist",
      song: "Choose a",
      duration: 212,
      songs:[]
    }
  }

  
 changePlaylist = (songs) =>{
   console.log("change playlist");
  this.setState((state) => ({
    songs:songs
  }));
 }

  playSong = (id, name, artist, duration) => {
    console.log(duration);
    console.log(this.state);
    this.setState((state) => ({
      videoCode: id,
      artist: artist,
      song: name,
      duration: duration
    }));
  }
  render() {
    return (
      <div className="Controller">

        <Player videoCode={this.state.videoCode} artist={this.state.artist} song={this.state.song} duration={this.state.duration} playlist = {this.state.songs}/>
        <PlaylistSelector playSongHandler={this.playSong} token={this.props.token} username={this.props.username} changePlaylist = {this.changePlaylist} />
      </div>
    );
  }
}

export default Controller;
