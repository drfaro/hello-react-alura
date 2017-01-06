import React, { Component } from 'react';
import './App.css';
import './css/pure-release-0.6.1/pure-min.css';
import './css/pure-layout-email/css/layouts/email.css';

import {Link} from 'react-router';;

import AutorBox from './Autor';


class App extends Component {
  
  constructor(){
    super()
    
  }


  render() {
    return (

      <div id="layout" className="content pure-g">
          <div id="nav" className="pure-u">
              <a href="#" className="nav-menu-button">Menu</a>

              <div className="nav-inner">

                  <div className="pure-menu">
                      <ul className="pure-menu-list">
                          <li className="pure-menu-item"><Link to="/" className="pure-menu-link"><span className="email-label-travel"></span>Home</Link></li>
                          <li className="pure-menu-item"><Link to="/autor" className="pure-menu-link"><span className="email-label-personal"></span>Autor</Link></li>
                          <li className="pure-menu-item"><Link to="/livro" className="pure-menu-link"><span className="email-label-work"></span>Livro</Link></li>
                      </ul>
                  </div>
              </div>
          </div>

          
          <div id="main" className="pure-u-1">
            {this.props.children}
          </div>   
      </div>





    );
  }
}

export default App;
