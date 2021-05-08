import './App.css';
import React from 'react';
import Youtube from "react-youtube";




class Player extends React.Component {

    constructor(props) {
        super(props);


        this.state = {

            videoCode: props.videoCode,
            curTime: 0,
            totalTime: props.duration,
            repeat: false,
            player: '',
            isPlaying: false,
            isShuffling: false,
            song: props.song,
            artist: props.artist,
            playlist: props.playlist,//playlist
            opts: {
                playerVars: {
                    // https://developers.google.com/youtube/player_parameters
                    autoplay: 0,
                    loop: true
                }
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ playlist:nextProps.playlist,
            videoCode:nextProps.videoCode,
            artist:nextProps.artist,
            song:nextProps.song,
            duration:nextProps.duration
        })
      }
      

    componentDidMount = () => {
        this.myTimer();
    }

    componentWillUnmount = () => {
        clearInterval(this.myTimer);
    }

    myTimer = () => {
        setInterval(() => {
            if (this.state.isPlaying) {


                this.setState((state) => ({
                    curTime: state.curTime + 1
                }));
            }
        }, 1000)
    }



    videoOnReady = (event) => {
        this.setState((state) => ({
            player: event.target,
            totalTime: event.target.getDuration()
        }));
    }
    playVideo = (event) => {
        this.state.player.playVideo();
        this.setState((state) => ({
            isPlaying: true,
            totalTime: this.state.player.getDuration()

        }));
    }
    pauseVideo = (event) => {
        this.state.player.pauseVideo();
        this.setState((state) => ({
            isPlaying: false
        }));
    }
    updateProgress = (event) => {
        this.setState((state) => ({
            curTime: Math.round(event.target.getCurrentTime()),
        }));
        if (this.state.isPlaying) {
            this.playVideo();
        }
    }
    endVideo = (event) => {
        if (this.state.repeat) {
            this.state.player.seekTo(0, false);
            this.playVideo();
        } else {
            this.nextSong();
        }
    }
    changeRepeat = (event) => {
        alert(!this.state.repeat);
        this.setState((state) => ({
            repeat: !this.state.repeat
        }));
    }
    changeShuffle = (event) => {
        alert(!state.isShuffling);
        this.setState((state) => ({
            isShuffling: !this.state.isShuffling
        }));
    }
    nextSong = (event) => {
        if (this.state.playlist.length > 1) {
            if (this.state.isShuffling) {
                let rand = Math.floor(Math.random() * this.state.playlist.length);
                while (this.state.playlist[rand].id==this.state.videoCode){
                    rand = Math.floor(Math.random() * this.state.playlist.length);
                }
                const newSong = this.state.playlist[rand];
                this.setState((state) => ({
                   song:newSong.songName,
                   artist:newSong.artist,
                   videoCode:newSong.id,
                   duration:newSong.duration
                }));

        } else {
                let total = this.state.playlist.length;
                
                    let index = -1;
                    let val = this.state.videoCode;
                let filteredObj = this.state.playlist.find(function(item,i){
                    if(item.id===val){
                        index =i;
                        return i;
                    }
                })

                let indexLookup = 0;
                if(index !== this.state.playlist.length-1){
                    indexLookup = index+1;
                }
                const newSong = this.state.playlist[indexLookup];
                this.setState((state) => ({
                   song:newSong.songName,
                   artist:newSong.artist,
                   videoCode:newSong.id,
                   duration:newSong.duration
                }));
            }
        } else{
            this.pauseVideo();
        }
    
    }

    changeTime = (event) => {

        this.state.player.seekTo(Math.floor(this.state.totalTime * event.nativeEvent.offsetX / 240))
        this.setState((state) => ({
            curTime: Math.floor(this.state.totalTime * event.nativeEvent.offsetX / 240)
        }))
        //this.updateProgress();

    }//240 is width of progressbar


    render() {
        return (
            <div className="Player">
                <button onClick={this.playVideo}>Play</button>
                <button onClick={this.pauseVideo}>Pause</button>
                <button onClick={this.changeRepeat}>Repeat</button>
                <button onClick={this.nextSong}>Next</button>
                <button onClick={this.changeShuffle}>Shuffle</button>

                <div>
                    <div id="progress" >
                        <p class="timedisplay">{Math.floor(this.state.curTime / 60)}:{(this.state.curTime % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</p>
                        <div id="progressbardiv" onClick={this.changeTime}><progress id="progressbar" value={this.state.curTime} max={this.props.duration} ></progress></div>
                        <p class="timedisplay">{Math.floor(this.state.duration / 60)}:{(this.state.duration % 60).toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}</p>
                    </div>
                    <div id="currentsonginfo">
                        <p>{this.state.song} - {this.state.artist}</p>
                    </div>
                    <Youtube
                        videoId={this.state.videoCode}
                        playlist={this.state.videoCode}
                        containerClassName="embed"
                        opts={this.state.opts}
                        onReady={(e) => this.videoOnReady(e)}
                        onStateChange={(e) => this.updateProgress(e)}
                        onEnd={(e) => this.endVideo(e)}
                    />

                </div>

            </div>
        );
    }
}

export default Player;
