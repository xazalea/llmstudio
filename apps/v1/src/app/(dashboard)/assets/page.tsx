import { Header } from "@/components/layout/header";
import { AssetLibrary } from "@/components/assets/asset-library";

export const metadata = {
  title: "Asset Library | AI Creative Suite",
  description: "Browse and download free stock images, videos, vectors, fonts, and more",
};

export default function AssetsPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header title="Asset Library" />
      <div className="flex-1 overflow-hidden p-6">
        <AssetLibrary />
      </div>
    </div>
  );
}
