import { Header } from "@/components/layout/header";
import { ImageGenerator } from "@/components/generation/image-generator";

export const metadata = {
  title: "Image Generation | AI Creative Suite",
  description: "Generate stunning AI images with multiple models - free and unlimited",
};

export default function ImageGenerationPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Image Generation" />
      <div className="flex-1 overflow-hidden p-6">
        <ImageGenerator />
      </div>
    </div>
  );
}
