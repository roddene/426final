import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';


class RegisterForm extends React.Component {
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

    async register(){
        if(!this.state.username||!this.state.password){
            return;
        }
        this.setState({
            buttonDisabled:true
        })
        try{

            const result = await fetch('/api/register',{
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
               alert("Registration successful!")

              }else if (result.status === 'error'){
                  alert("Error Registering")
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
    <div className="registerform">
      Register
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
      name = 'Register'
      disabled = {this.state.buttonDisabled}
      onClick = {()=> this.register()}
      />
    
      
    </div>
  );
}
}

export default RegisterForm;