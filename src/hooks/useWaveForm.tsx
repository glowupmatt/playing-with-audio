import { useEffect, useRef } from "react";
import Wavesurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.esm.js";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { Region } from "wavesurfer.js/dist/plugins/regions.esm.js";

const useWaveform = (
  url: string,
  randomColor: () => string,
  audioMaxLength: number,
  setAudioMaxLength: (audioMaxLength: number) => void
) => {
  const timeline = useRef<TimelinePlugin | null>(null);
  const waveform = useRef<Wavesurfer | null>(null);

  useEffect(() => {
    const initializeTimeline = () => {
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
    };

    const initializeWaveSurfer = () => {
      if (timeline.current !== null) {
        waveform.current = Wavesurfer.create({
          container: "#waveform",
          waveColor: "rgba(200, 0, 200, 0.2)",
          progressColor: "rgba(100, 0, 100, 0.5)",
          url: url,
          plugins: [timeline.current],
        });
      }
    };

    const initializeRegions = () => {
      if (waveform.current !== null) {
        const wsRegions = waveform.current.registerPlugin(
          RegionsPlugin.create()
        );
        const zoomRegion = waveform.current.registerPlugin(
          ZoomPlugin.create({ maxZoom: 1000 })
        );
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
        });

        wsRegions.on("region-out", (region) => {
          if (activeRegion === region) {
            region.play();
          }
        });

        wsRegions.on("region-clicked", (region, e) => {
          e.stopPropagation();
          activeRegion = region;
          region.play();
          region.setOptions({ ...region, color: randomColor() });
        });

        wsRegions.on("region-updated", (region) => {
          if (waveform.current)
            waveform.current.zoom(region.end - region.start);
          console.log(region.start, region.end);
        });
      }
    };

    initializeTimeline();
    initializeWaveSurfer();
    initializeRegions();

    console.log(audioMaxLength);
  }, [audioMaxLength, url, randomColor, setAudioMaxLength]);

  return { waveform, timeline };
};

export default useWaveform;
