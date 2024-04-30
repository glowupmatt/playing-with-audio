import React, { useEffect } from "react";
import Wavesurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";

type Props = {
  waveform: React.MutableRefObject<Wavesurfer | null>;
};
const randomColor = () => {
  let color = [];
  for (let i = 0; i < 3; i++) {
    color.push(Math.floor(Math.random() * 256));
  }
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4)`;
};

const WaveFormRegions = ({ waveform }: Props) => {
  if (!waveform.current) return <>No WaveForm</>;
  let wsRegions: RegionsPlugin = waveform.current.registerPlugin(
    RegionsPlugin.create()
  );
  wsRegions = waveform.current.registerPlugin(RegionsPlugin.create());
  console.log(wsRegions, "wsRegions");
  waveform.current.on("decode", () => {
    if (waveform.current)
      wsRegions.addRegion({
        start: 0,
        end: waveform.current.getDuration(),
        content: "Resize me & drag me!",
        color: randomColor(),
        drag: false,
        resize: true,
        contentEditable: true,
      });
  });

  return <div id="waveform" className="flex flex-col gap-5" />;
};

export default WaveFormRegions;
