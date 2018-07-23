import React, {Component} from 'react';
import logo from './logo.svg';
import App from "./App.js"
import './static/App.css';

class Main extends React.Component {

    render() {
        return (

            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React Garage Manager</h1>
                </header>
                <App />
            </div>
        )
    }
}

export default Main;