import React from "react";
import { Composition } from "remotion";
import { CitepayVideo } from "./CitepayVideo";
import { JudgeDeck } from "./JudgeDeck";

const FPS = 30;
const DURATION_S = 120;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CitepayDemo"
        component={CitepayVideo}
        durationInFrames={DURATION_S * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="CitepayJudgeDeck"
        component={JudgeDeck}
        durationInFrames={DURATION_S * FPS}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
