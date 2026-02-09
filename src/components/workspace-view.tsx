import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, RefreshCw, ExternalLink } from "lucide-react";

interface WorkspaceViewProps {
  appName: string;
  onBack: () => void;
}

export function WorkspaceView({ appName, onBack }: WorkspaceViewProps) {
  const [loading, setLoading] = useState(true);
  const codeSpaceId = `c-${appName}`;
  const liveUrl = `https://testing.spike.land/live/${codeSpaceId}`;

  const refreshIframe = () => {
    setLoading(true);
    const iframe = document.querySelector<HTMLIFrameElement>("#workspace-iframe");
    if (iframe) iframe.src = liveUrl;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3 bg-card shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{appName}</h1>
        <Badge variant="secondary">{codeSpaceId}</Badge>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={refreshIframe}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open workspace
            </a>
          </Button>
        </div>
      </div>

      {/* Iframe */}
      <div className="relative flex-1">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        )}
        <iframe
          id="workspace-iframe"
          src={liveUrl}
          className="w-full h-full border-0"
          allow="clipboard-read; clipboard-write"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}
