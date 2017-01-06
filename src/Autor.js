import React, { Component } from 'react';
import $ from'jquery';
import InputCustomizado from './components/InputCustomizado';
import TratadorErros from './TratadorErros';
import PubSub from 'pubsub-js';

class FormularioAutor extends Component{

	constructor(){
		super();
		this.state = {name:"",email:"",senha:""};
		this.enviaDados = this.enviaDados.bind(this);

	}

	setCampoForm(nameInput,formInput){
		var obj = {}
		obj[nameInput] = formInput.target.value

		this.setState(obj);
	}


	enviaDados(evento){
	  evento.preventDefault()
	  
	  $.ajax({
	    url:"http://localhost:5000/autores",
	    dataType:"json",
	    type:"post",
	    data:JSON.stringify({nome:this.state.nome,email:this.state.email,senha:this.state.senha}),
	    success:function(resposta){
	      console.log(resposta)
	        
	        PubSub.publish('atualiza-lista-autor',{nome:this.state.nome,email:this.state.email,senha:this.state.senha});

	    }.bind(this),
	    error:function(callback){
	    	console.log(callback)
	      new TratadorErros().publicaErros(callback);
	    },beforeSend:function(){
			PubSub.publish('limpar-erros','');
	    }
	  })

	}

	render(){
		return (
			<div>

			<div className="header">
				<h1>Cadastro</h1>
			</div>
			<div className="content" id="content">
				<div className="pure-form pure-form-aligned">

			        <form className="pure-form pure-form-aligned" onSubmit={this.enviaDados} method="post">
			          
			            <InputCustomizado id="nome" label="nome" type="text" name="nome" value={this.nome} onChange={this.setCampoForm.bind(this,"nome")} />
			            <InputCustomizado id="email" label="email" type="email" name="email" value={this.email} onChange={this.setCampoForm.bind(this,"email")} />
			            <InputCustomizado id="senha" label="senha" type="password" name="senha"  value={this.senha} onChange={this.setCampoForm.bind(this,"senha")} />
			          
			            <button type="submit" className="pure-button pure-button-primary">Gravar</button>   
			            <br />                                 
			        </form>             

				</div>             
			</div>

			</div>

		)
	} 
}

class TabelaAutores extends Component{

	constructor(){
		super();
	}
	
	

	render(){
		return (
			<div className="content" >
				<div className="pure-form pure-form-aligned">

			        
			       <table className="pure-table">
			          <thead>
			            <tr>
			              <th>Nome</th>
			              <th>email</th>
			            </tr>
			          </thead>
			          <tbody>
			          {
			            this.props.lista.map(function(autor,key){
			              return (
			                  <tr key={key}>
			                    <td>{autor.nome}</td>                
			                    <td>{autor.email}</td>                
			                  </tr>
			                )

			            })
			          }
			          </tbody>
			        </table> 



				</div>             
			</div>


		)
	} 
}

class AutorBox extends Component {

	constructor(){
		super();
		this.state = {lista:[]};
		this.atualizaListagem = this.atualizaListagem.bind(this)
	}

		
	componentWillMount(){

		PubSub.subscribe( 'atualiza-lista-autor', function(msg,novoItem){
			
			var novaLista = this.state.lista
			novaLista.push(novoItem)

			this.setState({lista:novaLista});

		}.bind(this) );

		$.ajax({
		  url:"http://localhost:5000/autores",
		  dataType:"json",
		  success:function(resposta){
		    console.log(resposta)
		      this.setState({lista:resposta})
		  }.bind(this)
		})

	}

	atualizaListagem(novaLista){
		//this.setState(novaLista)
	}

	render(){
		return (
			<div>
				<FormularioAutor lista={this.state.lista} callbackAtualizaListagem={this.atualizaListagem} />
				<TabelaAutores lista={this.state.lista} />
			</div>
		)
	} 

}

export default AutorBox;