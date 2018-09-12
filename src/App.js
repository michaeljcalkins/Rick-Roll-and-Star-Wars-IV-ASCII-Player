// @flow
import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import chunk from "lodash/chunk";
import Player from "./components/Player";
import MovieButton from "./components/MovieButton";

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
  currentMovie: "rick_roll" | "sw1" | "short_intro",
  movieCache: {}
};

class App extends Component<Props, State> {
  state = {
    frames: [],
    currentFrame: 0,
    currentMovie: "short_intro",
    movieCache: {}
  };

  frameTimeout = null;

  componentDidMount = () => {
    this.handleFetchMovie("short_intro");
  };

  formatMovieFrames = (frames: string): string[] => {
    return chunk(frames.split("\n"), 14);
  };

  handleStartMovie = (movie: string, frames: string[]) => {
    let movieCache = {
      ...this.state.movieCache
    };
    movieCache[movie] = frames;

    this.setState(
      {
        currentMovie: movie,
        currentFrame: 0,
        frames,
        movieCache
      },
      () => this.playFrame()
    );
  };

  handleFetchMovie = (movie: string) => {
    if (this.state.movieCache[movie]) {
      this.handleStartMovie(movie, this.state.movieCache[movie]);
      return;
    }

    axios.get(`/movies/${movie}.txt`).then(response => {
      this.handleStartMovie(movie, this.formatMovieFrames(response.data));
    });
  };

  playFrame = () => {
    try {
      const frameDelay = (1000 / 15) * parseInt(this.state.frames[this.state.currentFrame][0], 10);
      this.frameTimeout = setTimeout(() => {
        this.setState(
          {
            currentFrame: this.state.currentFrame + 1
          },
          () => this.playFrame()
        );
      }, frameDelay);
    } catch (e) {
      this.handleFetchMovie(this.state.currentMovie);
    }
  };

  renderCurrentFrame = () => {
    if (!this.state.frames[this.state.currentFrame]) return "";
    const frameLines = this.state.frames[this.state.currentFrame];
    return frameLines.slice(1, frameLines.length).join("\n");
  };

  stopMovie = (): void => {
    clearTimeout(this.frameTimeout);
  };

  handleSetMovie = (movie: "sw1" | "rick_roll" | "short_intro") => {
    this.stopMovie();
    this.handleFetchMovie(movie);
  };

  render() {
    return (
      <React.Fragment>
        <Player frames={this.state.frames} currentFrame={this.state.currentFrame} />
        <MovieButton name="Rick Roll" movie="rick_roll" onSetMovie={this.handleSetMovie} />
        <MovieButton name="Star Wars IV" movie="sw1" onSetMovie={this.handleSetMovie} />
      </React.Fragment>
    );
  }
}

export default App;
