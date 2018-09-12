// @flow
import React from "react";
import "./Player.css";

type Props = {
  currentFrame: number,
  frames: any
};

const Player = function(props: Props) {
  if (!props.frames[props.currentFrame]) return null;
  const frameLines = props.frames[props.currentFrame];
  const textToRender = frameLines.slice(1, frameLines.length).join("\n");
  return <div className="App-player">{textToRender}</div>;
};

export default Player;
