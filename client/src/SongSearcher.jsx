import React from 'react';
import Autocomplete from './Autocomplete';
import AutoComplete from './Autocomplete'

class SongSearcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVal: '',
      possibleSongs:[],
      showSuggestions:false,
      songCount:0,
      showing:true
    }
    this.updateSpotifyResults = this.updateSpotifyResults.bind(this);
  }

  async updateSpotifyResults(val) {
    this.setState((state) => ({
      inputVal: val
    }));
    
    const result = await fetch('/api/spotifySearch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        query: val
      })
    }).then((res) => res.json())
    if(result.status!='error'){
    this.setState((state) => ({
      possibleSongs:result,
      songCount:result.length,
      inputVal:val
    }));

    setTimeout(this.setState({
      showing:true,
      possibleSongs:result,
      inputVal:val
  }),500);

  }

  }

  addSong =(index,videoId,duration) =>{
    this.props.addSong(index[0],index[1],duration,videoId)

  }



  render() {


    return (
      <div className="songsearcher">

        <Autocomplete addSong= {this.addSong} suggestions = {this.state.possibleSongs.map((el)=>{
          return el.songName + ';' +el.artistName
        })} updateSuggest = {this.updateSpotifyResults} inputVal ={this.state.inputVal}/>
        

      </div>
    );




  }

}

export default SongSearcher;