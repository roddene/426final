import React from 'react';

class Song extends React.Component {
    constructor(props){
      super(props);
      this.state = {
      }  
    }
    render(){
  return (
    <div className="Song">
      <div class = "song"></div>
      <h4 class ="songcomponent">{this.props.name}</h4> 
      <h4 class ="songcomponent">{this.props.artist}</h4>
      <h4 class = "songcomponent">{Math.floor(this.props.duration / 60)}:{(this.props.duration % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</h4>
      <button class ="songcomponent" onClick = {() =>this.props.playHandler(this.props.id,this.props.name,this.props.artist,this.props.duration)}>Play</button>
      <button class ="songcomponent" onClick = {() =>this.props.deleteHandler(this.props.id,this.props.playlistId)}>Remove</button>
      
    </div>
  );
}
}

export default Song;


