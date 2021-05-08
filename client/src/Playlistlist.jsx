import React from 'react';

class Playlistlist extends React.Component {
    constructor(props){
      super(props);  
          this.state = {
          
          }
        }

        render(){
    return (
      <div className="playlistlist">
         {this.props.playlists.map(playlist=>{
        const {name,owner,_id} = playlist;
        return(
      <div class="playlistinfo">
          <h5 class = "playlistinfodata">{name}</h5>
          <h5 class = "playlistinfodata">{owner}</h5>
          <button class = "playlistinfodata" onClick = {() => this.props.selectPlaylist(name,owner,_id) }>Open</button>
          <button class = "playlistinfodta" onClick = {()=>this.props.deletePlaylist(_id)}>Delete</button>
      </div>
      )})
      }
      </div>
    );
  


      
  }
    
  }
  
  export default Playlistlist;