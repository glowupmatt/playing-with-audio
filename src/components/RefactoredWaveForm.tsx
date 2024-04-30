"use client";
import React, { useState, useEffect, useRef } from "react";
import useWaveForm from "@/hooks/useWaveForm";
import Wavesurfer from "wavesurfer.js";
import WaveFormRegions from "./WaveformEditFolder/WaveFormRegions";
import toWav from "audiobuffer-to-wav";
import { Region, SingleRegion } from "wavesurfer.js/dist/plugins/regions.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

// Random color generator
const randomColor = () => {
  let color = [];
  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
};

const RefactoredWaveform = () => {
  const url = "sounds/sound3.wav";

  //I think I can get the length of the audio file and make a piece of state equal the it by default and then update it when the user changes it
  //That will be what is displayed to the user whenever they drag to expand or shrink the region
  const waveform = useRef<Wavesurfer | null>(null);
  const [audioMaxLength, setAudioMaxLength] = useState(0);
  const [leftTrack, setLeftTrack] = useState("");
  const [userAction, setUserAction] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (waveform.current === null) {
      waveform.current = Wavesurfer.create({
        container: "#waveform",
        waveColor: "rgba(200, 0, 200, 0.2)",
        progressColor: "rgba(100, 0, 100, 0.5)",
        url: url,
        width: 250,
        plugins: [RegionsPlugin.create()],
        backend: "WebAudio",
      });
      let wsRegions: RegionsPlugin = waveform.current.registerPlugin(
        RegionsPlugin.create()
      );
      waveform.current.on("decode", () => {
        if (waveform.current)
          wsRegions.addRegion({
            start: 0,
            end: waveform.current.getDuration(),
            content: "Resize me",
            color: randomColor(),
            drag: false,
            resize: true,
          });
      });
      let activeRegion: Region;
      wsRegions.on("region-in", (region) => {
        activeRegion = region;
      });

      wsRegions.on("region-clicked", (region, e) => {
        e.stopPropagation();
        region.play();
        region.setOptions({ ...region, color: randomColor() });
      });
      wsRegions.on("region-out", (region) => {
        if (activeRegion === region) {
          region.play();
        }
      });
      wsRegions.on("region-updated", async (region) => {
        setUserAction((prev) => prev + 1);
        console.log(region.start, region.end);
        const regions: SingleRegion = wsRegions.getRegions()[0];
        const start = regions.start.toFixed(2);
        const end = regions.end.toFixed(2);
        const currentTime = waveform.current?.getCurrentTime();
        const mediaElement = waveform.current?.getMediaElement();
        const blobUrl = mediaElement?.currentSrc;
        waveform.current?.skip(parseFloat(start));
        let blob;
        if (blobUrl) {
          const response = await fetch(blobUrl);
          blob = await response.blob();
        }
        console.log(blob, "blob");
        // Create an AudioContext and decode the audio data
        if (blob && waveform.current) {
          const audioCtx = new window.AudioContext();
          const arrayBuffer = await blob.arrayBuffer();
          const originalBuffer = await audioCtx.decodeAudioData(arrayBuffer);

          // Calculate the start and end indices
          const startIndex = Math.floor(
            parseInt(start) * originalBuffer.sampleRate
          );
          const endIndex = Math.floor(
            parseInt(end) * originalBuffer.sampleRate
          );
          console.log(startIndex, endIndex, "indices");

          // Create a new AudioBuffer for the segment
          const segmentLength = endIndex - startIndex;
          const segmentBuffer = audioCtx.createBuffer(
            originalBuffer.numberOfChannels,
            segmentLength,
            originalBuffer.sampleRate
          );
          console.log(segmentBuffer, "segmentBuffer");
          for (
            let channel = 0;
            channel < originalBuffer.numberOfChannels;
            channel++
          ) {
            const originalData = originalBuffer.getChannelData(channel);
            const segmentData = segmentBuffer.getChannelData(channel);
            for (let i = 0; i < segmentLength; i++) {
              segmentData[i] = originalData[startIndex + i];
            }
          }

          // Load the segment AudioBuffer into the waveform
          if (waveform.current) {
            const wav = toWav(segmentBuffer);
            const wavBlob = new Blob([new DataView(wav)], {
              type: "audio/wav",
            });
            const url = URL.createObjectURL(wavBlob);
            setAudio(new Audio(url));

            console.log(audio, "audio");
            waveform.current.loadBlob(wavBlob);
            console.log(waveform.current, "waveform");
          }
        }

        console.log(start, end, "regions");
        console.log(waveform.current?.getWrapper(), "wrapper");
      });
    }
  }, [url, waveform, userAction, audio]);

  const playAudio = () => {
    if (waveform.current)
      if (waveform.current.isPlaying()) {
        waveform.current.pause();
      } else {
        waveform.current.play();
      }
  };

  useEffect(() => {
    // Get a reference to the current div and its parent element
    let currentDiv = document.getElementById("waveform");
    let parent = currentDiv?.parentNode;

    // Create a new div
    currentDiv = document.createElement("div");
    currentDiv.id = "waveform";

    // Get a reference to the parent element
    const parentElement = document.getElementById("parentElementId");

    // Add the new div to the parent element
    if (parentElement) {
      parentElement.appendChild(currentDiv);
    }
  }, [audio]);

  // useEffect(() => {
  //   const canvasMap = new Map();
  //   const regionMap = new Map();
  //   const processChildren = (children: HTMLCollection | null) => {
  //     if (!children) return;
  //     Array.from(children)
  //       .filter((child) => child.querySelector("div"))
  //       .forEach((child) => {
  //         const parentDiv = child.children;
  //         canvasMap.set("innerHTML", parentDiv[0].children[0]);
  //         regionMap.set("innerHTML", parentDiv[0].children[3]);
  //         console.log(parentDiv[0].children, "region");
  //         Array.from(regionMap).forEach(
  //           ([key, value]: [string, HTMLElement]) => {
  //             if (value) {
  //               const divs = value.querySelector("div[part]");
  //               const div = divs as HTMLElement;
  //               if (div && div.style) {
  //                 setLeftTrack(div.style.left);
  //               }
  //             }
  //           }
  //         );
  //       });
  //     Array.from(canvasMap).forEach(([key, value]: [string, HTMLElement]) => {
  //       console.log(value, "value");
  //       const divs = value.querySelectorAll("div");
  //       divs.forEach((div) => {
  //         console.log(div, "div");
  //       });
  //       value.style.position = "relative";
  //       value.style.opacity = "0.5";
  //       value.style.left = leftTrack;
  //       value.style.clipPath = "";
  //     });
  //   };
  //   const waveformDiv = document.getElementById("waveform");
  //   if (waveformDiv) {
  //     const childElement = waveformDiv.querySelector("div");
  //     if (childElement && childElement.shadowRoot) {
  //       processChildren(childElement.shadowRoot.children);
  //     }
  //   }
  // }, [leftTrack, userAction]);

  return (
    <div>
      <div id="waveform" className="flex flex-col gap-5" />
      {/* {waveform.current !== null && <WaveFormRegions waveform={waveform} />} */}
      <button onClick={playAudio}>Play/Pause</button>
    </div>
  );
};

export default RefactoredWaveform;
