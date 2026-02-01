import { Header } from "@/components/layout/header";
import { VideoGenerator } from "@/components/generation/video-generator";

export const metadata = {
  title: "Video Generation | AI Creative Suite",
  description: "Generate AI videos with motion control - free and unlimited",
};

export default function VideoGenerationPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Video Generation" />
      <div className="flex-1 overflow-hidden p-6">
        <VideoGenerator />
      </div>
    </div>
  );
}
