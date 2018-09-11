// @flow
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import chunk from "lodash/chunk";

/**
  Loads the ASCII movie from given text file.
  Using an encoded format, described on
  http://www.asciimation.co.nz/asciimation/ascii_faq.html
  In short:
      67x14 chars
      lines separated with \n
      first line is a number telling delay in number of frames
      13 lines effective frame size
      15 frames per second
*/

type Props = {};

type State = {
  frames: string[],
  currentFrame: number,
  currentMovie: "short_intro" | "rick_roll" | "sw1"
};

class App extends Component<Props, State> {
  state = {
    frames: [],
    currentFrame: 0,
    currentMovie: "short_intro"
  };

  frameTimeout = null;

  componentDidMount = () => {
    this.handleFetchMovie();
  };

  handleFetchMovie = () => {
    axios.get(`/movies/${this.state.currentMovie}.txt`).then(response => {
      this.setState(
        {
          frames: chunk(response.data.split("\n"), 14)
        },
        () => this.playFrame()
      );
    });
  };

  playFrame = () => {
    if (!this.state.frames[this.state.currentFrame]) {
      this.setState(
        {
          currentFrame: 0
        },
        () => this.playFrame()
      );
      return;
    }

    const frameDelay = (1000 / 15) * parseInt(this.state.frames[this.state.currentFrame][0], 10);
    this.frameTimeout = setTimeout(() => {
      this.setState(
        {
          currentFrame: this.state.currentFrame + 1
        },
        () => this.playFrame()
      );
    }, frameDelay);
  };

  renderCurrentFrame = () => {
    if (!this.state.frames[this.state.currentFrame]) return "";
    const frameLines = this.state.frames[this.state.currentFrame];
    return frameLines.slice(1, frameLines.length).join("\n");
  };

  stopMovie = () => {
    clearTimeout(this.frameTimeout);
  };

  handleSetMovie = (newMovie: "short_intro" | "sw1" | "rick_roll") => {
    this.stopMovie();
    this.setState(
      {
        currentMovie: newMovie,
        currentFrame: 0
      },
      this.handleFetchMovie()
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="App-player">{this.renderCurrentFrame()}</div>
        <div className="App-navigation">
          <button className="btn-flat waves-effect waves-light" onClick={() => this.handleSetMovie("rick_roll")}>
            Rick Roll
          </button>
          &nbsp;
          <button className="btn-flat waves-effect waves-light" onClick={() => this.handleSetMovie("sw1")}>
            Star Wars IV
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
