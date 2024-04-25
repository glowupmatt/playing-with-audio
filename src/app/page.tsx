"use client";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import WaveForm from "../components/WaveForm";
import RefactoredWaveform from "@/components/RefactoredWaveForm";

export default function Home() {
  return (
    <div>
      <h1>Audio Visualizer</h1>
      <RefactoredWaveform />
    </div>
  );
}
