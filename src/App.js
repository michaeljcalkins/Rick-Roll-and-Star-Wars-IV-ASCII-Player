// @flow
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import chunk from "lodash/chunk";

type Props = {};

type State = {
  frames: string[],
  currentFrame: number
};

class App extends Component<Props, State> {
  state = {
    frames: [],
    currentFrame: 0
  };

  componentDidMount = () => {
    this.handleFetchMovie();
  };

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
  handleFetchMovie = () => {
    axios.get("/movies/sw1.txt").then(response => {
      this.setState(
        {
          frames: chunk(response.data.split("\n"), 14)
        },
        () => {
          console.log(this.state.frames[this.state.currentFrame]);

          this.playFrame();
        }
      );
    });
  };

  playFrame = () => {
    setTimeout(() => {
      if (this.state.currentFrame - 1 > this.state.frames.length) {
        this.setState(
          {
            currentFrame: 0
          },
          () => {
            this.playFrame();
          }
        );
        return;
      }

      this.setState(
        {
          currentFrame: this.state.currentFrame + 1
        },
        () => {
          this.playFrame();
        }
      );
    }, 1000 / 5);
  };

  renderCurrentFrame = () => {
    if (!this.state.frames[this.state.currentFrame]) return "";
    return this.state.frames[this.state.currentFrame].join("\n");
  };

  render() {
    return (
      <div className="App">
        <pre className="App-player">{this.renderCurrentFrame()}</pre>
      </div>
    );
  }
}

export default App;
