import WaveSurfer from "wavesurfer.js";

let newWaveForm = WaveSurfer.create({
  container: "#waveform",
  waveColor: "#46a6d8",
  progressColor: "#FFF",
  barWidth: 3,
  barGap: 2,
  height: 130,
  cursorWidth: 1,
  cursorColor: "white",
  normalize: true,
});
export default newWaveForm;
