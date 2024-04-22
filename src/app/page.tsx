import Image from "next/image";
import { Howl, Howler } from "howler";

export default function Home() {
  var sound = new Howl({
    src: ['sound.mp3']
  });
  
  sound.play();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Hello, World!</h1>
      <Image
        src="/images/nextjs.svg"
        alt="Next.js logo"
        width={300}
        height={300}
      />
    </main>
  );
}
