// peerz.tsx
import React, { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { QRCodeCanvas as QRCode } from "qrcode.react";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";

const resizableHandleStyles = css`
  .ResizableHandle {
    background-color: #e2e8f0;
    transition: background-color 0.2s ease;
  }
  .ResizableHandle:hover {
    background-color: #94a3b8;
  }
`;
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const MainDisplay: React.FC = () => {
  const [connections, setConnections] = useState<string[]>([]);
  const [availableQRCode, setAvailableQRCode] = useState<string>("");
  const peerInstance = useRef<Peer | null>(null);
  const remoteVideosRef = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  useEffect(() => {
    const peer = new Peer(uuidv4());
    peerInstance.current = peer;

    peer.on("open", (id) => {
      console.log("Main display peer ID is: " + id);
      generateNewQRCode();
    });

    peer.on("connection", (conn) => {
      conn.on("open", () => {
        setConnections((prev) => [...prev, conn.peer]);
        generateNewQRCode();
      });

      conn.on("close", () => {
        setConnections((prev) => prev.filter((peerId) => peerId !== conn.peer));
      });
    });

    peer.on("call", handleIncomingCall);

    return () => {
      peer.destroy();
    };
  }, []);

  const generateNewQRCode = () => {
    const newPeerId = uuidv4();
    const currentUrl = `${window.location.origin}${window.location.pathname}?peerId=${peerInstance.current?.id}&joinId=${newPeerId}`;
    setAvailableQRCode(currentUrl);
  };

  const handleIncomingCall = (call: any) => {
    call.answer();
    call.on("stream", (remoteStream: MediaStream) => {
      const video = remoteVideosRef.current[call.peer];
      if (video) {
        video.srcObject = remoteStream;
      }
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden" css={resizableHandleStyles}>
      <ResizablePanelGroup direction="horizontal">
        {connections.map((peerId, index) => (
          <React.Fragment key={peerId}>
            {index > 0 && <ResizableHandle />}
            <ResizablePanel defaultSize={100 / connections.length}>
              <video ref={(el) => (remoteVideosRef.current[peerId] = el)} autoPlay playsInline className="object-cover w-full h-full" />
            </ResizablePanel>
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
      <div className="fixed bottom-5 right-5 bg-white bg-opacity-80 p-2.5">
        <QRCode value={availableQRCode} size={128} />
      </div>
    </div>
  );
};

const UserDevice: React.FC = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const peerInstance = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [minZoom, setMinZoom] = useState<number>(1);
  const [maxZoom, setMaxZoom] = useState<number>(5);
  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const [isControlsExpanded, setIsControlsExpanded] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mainPeerId = urlParams.get("peerId");
    const joinId = urlParams.get("joinId");

    if (mainPeerId && joinId) {
      const peer = new Peer(joinId);
      peerInstance.current = peer;

      peer.on("open", () => {
        const conn = peer.connect(mainPeerId);
        conn.on("open", () => {
          initiateCall(mainPeerId);
        });
      });
    }

    return () => {
      peerInstance.current?.destroy();
    };
  }, []);

  const initiateCall = async (mainPeerId: string) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(mediaStream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      const videoTrack = mediaStream.getVideoTracks()[0];
      videoTrackRef.current = videoTrack;

      const capabilities = videoTrack.getCapabilities();
      if ("zoom" in capabilities) {
        setMinZoom(capabilities.zoom.min || 1);
        setMaxZoom(capabilities.zoom.max || 5);
      }

      if (peerInstance.current) {
        peerInstance.current.call(mainPeerId, mediaStream);
      }
    } catch (err) {
      console.error("Failed to get local stream", err);
    }
  };

  const handleZoomChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newZoom = parseFloat(event.target.value);
    setZoom(newZoom);
    applyZoom(newZoom);
  };

  const applyZoom = async (zoomLevel: number) => {
    if (videoTrackRef.current) {
      const capabilities = videoTrackRef.current.getCapabilities();
      if ("zoom" in capabilities) {
        try {
          await videoTrackRef.current.applyConstraints({
            advanced: [{ zoom: zoomLevel }],
          });
        } catch (error) {
          console.error("Failed to apply zoom:", error);
        }
      } else {
        console.warn("Zoom is not supported on this device");
      }
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    await initiateCall(peerInstance.current?.id || "");
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-black">
      <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      <div className={`absolute top-5 right-5 bg-black bg-opacity-50 rounded-lg overflow-hidden transition-all duration-300 ease-in-out ${isControlsExpanded ? "w-[300px] p-2.5" : "w-10 h-10"}`}>
        <button onClick={() => setIsControlsExpanded(!isControlsExpanded)} className={`w-10 h-10 bg-transparent text-white border-none text-xl cursor-pointer ${isControlsExpanded ? "absolute top-1 right-1" : ""}`}>
          {isControlsExpanded ? "×" : "☰"}
        </button>
        {isControlsExpanded && (
          <div className="flex flex-col items-start mt-8">
            <div className="flex items-center mb-2.5">
              <label htmlFor="zoom" className="text-white mr-2.5">
                Zoom:{" "}
              </label>
              <input id="zoom" type="range" min={minZoom} max={maxZoom} step={0.1} value={zoom} onChange={handleZoomChange} className="w-24" />
              <span className="text-white ml-2.5">{zoom.toFixed(1)}x</span>
            </div>
            <button onClick={switchCamera} className="bg-white bg-opacity-20 text-white border-none py-1 px-2.5 rounded cursor-pointer">
              Switch Camera
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoChatApp: React.FC = () => {
  const isMainDisplay = !window.location.search.includes("peerId");

  return isMainDisplay ? <MainDisplay /> : <UserDevice />;
};

export default VideoChatApp;
