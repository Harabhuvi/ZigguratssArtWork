"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Eye, ChevronLeft, ChevronRight, Play, Pause, Compass, ShoppingBag } from "lucide-react";

export default function VirtualGallery3D({ artworks, onSelectArtwork, onAddToCart, isInCart }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentStop, setCurrentStop] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [activeArtwork, setActiveArtwork] = useState(null);
  const [hoveredArt, setHoveredArt] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const stops = [
    {
      name: "Gallery Grand Hall",
      camPos: { x: 0, y: 2.2, z: 22 },
      camLook: { x: 0, y: 2.2, z: 0 },
      artIndex: null
    },
    {
      name: "East Wing — Celestial Resonance",
      camPos: { x: 2.8, y: 2.4, z: 14.5 },
      camLook: { x: 5.8, y: 2.5, z: 14.5 },
      artIndex: 0
    },
    {
      name: "West Wing — Fractured Monolith",
      camPos: { x: -2.8, y: 2.3, z: 9 },
      camLook: { x: -5.8, y: 2.4, z: 9 },
      artIndex: 1
    },
    {
      name: "Central Salon — Dreamscape",
      camPos: { x: 2.6, y: 2.4, z: 3.5 },
      camLook: { x: 5.8, y: 2.4, z: 3.5 },
      artIndex: 2
    },
    {
      name: "Atelier Centerpiece",
      camPos: { x: 0, y: 2.3, z: -4 },
      camLook: { x: 0, y: 2.3, z: -11 },
      artIndex: 3
    }
  ];

  const currentStopRef = useRef(0);
  const isAutoTourRef = useRef(false);
  const targetCamPosRef = useRef(new THREE.Vector3(0, 2.2, 22));
  const targetCamLookRef = useRef(new THREE.Vector3(0, 2.2, 0));
  const currentCamLookRef = useRef(new THREE.Vector3(0, 2.2, 0));

  useEffect(() => {
    currentStopRef.current = currentStop;
  }, [currentStop]);

  useEffect(() => {
    isAutoTourRef.current = isAutoTour;
  }, [isAutoTour]);

  const setStopIndex = useCallback((index) => {
    setCurrentStop(index);
    const stop = stops[index];
    targetCamPosRef.current.set(stop.camPos.x, stop.camPos.y, stop.camPos.z);
    targetCamLookRef.current.set(stop.camLook.x, stop.camLook.y, stop.camLook.z);
    setActiveArtwork(stop.artIndex !== null ? artworks[stop.artIndex] : null);
  }, [artworks]);

  const goToNextStop = useCallback(() => {
    const next = (currentStopRef.current + 1) % stops.length;
    setStopIndex(next);
  }, [setStopIndex]);

  const goToPrevStop = useCallback(() => {
    const prev = (currentStopRef.current - 1 + stops.length) % stops.length;
    setStopIndex(prev);
  }, [setStopIndex]);

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0f14);
    scene.fog = new THREE.FogExp2(0x0e0f14, 0.02);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 22);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111218, 0.4);
    scene.add(hemiLight);

    const corridorLength = 46;
    const corridorWidth = 12;
    const corridorHeight = 6;

    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x14161f, roughness: 0.28, metalness: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 5);
    floor.receiveShadow = true;
    scene.add(floor);

    const ceilGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.8 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, corridorHeight, 5);
    scene.add(ceil);

    const stripMat = new THREE.MeshBasicMaterial({ color: 0xfff6dd });
    const leftStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.24, corridorLength), stripMat);
    leftStrip.rotation.x = Math.PI / 2;
    leftStrip.position.set(-2.8, corridorHeight - 0.02, 5);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.24, corridorLength), stripMat);
    rightStrip.rotation.x = Math.PI / 2;
    rightStrip.position.set(2.8, corridorHeight - 0.02, 5);
    scene.add(rightStrip);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xdedcd6, roughness: 0.88, metalness: 0.02 });

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(corridorLength, corridorHeight), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, corridorHeight / 2, 5);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(corridorLength, corridorHeight), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(corridorWidth / 2, corridorHeight / 2, 5);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(corridorWidth, corridorHeight), wallMat);
    backWall.position.set(0, corridorHeight / 2, -corridorLength / 2 + 5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const textureLoader = new THREE.TextureLoader();
    const artworkMeshes = [];

    const artworkPlacements = [
      { art: artworks[0], pos: [corridorWidth / 2 - 0.05, 2.8, 14.5], rot: [0, -Math.PI / 2, 0], size: [3.4, 2.6] },
      { art: artworks[1], pos: [-corridorWidth / 2 + 0.05, 2.8, 9], rot: [0, Math.PI / 2, 0], size: [3.2, 2.5] },
      { art: artworks[2], pos: [corridorWidth / 2 - 0.05, 2.8, 3.5], rot: [0, -Math.PI / 2, 0], size: [3.4, 2.6] },
      { art: artworks[3] || artworks[0], pos: [0, 2.8, -corridorLength / 2 + 5.08], rot: [0, 0, 0], size: [4.2, 3.2] }
    ];

    artworkPlacements.forEach((item) => {
      if (!item.art) return;
      const group = new THREE.Group();
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(item.size[0] + 0.35, item.size[1] + 0.35, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.3, metalness: 0.3 })
      );
      frame.castShadow = true;
      group.add(frame);

      const matting = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size[0] + 0.14, item.size[1] + 0.14),
        new THREE.MeshStandardMaterial({ color: 0xf6f6f4, roughness: 0.9 })
      );
      matting.position.z = 0.065;
      group.add(matting);

      const placeholder = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size[0], item.size[1]),
        new THREE.MeshStandardMaterial({ color: 0x1a1c26, roughness: 0.9 })
      );
      placeholder.position.z = 0.07;
      group.add(placeholder);

      const spotIntensity = 3.2;
      const spotLight = new THREE.SpotLight(0xfff5e0, spotIntensity, 12, Math.PI / 7, 0.4);
      spotLight.position.set(0, 4.5, 2.5);
      spotLight.target = frame;
      spotLight.castShadow = true;
      group.add(spotLight);
      group.add(spotLight.target);

      group.userData.artwork = item.art;
      artworkMeshes.push(group);
      scene.add(group);

      if (item.art.image) {
        textureLoader.load(item.art.image, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          placeholder.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
        });
      }
    });

    const createVisitorFigure = (x, z, rotY) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotY;

      const bodyGeo = new THREE.CylinderGeometry(0.22, 0.28, 1.55, 8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c1e28, roughness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.78;
      body.castShadow = true;
      group.add(body);

      const headGeo = new THREE.SphereGeometry(0.2, 10, 10);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.position.y = 1.72;
      head.castShadow = true;
      group.add(head);

      scene.add(group);
    };

    createVisitorFigure(3.2, 14.8, -Math.PI / 2.2);
    createVisitorFigure(-1.8, 3.8, Math.PI / 1.8);
    createVisitorFigure(0.8, -2.5, Math.PI);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(artworkMeshes, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root && !root.userData.artwork && root.parent) {
          root = root.parent;
        }
        if (root && root.userData.artwork) {
          setHoveredArt(root.userData.artwork);
          canvas.style.cursor = "pointer";
          return;
        }
      }
      setHoveredArt(null);
      canvas.style.cursor = "default";
    };

    const handlePointerClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(artworkMeshes, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root && !root.userData.artwork && root.parent) {
          root = root.parent;
        }
        if (root && root.userData.artwork) {
          onSelectArtwork(root.userData.artwork);
        }
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length > 0) {
        const dx = touchStartX - e.changedTouches[0].clientX;
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dx) > Math.abs(dy) * 1.5 && Math.abs(dx) > 50) {
          if (dx > 0) {
            goToNextStop();
          } else {
            goToPrevStop();
          }
        }
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") goToNextStop();
      if (e.key === "ArrowLeft") goToPrevStop();
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("click", handlePointerClick);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    let lastAutoTime = Date.now();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (isAutoTourRef.current) {
        const now = Date.now();
        if (now - lastAutoTime > 5000) {
          lastAutoTime = now;
          const next = (currentStopRef.current + 1) % stops.length;
          setStopIndex(next);
        }
      }

      camera.position.lerp(targetCamPosRef.current, 0.065);
      currentCamLookRef.current.lerp(targetCamLookRef.current, 0.065);
      camera.lookAt(currentCamLookRef.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("click", handlePointerClick);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
    };
  }, [artworks, goToNextStop, goToPrevStop, setStopIndex]);

  const currentStopData = stops[currentStop];
  const spotlightArt = activeArtwork || (currentStopData.artIndex !== null ? artworks[currentStopData.artIndex] : null);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isMobileView ? "65vw" : "82vh",
        minHeight: isMobileView ? "320px" : "520px",
        maxHeight: "860px",
        overflow: "hidden",
        borderRadius: "clamp(14px, 3vw, 24px)",
        border: "1px solid var(--border-subtle)",
        background: "#0a0b10",
        boxShadow: "0 25px 70px -10px rgba(0, 0, 0, 0.95)",
        touchAction: "pan-y"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          touchAction: "pan-y"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "16px",
          left: "16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <div style={{
          background: "rgba(9, 10, 15, 0.88)",
          backdropFilter: "blur(14px)",
          border: "1px solid var(--border-active)",
          borderRadius: "999px",
          padding: "7px 16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.6)"
        }}>
          <Compass size={14} color="var(--gold-primary)" />
          <span style={{ fontSize: "clamp(0.72rem, 2vw, 0.84rem)", color: "#fff", fontWeight: 600 }}>
            {isMobileView ? `${currentStop + 1}/${stops.length}` : currentStopData.name}
          </span>
          {!isMobileView && (
            <span style={{ fontSize: "0.72rem", color: "var(--gold-primary)", paddingLeft: "4px" }}>
              {currentStop + 1} / {stops.length}
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <button
          onClick={() => setIsAutoTour(!isAutoTour)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: isAutoTour ? "var(--gold-primary)" : "rgba(9, 10, 15, 0.88)",
            color: isAutoTour ? "#090a0f" : "#fff",
            border: isAutoTour ? "none" : "1px solid var(--border-subtle)",
            borderRadius: "999px",
            padding: "7px 14px",
            fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
            fontWeight: 600,
            backdropFilter: "blur(12px)",
            transition: "var(--transition)",
            minHeight: "36px"
          }}
        >
          {isAutoTour ? <Pause size={14} /> : <Play size={14} />}
          {!isMobileView && <span>{isAutoTour ? "Pause" : "Auto Tour"}</span>}
        </button>
      </div>

      {hoveredArt && hoveredArt.id !== spotlightArt?.id && (
        <div
          style={{
            position: "absolute",
            bottom: "90px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(9, 10, 15, 0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--gold-primary)",
            borderRadius: "12px",
            padding: "8px 18px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            pointerEvents: "none",
            whiteSpace: "nowrap"
          }}
        >
          <Eye size={14} color="var(--gold-primary)" />
          <div>
            <div style={{ fontSize: "0.84rem", color: "#fff", fontWeight: 600 }}>{hoveredArt.title}</div>
            <div style={{ fontSize: "0.73rem", color: "var(--gold-primary)" }}>${hoveredArt.price.toLocaleString()}</div>
          </div>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", paddingLeft: "6px" }}>Click to view</span>
        </div>
      )}

      {spotlightArt && (
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            zIndex: 10,
            background: "rgba(9, 10, 15, 0.9)",
            backdropFilter: "blur(18px)",
            border: "1px solid var(--border-active)",
            borderRadius: "14px",
            padding: isMobileView ? "12px 16px" : "16px 22px",
            maxWidth: isMobileView ? "calc(100% - 100px)" : "380px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.7)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <span className={`tag-badge tag-${spotlightArt.category}`} style={{ fontSize: "0.68rem", padding: "2px 8px" }}>
              {spotlightArt.categoryLabel}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{spotlightArt.year}</span>
          </div>

          <h3 style={{ fontSize: isMobileView ? "1rem" : "1.2rem", color: "#fff", lineHeight: "1.2", marginBottom: "4px" }}>
            {spotlightArt.title}
          </h3>

          <p style={{ fontSize: "0.82rem", color: "var(--gold-primary)", marginBottom: "12px", fontWeight: 500 }}>
            {spotlightArt.artist} &bull; <span style={{ color: "#fff", fontWeight: 600 }}>${spotlightArt.price.toLocaleString()}</span>
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onSelectArtwork(spotlightArt)}
              className="btn-gold"
              style={{ padding: "7px 16px", fontSize: "0.78rem", minHeight: "36px" }}
            >
              <Eye size={13} />
              View
            </button>
            <button
              onClick={() => onAddToCart(spotlightArt)}
              className="btn-secondary"
              style={{ padding: "7px 12px", fontSize: "0.78rem", minHeight: "36px" }}
            >
              <ShoppingBag size={13} />
              {isInCart ? "Added" : "Acquire"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "16px",
          right: "16px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}
      >
        <button
          onClick={goToPrevStop}
          aria-label="Previous wing"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(9, 10, 15, 0.88)",
            border: "1px solid var(--border-subtle)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(12px)",
            transition: "var(--transition)"
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <div style={{
          display: "flex",
          gap: "5px",
          background: "rgba(9, 10, 15, 0.85)",
          padding: "7px 10px",
          borderRadius: "999px",
          border: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)"
        }}>
          {stops.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStopIndex(idx)}
              style={{
                width: currentStop === idx ? "18px" : "7px",
                height: "7px",
                borderRadius: "999px",
                background: currentStop === idx ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.22)",
                transition: "all 0.3s ease"
              }}
              aria-label={`Go to stop ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNextStop}
          aria-label="Next wing"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "rgba(9, 10, 15, 0.88)",
            border: "1px solid var(--border-subtle)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(12px)",
            transition: "var(--transition)"
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {!isMobileView && (
        <div style={{
          position: "absolute",
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.08em",
          pointerEvents: "none",
          textTransform: "uppercase",
          whiteSpace: "nowrap"
        }}>
          ← → arrows or swipe to navigate
        </div>
      )}
    </div>
  );
}
