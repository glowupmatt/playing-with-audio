import useWaveform from "@/hooks/useWaveForm";
import { relative } from "path";
import { useState, useEffect, useRef, useActionState } from "react";
import Wavesurfer from "wavesurfer.js";

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
  const [userAction, setUserAction] = useState(0);
  const { waveform } = useWaveform(
    url,
    randomColor,
    audioMaxLength,
    setAudioMaxLength
  );
  const [leftTrack, setLeftTrack] = useState("");
  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = Wavesurfer.create({
        container: "#waveform",
        waveColor: "rgba(200, 0, 200, 0.2)",
        progressColor: "rgba(100, 0, 100, 0.5)",
        url: url,
        width: 250,
        // plugins: [timeline.current],
      });
    }
  }, [url, waveform]);

  const playAudio = () => {
    if (waveform.current === null) return;
    if (waveform.current.isPlaying()) {
      waveform.current.pause();
    } else {
      waveform.current.play();
    }
  };

  useEffect(() => {
    const canvasMap = new Map();
    const regionMap = new Map();
    const processChildren = (children: HTMLCollection | null) => {
      if (!children) return;
      Array.from(children)
        .filter((child) => child.querySelector("div"))
        .forEach((child) => {
          const parentDiv = child.children;
          canvasMap.set("innerHTML", parentDiv[0].children[0]);
          regionMap.set("innerHTML", parentDiv[0].children[3]);
          console.log(parentDiv[0].children, "region");
          Array.from(regionMap).forEach(
            ([key, value]: [string, HTMLElement]) => {
              if (value) {
                const divs = value.querySelector("div[part]");
                const div = divs as HTMLElement;
                if (div && div.style) {
                  setLeftTrack(div.style.left);
                }
              }
            }
          );
        });
      Array.from(canvasMap).forEach(([key, value]: [string, HTMLElement]) => {
        console.log(value, "value");
        const divs = value.querySelectorAll("div");
        divs.forEach((div) => {
          console.log(div, "div");
        });
        value.style.position = "relative";
        value.style.opacity = "0.5";
        value.style.left = leftTrack;
        value.style.clipPath = "";
      });
    };

    const waveformDiv = document.getElementById("waveform");
    if (waveformDiv) {
      const childElement = waveformDiv.querySelector("div");
      if (childElement && childElement.shadowRoot) {
        processChildren(childElement.shadowRoot.children);
      }
    }
    setUserAction((prev) => prev + 1);
  }, [leftTrack, userAction]);

  return (
    <div>
      <div id="waveform" className="flex flex-col gap-5" />
      <button onClick={playAudio}>Play/Pause</button>
    </div>
  );
};

export default RefactoredWaveform;
