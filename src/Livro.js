import React, { Component } from 'react';
import $ from'jquery';
import InputCustomizado from './components/InputCustomizado';
import TratadorErros from './TratadorErros';
import PubSub from 'pubsub-js';

class FormularioLivro extends Component{

	constructor(){
		super();
		this.state = {titulo:"",preco:"",autor:""};
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
	    url:"http://localhost:5000/livros",
	    dataType:"json",
	    type:"post",
	    data:JSON.stringify({titulo:this.state.titulo,preco:this.state.preco,autor:this.state.autor}),
	    success:function(resposta){
	      console.log(resposta)
	        

	        PubSub.publish('atualiza-lista-livro',{titulo:this.state.titulo,preco:this.state.preco,autor:this.props.autores[this.state.autor]});

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
			          
			            <InputCustomizado id="titulo" label="titulo" type="text" name="titulo" value={this.titulo} onChange={this.setCampoForm.bind(this,'titulo')} />
			            <InputCustomizado id="preco" label="preco" type="text" name="preco" value={this.preco} onChange={this.setCampoForm.bind(this,'preco')} />


						<div className="pure-control-group">

	            			<label htmlFor="autor">Autores</label> 

				            <select name="autor" id="autor"  onChange={this.setCampoForm.bind(this,'autor')} >
				            <option  > Selecione  </option>

				            {
					           	this.props.autores.map(function(autor,key){
					          		return <option value={autor.id} id={key} > {autor.nome} </option>
					           	})
				           	}
				           	</select>
				         </div>

			            <button type="submit" className="pure-button pure-button-primary">Gravar</button>   
			            <br />                                 
			        </form>             

				</div>             
			</div>

			</div>

		)
	} 
}

class TabelaLivros extends Component{

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
			              <th>Titulo</th>
			              <th>Preco</th>
			              <th>Autor</th>
			            </tr>
			          </thead>
			          <tbody>
			          {
			            this.props.lista.map(function(livro,key){
			              return (
			                  <tr key={key}>
			                    <td>{livro.titulo}</td>                
			                    <td>{livro.preco}</td>                
			                    <td>{livro.autor.nome}</td>                
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

class LivroBox extends Component {

	constructor(){
		super();
		this.state = {lista:[],autores:[]};
		//this.atualizaListagem = this.atualizaListagem.bind(this)
	}

		
	componentWillMount(){

		PubSub.subscribe( 'atualiza-lista-livro', function(msg,novoItem){
			
			var novaLista = this.state.lista
			novaLista.push(novoItem)

			this.setState({lista:novaLista});

		}.bind(this) );

		$.ajax({
		  url:"http://localhost:5000/livros",
		  dataType:"json",
		  success:function(resposta){
		    console.log(resposta)
		      this.setState({lista:resposta})
		  }.bind(this)
		})

		$.ajax({
		  url:"http://localhost:5000/autores",
		  dataType:"json",
		  success:function(resposta){
		      this.setState({autores:resposta})
		  }.bind(this)
		})

	}

	render(){
		return (
			<div>
				<FormularioLivro lista={this.state.lista}  autores={this.state.autores} />
				<TabelaLivros lista={this.state.lista} />
			</div>
		)
	} 

}

export default LivroBox;