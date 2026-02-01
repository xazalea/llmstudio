import { Header } from "@/components/layout/header";
import { VideoEditor } from "@/components/editor/video-editor";

export const metadata = {
  title: "Video Editor | AI Creative Suite",
  description: "AI-powered video editing: trim, speed, effects, stabilization, and more",
};

export default function VideoEditorPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Video Editor" />
      <div className="flex-1 overflow-hidden p-6">
        <VideoEditor />
      </div>
    </div>
  );
}
