import { Header } from "@/components/layout/header";
import { CollaborativeCanvas } from "@/components/workspace/collaborative-canvas";

export const metadata = {
  title: "Workspaces | AI Creative Suite",
  description: "Collaborate in real-time with infinite canvas and shared creative spaces",
};

export default function WorkspacePage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Workspace" />
      <div className="flex-1 overflow-hidden">
        <CollaborativeCanvas />
      </div>
    </div>
  );
}
