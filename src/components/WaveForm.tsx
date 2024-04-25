"use client";

import Wavesurfer from "wavesurfer.js";
import { useEffect, useRef, useState } from "react";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";

const Waveform = () => {
  //Here is the ref for the parent waveform div
  const waveformRef = useRef<HTMLDivElement | null>(null);
  //Here is the wave form ref for the Wavesurfer instance.. This will hold all the methods and properties of the Wavesurfer instance
  const waveform = useRef<Wavesurfer | null>(null);
  //Here is the timeline ref for the timeline plugin instance.. This will hold all the methods and properties of the timeline plugin instance
  const timeline = useRef<TimelinePlugin | null>(null);
  //this will be dynamically generated eventually but for now it is a static url of the audio file
  const url = "sounds/sound1.wav";
  //Random color generator but I will use hard coded colors later
  const randomColor = () => {
    let color = [];
    for (let i = 0; i < 3; i++) {
      color.push(Math.floor(Math.random() * 256));
    }
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
  };
  const [duration, setDuration] = useState<number | null>(null);

  useEffect(() => {
    //Here we are checking if the waveformRef is not null
    if (waveformRef.current) {
      //Here we are creating a new instance of Wavesurfer and passing the container and the styling of the visualization waveform
      timeline.current = TimelinePlugin.create({
        height: 30,
        insertPosition: "beforebegin",
        timeInterval: 0.2,
        primaryLabelInterval: 5,
        secondaryLabelInterval: 1,
        style: {
          fontSize: "20px",
          color: "#2D5B88",
        },
      });

      waveform.current = Wavesurfer.create({
        //all the options for the waveform
        container: "#waveform",
        waveColor: "rgba(200, 0, 200, 0.2)",
        progressColor: "rgba(100, 0, 100, 0.5)",
        url: url,
        plugins: [timeline.current],
      });

      //This creates a new instance of the regions plugin and adds it to the waveform instance
      const wsRegions = waveform.current.registerPlugin(RegionsPlugin.create());
      //Here we are adding a region to the waveform
      waveform.current.on("decode", () => {
        // Add a couple of pre-defined regions
        wsRegions.addRegion({
          start: 0,
          end: 8,
          content: "Resize me & drag me!",
          color: randomColor(),
          drag: false,
          resize: true,
        });
      });
      wsRegions.enableDragSelection({
        color: "rgba(255, 0, 0, 0.1)",
      });

      // Loop a region on click this is a true or false value that will be toggled by the checkbox
      let loop = true;
      // Toggle looping with a checkbox
      let checkbox = document.querySelector('input[type="checkbox"]');
      if (checkbox instanceof HTMLElement) {
        checkbox.onclick = (e) => {
          if (e.target instanceof HTMLInputElement) {
            loop = e.target.checked;
          }
        };
      }

      //Here we are adding event listeners to the regions plugin to listen for the region-in, region-out, and region-clicked events
      let activeRegion: Region;
      wsRegions.on("region-in", (region) => {
        console.log("region-in", region);
        activeRegion = region;
      });

      // Region out event listener checks if the active region is the same as the region that was exited and if the loop is true then it plays the region
      wsRegions.on("region-out", (region) => {
        console.log("region-out", region);
        //checks if the region that was exited is the same as the active region and if the loop is true then it plays the region
        if (activeRegion === region && loop) {
          region.play();
        }
      });
      // Region clicked event listener sets the active region to the region that was clicked and plays the region
      wsRegions.on("region-clicked", (region, e) => {
        e.stopPropagation();
        activeRegion = region;
        region.play();
        region.setOptions({ ...region, color: randomColor() });
      });
    }
  }, []);

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

export default Waveform;
