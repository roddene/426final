import React from 'react';

class InputField extends React.Component {
    constructor(props){
      super(props);
      this.state = {
      }  
    }
    render(){
  return (
    <div className="inputfield">
      <input
      type = {this.props.type}
      placeholder = {this.props.placeholder}
      value = {this.props.value}
      onChange = {(e) => this.props.onChange(e.target.value)}/>
    
      
    </div>
  );
}
}

export default InputField;