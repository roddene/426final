import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';


class LoginForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
          username:'',
          password:'',
          buttonDisabled:false
      }  
    }

    setInputValue(property,val){
        val = val.trim();
        if(val.length >20){
            return;
        }
        this.setState({
            [property]:val
        })
    }
    resetForm(){
        this.setState({
            username:'',
            password:'',
            buttonDisabled:false
        })
    }

    async login(){
        if(!this.state.username||!this.state.password){
            return;
        }
        this.setState({
            buttonDisabled:true
        })
        try{
            const result = await fetch('/api/login',{
                method:'POST',
                headers:{
                  'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    username:this.state.username,
                    password:this.state.password
                })
              }).then((res)=>res.json());
              if(result.status === 'ok'){
                  this.props.updateState(this.state.username,result.data,true);
                  localStorage.setItem('token',result.data);
              }else if (result.status === 'error'){
                  this.resetForm();
              } 


        }catch(e){
            console.log(e);
        }

        this.setState({
            buttonDisabled:false
        })


    }




    render(){
  return (
    <div className="loginform">
      Log in 
      <InputField
      type = 'text'
      placeholder = 'username'
      value ={this.state.username ? this.state.username :''}
      onChange = {(val) => this.setInputValue('username',val)}
      />

    <InputField
      type = 'password'
      placeholder = 'password'
      value ={this.state.password ? this.state.password :''}
      onChange = {(val) => this.setInputValue('password',val)}
      />
      <SubmitButton
      name = 'Login'
      disabled = {this.state.buttonDisabled}
      onClick = {()=> this.login()}
      />
    
      
    </div>
  );
}
}

export default LoginForm;