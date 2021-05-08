import React from 'react';

class SubmitButton extends React.Component{
    constructor(props){
        super(props);
        this.state = {
        }  
      }

    render(){
        return(
            <div className = "submitbutton">
                <button disabled = {this.props.disabled} onClick = {()=>this.props.onClick()}>{this.props.name}</button>
            </div>
        )
    }
}

export default SubmitButton;