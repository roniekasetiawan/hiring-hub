"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

export default function CapturePage() {
  const [activePose] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const detectorRef = useRef<HandLandmarker | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);
  const [camError, setCamError] = useState<string | null>(null);

  const detectedRef = useRef(false);
  const [detected, setDetected] = useState(false);
  const holdStartRef = useRef<number | null>(null);
  const releaseStartRef = useRef<number | null>(null);
  const HOLD_MS = 650;
  const RELEASE_MS = 180;

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (e: any) {
        setCamError(e?.message ?? "Camera not available");
      }
    };

    const startDetector = async () => {
      const fileset = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm",
      );
      detectorRef.current = await HandLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        },
        numHands: 1,
        runningMode: "VIDEO",
      });
      loop();
    };

    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const detector = detectorRef.current;
      if (!video || !canvas || !detector) return;

      const now = performance.now();
      if (now - lastTsRef.current < 33) return;
      lastTsRef.current = now;

      if (canvas.width !== video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const results = detector.detectForVideo(video, now);
      const hands = results.landmarks ?? [];

      if (hands.length) {
        const lm = hands[0];

        const bbox = computeBBox(canvas, lm);
        const sbox = smoothBox(bbox);
        const okRaw = isTwoFingers(lm);

        if (okRaw) {
          if (holdStartRef.current === null) holdStartRef.current = now;
          releaseStartRef.current = null;
          if (!detectedRef.current && now - holdStartRef.current >= HOLD_MS) {
            detectedRef.current = true;
            setDetected(true);
          }
        } else {
          holdStartRef.current = null;
          if (releaseStartRef.current === null) releaseStartRef.current = now;
          if (
            detectedRef.current &&
            now - releaseStartRef.current >= RELEASE_MS
          ) {
            detectedRef.current = false;
            setDetected(false);
          }
        }

        drawBoxAndLabel(ctx, sbox, detectedRef.current);
        const drawing = new DrawingUtils(ctx);
        drawing.drawLandmarks(lm, { radius: 2 });
        drawing.drawConnectors(lm, HandLandmarker.HAND_CONNECTIONS);
      } else {
        holdStartRef.current = null;
        if (!releaseStartRef.current)
          releaseStartRef.current = performance.now();
        if (
          detectedRef.current &&
          performance.now() - releaseStartRef.current >= RELEASE_MS
        ) {
          detectedRef.current = false;
          setDetected(false);
        }
      }
    };

    startCamera().then(startDetector);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      detectorRef.current?.close();
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="relative px-6 pt-6 pb-3">
          <h2 className="text-2xl font-semibold text-slate-900">
            Raise Your Hand to Capture
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            We’ll take the photo once your hand pose is detected.
          </p>
          <button
            aria-label="Close"
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-slate-700 hover:bg-slate-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="relative aspect-video bg-[#0f172a]">
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 h-full w-full object-cover"
            style={{ transform: "scaleX(-1)" }}
          />
          <canvas ref={canvasRef} className="absolute inset-0" />
          {camError && (
            <div className="absolute inset-0 grid place-items-center text-sm text-white/80">
              {camError}
            </div>
          )}
        </div>

        <div className="border-t px-6 py-5 space-y-3">
          <p className="text-sm text-gray-600">
            To take a picture, follow the hand poses in the order shown below.
            The system will automatically capture the image once the final pose
            is detected.
          </p>

          <div className="flex items-center justify-center gap-3">
            <PoseStep
              src="/assets/images/fingers/default/third.png"
              label="Pose 3"
              active={activePose === 0}
            />
            <Arrow />
            <PoseStep
              src="/assets/images/fingers/default/second.png"
              label="Pose 2"
              active={activePose === 1}
            />
            <Arrow />
            <PoseStep
              src="/assets/images/fingers/default/first.png"
              label="Pose 1"
              active={activePose === 2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PoseStep({
  src,
  label,
  active,
}: {
  src: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`w-24 h-24 flex flex-col items-center justify-center rounded-md border transition-all ${active ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"}`}
    >
      <div className="w-20 h-20 relative">
        <Image src={src} alt={label} fill className="object-contain invert" />
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="flex items-center justify-center text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4l8 8-8 8" />
      </svg>
    </div>
  );
}

/* ===== Helpers ===== */

type Pt = { x: number; y: number };
type BBox = { x: number; y: number; w: number; h: number };

function isThreeFingers(lm: Pt[]) {
  const TIPS = [4, 8, 12, 16, 20];
  const PIPS = [3, 6, 10, 14, 18];
  const MCPS = [2, 5, 9, 13, 17];

  const indexUp = lm[TIPS[1]].y < lm[PIPS[1]].y;
  const middleUp = lm[TIPS[2]].y < lm[PIPS[2]].y;
  const ringUp = lm[TIPS[3]].y < lm[PIPS[3]].y;

  const pinkyDown = lm[TIPS[4]].y > lm[PIPS[4]].y;
  const thumbTucked = lm[TIPS[0]].y > lm[MCPS[1]].y;

  return indexUp && middleUp && ringUp && pinkyDown && thumbTucked;
}

