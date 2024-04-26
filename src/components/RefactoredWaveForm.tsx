import useWaveform from "@/hooks/useWaveForm";
import { useState, useEffect, useRef } from "react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { cut } from "@/utils/waveSurferOperations";

// Random color generator
const randomColor = () => {
  let color = [];
  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
};

const RefactoredWaveform = ({ url = "sounds/sound3.wav" }) => {
  //I think I can get the length of the audio file and make a piece of state equal the it by default and then update it when the user changes it
  //That will be what is displayed to the user whenever they drag to expand or shrink the region
  const [audioMaxLength, setAudioMaxLength] = useState(0);
  const { waveform } = useWaveform(
    url,
    randomColor,
    audioMaxLength,
    setAudioMaxLength
  );

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
      <div id="waveform" className="flex flex-col gap-5" />
      <button onClick={playAudio}>Play/Pause</button>
    </div>
  );
};

export default RefactoredWaveform;
