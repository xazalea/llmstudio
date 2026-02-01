import { Header } from "@/components/layout/header";
import { ImageEditor } from "@/components/editor/image-editor";

export const metadata = {
  title: "Image Editor | AI Creative Suite",
  description: "AI-powered image editing: inpaint, upscale, background removal, and more",
};

export default function ImageEditorPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Image Editor" />
      <div className="flex-1 overflow-hidden p-6">
        <ImageEditor />
      </div>
    </div>
  );
}
