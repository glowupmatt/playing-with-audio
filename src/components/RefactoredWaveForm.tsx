import Wavesurfer from "wavesurfer.js";
import { useEffect, useRef } from "react";
import useWaveform from "@/hooks/useWaveForm";

// Random color generator
const randomColor = () => {
  let color = [];
  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
};

const RefactoredWaveform = ({ url = "sounds/sound2.wav" }) => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const { waveform } = useWaveform(url, randomColor);

  const playAudio = () => {
    if (waveform.current === null) return;
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  return (
    <div>
      <div id="waveform" ref={waveformRef} className="flex flex-col gap-5" />
      <button onClick={playAudio}>Play/Pause</button>
    </div>
  );
};

export default RefactoredWaveform;
