import React from 'react';
import Playlist from'./Playlist';
import Playlistlist from './Playlistlist';
import InputField from './InputField';
import SongSearcher from './SongSearcher';

class PlaylistSelector extends React.Component {
    constructor(props){
      super(props);  
          this.state = {
            username:this.props.username,
            playlistName :'playlistnam',
            playlistOwner:'ownn',
            playlistId:"playlist idenetification",
            newPlaylistName :'',
            songs:[],
            isActive:false,
            playlists:[                
            ]
          }
          this.addNewPlaylist = this.addNewPlaylist.bind(this);
          this.updatePlaylistlist = this.updatePlaylistlist.bind(this);
          this.selectPlaylist = this.selectPlaylist.bind(this);
          this.addSong = this.addSong.bind(this);
          this.deletePlaylist = this.deletePlaylist.bind(this)
        }
        componentDidMount(){//get playlists
            this.updatePlaylistlist();
        }

        async updatePlaylistlist(){
            const token = localStorage.getItem('token');
            const username =this.props.username;
            const result = await fetch('/api/getPlaylists',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    username,
                })
            }).then((res)=>res.json())
            this.setState((state)=>({
                playlists:result
            }));
        }

  
        clearPlaylist = () =>{
            this.setState((state)=>({
                isActive:false
            }));
        }

        async selectPlaylist (name,owner,id) {
            const token = localStorage.getItem('token');

            console.log("selected");
            console.log(id);
            this.setState((state)=>({
                isActive:true,
                playlistName:name,
                owner:owner,
                playlistId:id
            }));
            const result = await fetch('/api/selectPlaylist',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    id
                })
            }).then((res)=>res.json())
            console.log(result);
            this.setState((state)=>({
                songs:result
            }));
            this.props.changePlaylist(result);
            console.log("this.state.songs",this.state.songs);





            //update song array
        }

        async deletePlaylist(playlistId){
            const result = await fetch('/api/deletePlaylist',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token :localStorage.getItem('token'),
                    id:playlistId
                })
            }).then((res)=>res.json())
            this.updatePlaylistlist();
            this.selectPlaylist(this.state.playlistName,this.state.playlistOwner,this.state.playlistId);

        }

        updateNewPlaylist = (val) =>{
            this.setState((state)=>({
                newPlaylistName:val
            }))
            
        }

        async addNewPlaylist(){
            const newplay = this.state.newPlaylistName;
            const username = this.state.username;
            const token = this.props.token;
            console.log("newplay",newplay)
            const result = await fetch('/api/createPlaylist',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,
                    username,
                    newplay
                })
            }).then((res)=>res.json())
            this.updatePlaylistlist();
        }



        async addSong (songName,artist,duration,videoId){
            console.log('add to playlist ',this.state.playlistId);
            const token = localStorage.getItem('token');
            
            const result = await fetch('/api/addSong',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token,songName,artist,duration,videoId,playlistId:this.state.playlistId
                })
            }).then((res)=>res.json())

            
            this.selectPlaylist(this.state.playlistName,this.state.playlistOwner,this.state.playlistId);

          }



        render(){
            if(this.state.isActive){
                
    return (
      <div className="playlistselector">
          <SongSearcher addSong = {this.addSong}/>
         
          <Playlist name = {this.state.playlistName} playlistId = {this.state.playlistId} owner = {this.state.owner} songs = {this.state.songs} playSongHandler ={this.props.playSongHandler} clearPlaylist = {this.clearPlaylist}/>
      </div>
    );
  }else{
      return(
    <div className="playlistselector">
        <button onClick = {this.addNewPlaylist}>Add Playlist</button>
        

        <InputField
      type = 'text'
      placeholder = 'name'
      value ={this.state.newPlaylistName ? this.state.newPlaylistName :''}
      onChange = {(val) => this.updateNewPlaylist(val)}
      />

        <Playlistlist playlists ={this.state.playlists} selectPlaylist = {this.selectPlaylist} deletePlaylist = {this.deletePlaylist}/>
    </div>

      )
  }
    }
  }
  
  export default PlaylistSelector;