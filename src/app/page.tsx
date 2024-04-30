import React from "react";
import RefactoredWaveform from "@/components/RefactoredWaveForm";

export default function Home() {
  return (
    <div>
      <h1>Audio Visualizer</h1>
      {/* <WaveSurferReact /> */}
      <RefactoredWaveform />
    </div>
  );
}
