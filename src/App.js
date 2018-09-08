// @flow
import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";

type Props = {};

type State = {
  value: string
};

class App extends Component<Props, State> {
  state = {
    value: ""
  };

  handleGetIpsum = () => {
    axios.get("https://baconipsum.com/api/?type=meat-and-filler").then(response => {
      this.setState({
        value: response.data
      });
    });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Bacon Ipsum Generator</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.handleGetIpsum}>Generate Ipsum</button>
        </p>
        <p>
          <textarea className="App-textarea" value={this.state.value} />
        </p>
      </div>
    );
  }
}

export default App;