function isTwoFingers(lm: Pt[]) {
  const distance = (p1: any, p2: any) => {
    return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
  };

  const WRIST = 0;
  const INDEX_TIP = 8,
    INDEX_PIP = 6;
  const MIDDLE_TIP = 12,
    MIDDLE_PIP = 10;
  const RING_TIP = 16,
    RING_MCP = 13;
  const PINKY_TIP = 20,
    PINKY_MCP = 17;

  const indexDist = distance(lm[INDEX_TIP], lm[WRIST]);
  const indexPipDist = distance(lm[INDEX_PIP], lm[WRIST]);
  const indexExtended = indexDist > indexPipDist * 1.02;

  const middleDist = distance(lm[MIDDLE_TIP], lm[WRIST]);
  const middlePipDist = distance(lm[MIDDLE_PIP], lm[WRIST]);
  const middleExtended = middleDist > middlePipDist * 1.02;

  const ringDist = distance(lm[RING_TIP], lm[WRIST]);
  const ringMcpDist = distance(lm[RING_MCP], lm[WRIST]);
  const ringCurled = ringDist < ringMcpDist * 1.15;

  const pinkyDist = distance(lm[PINKY_TIP], lm[WRIST]);
  const pinkyMcpDist = distance(lm[PINKY_MCP], lm[WRIST]);
  const pinkyCurled = pinkyDist < pinkyMcpDist * 1.15;

  return indexExtended && middleExtended && ringCurled && pinkyCurled;
}

function isOneFingers(lm: Pt[]) {
  const TIPS = [4, 8, 12, 16, 20];
  const PIPS = [3, 6, 10, 14, 18];
  const MCPS = [2, 5, 9, 13, 17];

  const indexUp = lm[TIPS[1]].y < lm[PIPS[1]].y;

  const middleDown = lm[TIPS[2]].y > lm[PIPS[2]].y;
  const ringDown = lm[TIPS[3]].y > lm[PIPS[3]].y;
  const pinkyDown = lm[TIPS[4]].y > lm[PIPS[4]].y;

  const thumbTipX = lm[TIPS[0]].x;
  const indexMcpX = lm[MCPS[1]].x;
  const pinkyMcpX = lm[MCPS[4]].x;

  const thumbTuckedX = (thumbTipX - indexMcpX) * (thumbTipX - pinkyMcpX) < 0;

  const thumbTuckedY = lm[TIPS[0]].y > lm[PIPS[0]].y;

  const thumbTucked = thumbTuckedX && thumbTuckedY;

  return indexUp && middleDown && ringDown && pinkyDown && thumbTucked;
}

function computeBBox(canvas: HTMLCanvasElement, lm: Pt[]): BBox {
  let minX = 1,
    minY = 1,
    maxX = 0,
    maxY = 0;
  for (const p of lm) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const pad = 12;
  const x = Math.max(0, minX * canvas.width - pad);
  const y = Math.max(0, minY * canvas.height - pad);
  const w = Math.min(canvas.width - x, (maxX - minX) * canvas.width + pad * 2);
  const h = Math.min(
    canvas.height - y,
    (maxY - minY) * canvas.height + pad * 2,
  );
  return { x, y, w, h };
}

function smoothBox(b: BBox): BBox {
  const prev: BBox = (smoothBox as any)._prev || b;
  const a = 0.18;
  const sb = {
    x: prev.x + (b.x - prev.x) * a,
    y: prev.y + (b.y - prev.y) * a,
    w: prev.w + (b.w - prev.w) * a,
    h: prev.h + (b.h - prev.h) * a,
  };
  (smoothBox as any)._prev = sb;
  return sb;
}

function drawBoxAndLabel(ctx: CanvasRenderingContext2D, b: BBox, ok: boolean) {
  ctx.lineWidth = 5;
  ctx.strokeStyle = ok ? "#22c55e" : "#ef4444";
  ctx.strokeRect(b.x, b.y, b.w, b.h);

  const label = ok ? "Pose 3" : "Undetected";
  ctx.font = "13px system-ui, -apple-system, Segoe UI, Roboto";
  const lw = ctx.measureText(label).width + 12;
  const lh = 22;
  const lx = b.x;
  const ly = Math.max(0, b.y - lh - 4);
  ctx.fillStyle = ok ? "#22c55e" : "#ef4444";
  ctx.fillRect(lx, ly, lw, lh);
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "middle";
  ctx.fillText(label, lx + 6, ly + lh / 2);
}
