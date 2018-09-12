// @flow
import React from "react";

type Props = {
  name: string,
  movie: "sw1" | "rick_roll" | "short_intro",
  onSetMovie: ("sw1" | "rick_roll" | "short_intro") => void
};

const MovieButton = function(props: Props) {
  return (
    <button className="btn-flat waves-effect waves-light" onClick={() => props.onSetMovie(props.movie)}>
      {props.name}
    </button>
  );
};

export default MovieButton;
