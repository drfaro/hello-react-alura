import React, { Component } from 'react';

import PubSub from 'pubsub-js';

export default class InputCustomizado extends Component{

constructor(){
	super();
	this.state = {errorMsg:""}
}

componentDidMount(){
	PubSub.subscribe('atualiza-erro-autor',function(msg, data){
		console.log(JSON.stringify(msg))
		var error = JSON.stringify(data);
		console.log()
		this.setState({errorMsg:error})
	}.bind(this));

	PubSub.subscribe('limpar-erros',function(msg, data){
		this.setState({errorMsg:""})
	}.bind(this));


}

	render(){
		return (
			<div className="pure-control-group">
	            <label htmlFor={this.props.id}>{this.props.label}</label> 
	            <input {...this.props}/>
	            <span>{this.state.errorMsg}</span>
	          </div>
		)
	} 
}

