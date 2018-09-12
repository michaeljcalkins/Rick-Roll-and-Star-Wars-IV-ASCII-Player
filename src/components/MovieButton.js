// @flow
import React from "react";

type Props = {
  name: string,
  movie: string,
  onSetMovie: string => void
};

const MovieButton = function(props: Props) {
  return (
    <button className="btn-flat waves-effect waves-light" onClick={() => props.onSetMovie(props.movie)}>
      {props.name}
    </button>
  );
};

export default MovieButton;
