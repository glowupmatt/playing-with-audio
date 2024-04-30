import React, { useState, useEffect, useRef } from "react";
import Wavesurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import toWav from "audiobuffer-to-wav";

// Helper function to generate random color
const randomColor = () => {
  let color = [];
  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
};

// Custom hook to initialize waveform
const useWaveform = (url: string) => {
  const waveform = useRef<WaveSurfer | null>(null);
  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = Wavesurfer.create({
        container: "#waveform",
        waveColor: "rgba(200, 0, 200, 0.2)",
        progressColor: "rgba(100, 0, 100, 0.5)",
        url: url,
        width: 250,
        plugins: [RegionsPlugin.create()],
      });
    }
    return () => {
      if (waveform.current) {
        waveform.current.destroy();
      }
    };
  }, [url]);
  return waveform;
};

// Custom hook to handle regions
const useRegions = (waveform, userAction, audio) => {
  const [region, setRegion] = useState(null);
  useEffect(() => {
    if (waveform.current) {
      let wsRegions = waveform.current.registerPlugin(RegionsPlugin.create());
      // Add event listeners...
    }
  }, [waveform, userAction, audio]);
  return region;
};

type Props = {};

const NewRefactoredWave = (props: Props) => {
  const url = "sounds/sound3.wav";
  const waveform = useWaveform(url);
  const [userAction, setUserAction] = useState(0);
  const [audio, setAudio] = useState(null);
  const region = useRegions(waveform, userAction, audio);

  const playAudio = () => {
    if (waveform.current)
      if (waveform.current.isPlaying()) {
        waveform.current.pause();
      } else {
        waveform.current.play();
      }
  };

  return (
    <div>
      <div id="waveform" className="flex flex-col gap-5" />
      <button onClick={playAudio}>Play/Pause</button>
    </div>
  );
};

export default NewRefactoredWave;
