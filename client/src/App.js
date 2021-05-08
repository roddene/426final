import React from 'react';
import './App.css';
import Controller from './Controller';
import LoginForm from './LoginForm'
import SubmitButton from './SubmitButton';
import {observer} from 'mobx-react';
import RegisterForm from './RegisterForm'


class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      token:'',
      isLoggedIn:false,
      username:'username'
    }  
  }

  async componentDidMount() {
    
    this.setState((state)=>({
      token:localStorage.getItem('token')
  }));
  const result = await fetch('/api/home',{
    method: 'POST',
    headers:{
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token:localStorage.getItem('token')
    })
}).then((res)=>res.json())


  }

  logout = () =>{
    localStorage.setItem('token','');
    this.setState((state)=>({
      token:'',
      isLoggedIn:false,
      username:''
  }));
  }


 updateState = (username,token,isLoggedIn) =>{
  this.setState((state)=>({
    token:token,
    username:username,
    isLoggedIn:isLoggedIn
}));
 }



  render(){
    if(this.state.isLoggedIn){
  return (
    <div className="App">
      <header className="App-header">
        <title>Spotifootube</title>
        Welcome, {this.state.username}
        <Controller username = {this.state.username} token = {this.state.token} />

        <SubmitButton name = "logout" disabled = {false} onClick = {()=>this.logout()}/>
      </header>
    </div>
  );
} else{
  return(
    <div className="App">
      <header className="App-header">
      <title>Spotifootube</title>
        <LoginForm updateState ={this.updateState}/>
        <RegisterForm></RegisterForm>
      </header>
    </div>


  )
}
  }
}

export default observer(App);
