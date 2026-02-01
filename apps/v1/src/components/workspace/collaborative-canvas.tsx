"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  PlusIcon, 
  ImageIcon, 
  TypeIcon,
  SquareIcon,
  MousePointerIcon,
  HandIcon,
  ZoomInIcon,
  ZoomOutIcon,
  TrashIcon,
  CopyIcon,
  LayersIcon,
  DownloadIcon,
  ShareIcon,
  UsersIcon,
  MessageSquareIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type CanvasTool = "select" | "pan" | "text" | "shape" | "image";

interface CanvasNode {
  id: string;
  type: "image" | "text" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  imageUrl?: string;
  color?: string;
}

const TOOLS: { id: CanvasTool; name: string; icon: React.ElementType }[] = [
  { id: "select", name: "Select", icon: MousePointerIcon },
  { id: "pan", name: "Pan", icon: HandIcon },
  { id: "text", name: "Text", icon: TypeIcon },
  { id: "shape", name: "Shape", icon: SquareIcon },
  { id: "image", name: "Image", icon: ImageIcon },
];

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
];

export function CollaborativeCanvas() {
  const [activeTool, setActiveTool] = useState<CanvasTool>("select");
  const [zoom, setZoom] = useState(100);
  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: "1",
      type: "image",
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      imageUrl: "https://picsum.photos/seed/workspace1/600/400",
    },
    {
      id: "2",
      type: "text",
      x: 450,
      y: 150,
      width: 200,
      height: 50,
      content: "Welcome to Workspace",
      color: "#8b5cf6",
    },
    {
      id: "3",
      type: "shape",
      x: 200,
      y: 350,
      width: 150,
      height: 150,
      color: "#3b82f6",
    },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [collaborators] = useState([
    { id: "1", name: "You", color: "#8b5cf6", cursor: { x: 300, y: 200 } },
    { id: "2", name: "Guest", color: "#22c55e", cursor: { x: 500, y: 350 } },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === "select") {
      setSelectedNode(null);
    } else if (activeTool === "text") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "text",
        x,
        y,
        width: 200,
        height: 40,
        content: "New Text",
        color: "#ffffff",
      };
      
      setNodes([...nodes, newNode]);
      setSelectedNode(newNode.id);
      setActiveTool("select");
    } else if (activeTool === "shape") {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newNode: CanvasNode = {
        id: crypto.randomUUID(),
        type: "shape",
        x,
        y,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };
      
      setNodes([...nodes, newNode]);
      setSelectedNode(newNode.id);
      setActiveTool("select");
    }
  };

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (activeTool === "select") {
      setSelectedNode(nodeId);
    }
  };

  const deleteSelectedNode = () => {
    if (selectedNode) {
      setNodes(nodes.filter(n => n.id !== selectedNode));
      setSelectedNode(null);
    }
  };

  return (
    <div className="flex h-full">
      {/* Left Toolbar */}
      <div className="w-14 flex-shrink-0 border-r border-white/10 bg-background p-2">
        <div className="flex flex-col gap-2">
          {TOOLS.map((tool) => (
            <Button
              key={tool.id}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "h-10 w-10",
                activeTool === tool.id && "bg-primary/20 text-primary"
              )}
              title={tool.name}
            >
              <tool.icon className="h-5 w-5" />
            </Button>
          ))}
          <div className="my-2 h-px bg-white/10" />
          <Button variant="ghost" size="icon" className="h-10 w-10" title="Add Image">
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <div className="flex items-center gap-4">
            <Input
              defaultValue="Untitled Workspace"
              className="w-64 border-0 bg-transparent text-lg font-medium focus-visible:ring-0"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Collaborators */}
            <div className="flex -space-x-2 mr-4">
              {collaborators.map((user) => (
                <div
                  key={user.id}
                  className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: user.color }}
                  title={user.name}
                >
                  {user.name[0]}
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm">
              <ShareIcon className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="gradient" size="sm">
              <DownloadIcon className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
          {/* Grid Background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Canvas Content */}
          <div
            ref={canvasRef}
            className="absolute inset-0"
            onClick={handleCanvasClick}
            style={{
              cursor: activeTool === "pan" ? "grab" : activeTool === "select" ? "default" : "crosshair",
            }}
          >
            {nodes.map((node) => (
              <div
                key={node.id}
                className={cn(
                  "absolute transition-shadow",
                  selectedNode === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.width,
                  height: node.height,
                }}
                onClick={(e) => handleNodeClick(e, node.id)}
              >
                {node.type === "image" && node.imageUrl && (
                  <Image
                    src={node.imageUrl}
                    alt=""
                    fill
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                )}
                {node.type === "text" && (
                  <div
                    className="flex items-center px-2 text-lg font-medium"
                    style={{ color: node.color }}
                  >
                    {node.content}
                  </div>
                )}
                {node.type === "shape" && (
                  <div
                    className="h-full w-full rounded-lg"
                    style={{ backgroundColor: node.color }}
                  />
                )}
              </div>
            ))}

            {/* Collaborator Cursors */}
            {collaborators.slice(1).map((user) => (
              <div
                key={user.id}
                className="absolute pointer-events-none transition-all duration-100"
                style={{
                  left: user.cursor.x,
                  top: user.cursor.y,
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={user.color}
                  className="drop-shadow-lg"
                >
                  <path d="M5.65376 12.4563L8.17283 19.9252C8.35 20.481 9.11 20.5495 9.38329 20.033L11.2824 16.5669L15.4974 20.7819C15.7903 21.0748 16.2651 21.0748 16.558 20.7819L20.7819 16.558C21.0748 16.2651 21.0748 15.7903 20.7819 15.4974L16.5669 11.2824L20.033 9.38329C20.5495 9.11 20.481 8.35 19.9252 8.17283L5.27325 3.04632C4.74866 2.88022 4.24974 3.37914 4.41584 3.90373L5.65376 12.4563Z" />
                </svg>
                <span
                  className="ml-4 -mt-1 rounded px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: user.color }}
                >
                  {user.name}
                </span>
              </div>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-white/10 bg-background/80 backdrop-blur p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
            >
              <ZoomOutIcon className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center text-sm">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
            >
              <ZoomInIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Panel - Properties */}
      {selectedNode && (
        <div className="w-64 flex-shrink-0 border-l border-white/10 bg-background p-4">
          <h3 className="font-medium mb-4">Properties</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Position</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={nodes.find(n => n.id === selectedNode)?.x || 0}
                  className="bg-white/5"
                  placeholder="X"
                />
                <Input
                  type="number"
                  value={nodes.find(n => n.id === selectedNode)?.y || 0}
                  className="bg-white/5"
                  placeholder="Y"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Size</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={nodes.find(n => n.id === selectedNode)?.width || 0}
                  className="bg-white/5"
                  placeholder="W"
                />
                <Input
                  type="number"
                  value={nodes.find(n => n.id === selectedNode)?.height || 0}
                  className="bg-white/5"
                  placeholder="H"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <CopyIcon className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-red-500 hover:text-red-400"
                onClick={deleteSelectedNode}
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
