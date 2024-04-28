import { useEffect, useRef, useState } from "react";
import Wavesurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

const useWaveform = (
  url: string,
  randomColor: () => string,
  audioMaxLength: number,
  setAudioMaxLength: (audioMaxLength: number) => void,
  leftTrack: string,
  setLeftTrack: (leftTrack: string) => void
) => {
  const timeline = useRef<TimelinePlugin | null>(null);
  const waveform = useRef<Wavesurfer | null>(null);
  const [regionUpdate, setRegionUpdate] = useState(0);

  useEffect(() => {
    // const initializeTimeline = () => {
    //   timeline.current = TimelinePlugin.create({
    //     height: 30,
    //     insertPosition: "beforebegin",
    //     timeInterval: 0.2,
    //     primaryLabelInterval: 5,
    //     secondaryLabelInterval: 1,
    //     style: {
    //       fontSize: "20px",
    //       color: "#2D5B88",
    //     },
    //   });
    // };
    let wsRegions: RegionsPlugin;
    if (waveform.current) {
      wsRegions = waveform.current.registerPlugin(RegionsPlugin.create());
      waveform.current.on("decode", () => {
        if (waveform.current)
          wsRegions.addRegion({
            start: 0,
            end: waveform.current.getDuration(),
            content: "Resize me & drag me!",
            color: randomColor(),
            drag: false,
            resize: true,
          });
      });

      let activeRegion: Region;
      wsRegions.on("region-in", (region) => {
        activeRegion = region;
        setRegionUpdate((prev) => prev + 1);
      });

      wsRegions.on("region-out", (region) => {
        if (activeRegion === region) {
          region.play();
          setRegionUpdate((prev) => prev + 1);
        }
      });

      wsRegions.on("region-clicked", (region, e) => {
        e.stopPropagation();
        activeRegion = region;
        region.play();
        region.setOptions({ ...region, color: randomColor() });
        setRegionUpdate((prev) => prev + 1);
      });

      wsRegions.on("region-updated", (region) => {
        if (waveform.current) waveform.current.zoom(region.end - region.start);
        setRegionUpdate((prev) => prev + 1);
        console.log(region.start, region.end);
      });
      const regionKeys = Object.keys(wsRegions.getRegions());
    }

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
        if (divs.length === 0) return;
        const canvas = Array.from(divs)[0].childNodes[0];
        console.log(canvas, "divs");
        // Array.from(divs)[0].childNodes[0].style.left = leftTrack;
        Array.from(divs)[0].style.position = "relative";
        Array.from(divs)[0].style.left = leftTrack;

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

    // const trimLeft = () => {
    //   if (waveform.current && waveform.current) {
    //     // const start = wsRegions.getRegions()[Object.keys(wavesurfer.regions.list)[0]].start.toFixed(2);
    //     // const end = wavesurfer.regions.list[Object.keys(wavesurfer.regions.list)[0]].end.toFixed(2);
    //     // const originalBuffer = wavesurfer.backend.buffer;
    //     // var emptySegment = wavesurfer.backend.ac.createBuffer(
    //     //   originalBuffer.numberOfChannels,
    //     //   (end - start) * (originalBuffer.sampleRate * 1),
    //     //   originalBuffer.sampleRate
    //     // );
    //     // for (var i = 0; i < originalBuffer.numberOfChannels; i++) {
    //     //   var chanData = originalBuffer.getChannelData(i);
    //     //   var segmentChanData = emptySegment.getChannelData(i);
    //     //   for (var j = 0, len = chanData.length; j < end * originalBuffer.sampleRate; j++) {
    //     //     segmentChanData[j] = chanData[j + (start * originalBuffer.sampleRate)];
    //     //   }
    //     // }
    //     // wavesurfer.loadDecodedBuffer(emptySegment);
    //   }
    // };

    // initializeTimeline();
  }, [url, randomColor, regionUpdate, leftTrack, setLeftTrack]);

  return { waveform, timeline };
};

export default useWaveform;
