"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Eye, ChevronLeft, ChevronRight, Play, Pause, Compass, ShoppingBag } from "lucide-react";

export default function VirtualGallery3D({ artworks, onSelectArtwork, onAddToCart, isInCart }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentStop, setCurrentStop] = useState(0);
  const [isAutoTour, setIsAutoTour] = useState(false);
  const [activeArtwork, setActiveArtwork] = useState(null);
  const [hoveredArt, setHoveredArt] = useState(null);

  const stops = [
    {
      name: "Gallery Grand Hall Entrance",
      camPos: { x: 0, y: 2.2, z: 22 },
      camLook: { x: 0, y: 2.2, z: 0 },
      artIndex: null
    },
    {
      name: "East Wing: Celestial Resonance",
      camPos: { x: 2.8, y: 2.4, z: 14.5 },
      camLook: { x: 5.8, y: 2.5, z: 14.5 },
      artIndex: 0
    },
    {
      name: "West Wing: Fractured Monolith IV & Bust",
      camPos: { x: -2.8, y: 2.3, z: 9 },
      camLook: { x: -5.8, y: 2.4, z: 9 },
      artIndex: 1
    },
    {
      name: "Central Salon: Hyper-Synthetic Dreamscape",
      camPos: { x: 2.6, y: 2.4, z: 3.5 },
      camLook: { x: 5.8, y: 2.4, z: 3.5 },
      artIndex: 2
    },
    {
      name: "Atelier Centerpiece: Nocturne in Ochre & Zinc",
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

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0f14);
    scene.fog = new THREE.FogExp2(0x0e0f14, 0.022);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.1, 100);
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

    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.55);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111218, 0.35);
    scene.add(hemiLight);

    const corridorLength = 46;
    const corridorWidth = 12;
    const corridorHeight = 6;

    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      roughness: 0.28,
      metalness: 0.15
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 5);
    floor.receiveShadow = true;
    scene.add(floor);

    const ceilGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilMat = new THREE.MeshStandardMaterial({
      color: 0x181a24,
      roughness: 0.8
    });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, corridorHeight, 5);
    scene.add(ceil);

    const stripMat = new THREE.MeshBasicMaterial({ color: 0xfff6dd });
    const stripGeo = new THREE.PlaneGeometry(0.24, corridorLength);

    const leftStrip = new THREE.Mesh(stripGeo, stripMat);
    leftStrip.rotation.x = Math.PI / 2;
    leftStrip.position.set(-2.8, corridorHeight - 0.02, 5);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(stripGeo, stripMat);
    rightStrip.rotation.x = Math.PI / 2;
    rightStrip.position.set(2.8, corridorHeight - 0.02, 5);
    scene.add(rightStrip);

    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xdedcd6,
      roughness: 0.88,
      metalness: 0.02
    });

    const leftWallGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-corridorWidth / 2, corridorHeight / 2, 5);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWallGeo = new THREE.PlaneGeometry(corridorLength, corridorHeight);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(corridorWidth / 2, corridorHeight / 2, 5);
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const backWallGeo = new THREE.PlaneGeometry(corridorWidth, corridorHeight);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, corridorHeight / 2, -corridorLength / 2 + 5);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const textureLoader = new THREE.TextureLoader();
    const artworkMeshes = [];

    const artworkPlacements = [
      {
        art: artworks[0],
        pos: [corridorWidth / 2 - 0.05, 2.8, 14.5],
        rot: [0, -Math.PI / 2, 0],
        size: [3.4, 2.6]
      },
      {
        art: artworks[1],
        pos: [-corridorWidth / 2 + 0.05, 2.8, 9],
        rot: [0, Math.PI / 2, 0],
        size: [3.2, 2.5]
      },
      {
        art: artworks[2],
        pos: [corridorWidth / 2 - 0.05, 2.8, 3.5],
        rot: [0, -Math.PI / 2, 0],
        size: [3.4, 2.6]
      },
      {
        art: artworks[3] || artworks[0],
        pos: [0, 2.8, -corridorLength / 2 + 5.08],
        rot: [0, 0, 0],
        size: [4.2, 3.2]
      }
    ];

    artworkPlacements.forEach((item, idx) => {
      const group = new THREE.Group();
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);

      const frameGeo = new THREE.BoxGeometry(item.size[0] + 0.35, item.size[1] + 0.35, 0.12);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x111215, roughness: 0.3, metalness: 0.3 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.castShadow = true;
      group.add(frame);

      const mattingGeo = new THREE.PlaneGeometry(item.size[0] + 0.14, item.size[1] + 0.14);
      const mattingMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f4, roughness: 0.9 });
      const matting = new THREE.Mesh(mattingGeo, mattingMat);
      matting.position.z = 0.065;
      group.add(matting);

      const canvasGeo = new THREE.PlaneGeometry(item.size[0], item.size[1]);
      const artTex = textureLoader.load(item.art.image);
      artTex.colorSpace = THREE.SRGBColorSpace;
      const canvasMat = new THREE.MeshStandardMaterial({
        map: artTex,
        roughness: 0.4
      });
      const artMesh = new THREE.Mesh(canvasGeo, canvasMat);
      artMesh.position.z = 0.07;
      artMesh.userData = { artwork: item.art, index: idx };
      group.add(artMesh);
      artworkMeshes.push(artMesh);

      const spot = new THREE.SpotLight(0xfffaee, 4.5, 9, Math.PI / 4, 0.45, 1.2);
      spot.position.set(0, 2.2, 1.8);
      spot.target = artMesh;
      group.add(spot);
      group.add(spot.target);

      const bulbGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.25, 16);
      const bulbMat = new THREE.MeshStandardMaterial({ color: 0x22242e });
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(0, 2.2, 1.8);
      bulb.rotation.x = Math.PI / 4;
      group.add(bulb);

      scene.add(group);
    });

    const pedestalGeo = new THREE.BoxGeometry(1.2, 1.3, 1.2);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x12141c, roughness: 0.35 });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.set(-3.2, 0.65, 9);
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    const bustGroup = new THREE.Group();
    bustGroup.position.set(-3.2, 1.3, 9);

    const bustMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ee,
      roughness: 0.3,
      metalness: 0.1
    });

    const headGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const head = new THREE.Mesh(headGeo, bustMat);
    head.position.y = 0.55;
    head.scale.set(0.85, 1.15, 0.95);
    bustGroup.add(head);

    const torsoGeo = new THREE.CylinderGeometry(0.18, 0.38, 0.45, 20);
    const torso = new THREE.Mesh(torsoGeo, bustMat);
    torso.position.y = 0.22;
    bustGroup.add(torso);

    const basePedGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.08, 20);
    const basePed = new THREE.Mesh(basePedGeo, bustMat);
    bustGroup.add(basePed);

    bustGroup.userData = { artwork: artworks[1] || artworks[0], isBust: true };
    scene.add(bustGroup);
    artworkMeshes.push(head);

    const createVisitorFigure = (x, z, rotY) => {
      const fig = new THREE.Group();
      fig.position.set(x, 0, z);
      fig.rotation.y = rotY;

      const clothMat = new THREE.MeshStandardMaterial({ color: 0x1e222d, roughness: 0.8 });
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xc89d7c, roughness: 0.6 });

      const legsGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.9, 12);
      const legs = new THREE.Mesh(legsGeo, clothMat);
      legs.position.y = 0.45;
      fig.add(legs);

      const coatGeo = new THREE.CylinderGeometry(0.22, 0.28, 0.85, 14);
      const coat = new THREE.Mesh(coatGeo, clothMat);
      coat.position.y = 1.15;
      fig.add(coat);

      const fHeadGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const fHead = new THREE.Mesh(fHeadGeo, skinMat);
      fHead.position.y = 1.68;
      fig.add(fHead);

      const hairGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const hairMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
      const hair = new THREE.Mesh(hairGeo, hairMat);
      hair.position.set(0, 1.72, -0.02);
      fig.add(hair);

      scene.add(fig);
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

    const handleWheel = (e) => {
      e.preventDefault();
      if (Math.abs(e.deltaY) > 20) {
        if (e.deltaY > 0) {
          goToNextStop();
        } else {
          goToPrevStop();
        }
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e) => {
      if (e.changedTouches.length > 0) {
        const delta = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(delta) > 35) {
          if (delta > 0) {
            goToNextStop();
          } else {
            goToPrevStop();
          }
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("click", handlePointerClick);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd, { passive: true });

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
        if (now - lastAutoTime > 5500) {
          lastAutoTime = now;
          const next = (currentStopRef.current + 1) % stops.length;
          setStopIndex(next);
        }
      }

      camera.position.lerp(targetCamPosRef.current, 0.045);
      currentCamLookRef.current.lerp(targetCamLookRef.current, 0.045);
      camera.lookAt(currentCamLookRef.current);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("click", handlePointerClick);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      renderer.dispose();
    };
  }, [artworks]);

  const setStopIndex = (index) => {
    setCurrentStop(index);
    const stop = stops[index];
    targetCamPosRef.current.set(stop.camPos.x, stop.camPos.y, stop.camPos.z);
    targetCamLookRef.current.set(stop.camLook.x, stop.camLook.y, stop.camLook.z);
    setActiveArtwork(stop.artIndex !== null ? artworks[stop.artIndex] : null);
  };

  const goToNextStop = () => {
    const next = (currentStop + 1) % stops.length;
    setStopIndex(next);
  };

  const goToPrevStop = () => {
    const prev = (currentStop - 1 + stops.length) % stops.length;
    setStopIndex(prev);
  };

  const currentStopData = stops[currentStop];
  const spotlightArt = activeArtwork || (currentStopData.artIndex !== null ? artworks[currentStopData.artIndex] : null);

  return (
    <div 
      ref={containerRef} 
      style={{
        position: "relative",
        width: "100%",
        height: "88vh",
        minHeight: "600px",
        overflow: "hidden",
        borderRadius: "24px",
        border: "1px solid var(--border-subtle)",
        background: "#0a0b10",
        boxShadow: "0 25px 70px -10px rgba(0, 0, 0, 0.95)"
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          width: "100%",
          height: "100%",
          display: "block"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px"
        }}
      >
        <div style={{
          background: "rgba(9, 10, 15, 0.88)",
          backdropFilter: "blur(14px)",
          border: "1px solid var(--border-active)",
          borderRadius: "999px",
          padding: "8px 20px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.6)"
        }}>
          <Compass size={16} color="var(--gold-primary)" />
          <span style={{ fontSize: "0.85rem", color: "#fff", fontWeight: 600, letterSpacing: "0.04em" }}>
            3D Virtual Gallery Tour
          </span>
          <span style={{ fontSize: "0.74rem", color: "var(--gold-primary)", paddingLeft: "4px" }}>
            Hall {currentStop + 1} / {stops.length}
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <button
          onClick={() => setIsAutoTour(!isAutoTour)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: isAutoTour ? "var(--gold-primary)" : "rgba(9, 10, 15, 0.88)",
            color: isAutoTour ? "#090a0f" : "#fff",
            border: isAutoTour ? "none" : "1px solid var(--border-subtle)",
            borderRadius: "999px",
            padding: "8px 18px",
            fontSize: "0.82rem",
            fontWeight: 600,
            backdropFilter: "blur(12px)",
            transition: "var(--transition)"
          }}
        >
          {isAutoTour ? <Pause size={15} /> : <Play size={15} />}
          <span>{isAutoTour ? "Pause Tour" : "Auto Walkthrough"}</span>
        </button>
      </div>

      {hoveredArt && hoveredArt.id !== spotlightArt?.id && (
        <div
          style={{
            position: "absolute",
            bottom: "100px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(9, 10, 15, 0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--gold-primary)",
            borderRadius: "14px",
            padding: "10px 22px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
            pointerEvents: "none"
          }}
        >
          <Eye size={16} color="var(--gold-primary)" />
          <div>
            <div style={{ fontSize: "0.86rem", color: "#fff", fontWeight: 600 }}>{hoveredArt.title}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--gold-primary)" }}>{hoveredArt.artist} &bull; ${hoveredArt.price.toLocaleString()}</div>
          </div>
          <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", paddingLeft: "8px" }}>Click to Inspect</span>
        </div>
      )}

      {spotlightArt && (
        <div
          className="gallery-spotlight-card"
          style={{
            position: "absolute",
            bottom: "24px",
            left: "24px",
            zIndex: 10,
            background: "rgba(9, 10, 15, 0.9)",
            backdropFilter: "blur(18px)",
            border: "1px solid var(--border-active)",
            borderRadius: "16px",
            padding: "18px 24px",
            maxWidth: "420px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.7)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span className={`tag-badge tag-${spotlightArt.category}`} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
              {spotlightArt.categoryLabel}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{spotlightArt.year}</span>
          </div>

          <h3 style={{ fontSize: "1.3rem", color: "#fff", lineHeight: "1.2", marginBottom: "4px" }}>
            {spotlightArt.title}
          </h3>

          <p style={{ fontSize: "0.85rem", color: "var(--gold-primary)", marginBottom: "14px", fontWeight: 500 }}>
            {spotlightArt.artist} &bull; <span style={{ color: "#fff", fontWeight: 600 }}>${spotlightArt.price.toLocaleString()}</span>
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onSelectArtwork(spotlightArt)}
              className="btn-gold"
              style={{ padding: "8px 18px", fontSize: "0.82rem" }}
            >
              <Eye size={14} />
              Inspect Piece
            </button>
            <button
              onClick={() => onAddToCart(spotlightArt)}
              className="btn-secondary"
              style={{ padding: "8px 14px", fontSize: "0.82rem" }}
              title="Add to Acquisition Inquiry"
            >
              <ShoppingBag size={14} />
              {isInCart ? "In Portfolio" : "Acquire"}
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <button
          onClick={goToPrevStop}
          aria-label="Previous Artwork Wing"
          style={{
            width: "44px",
            height: "44px",
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
          <ChevronLeft size={20} />
        </button>

        <div style={{
          display: "flex",
          gap: "6px",
          background: "rgba(9, 10, 15, 0.85)",
          padding: "8px 12px",
          borderRadius: "999px",
          border: "1px solid var(--border-subtle)",
          backdropFilter: "blur(12px)"
        }}>
          {stops.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setStopIndex(idx)}
              style={{
                width: currentStop === idx ? "20px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: currentStop === idx ? "var(--gold-primary)" : "rgba(255, 255, 255, 0.25)",
                transition: "all 0.3s ease"
              }}
              aria-label={`Jump to Gallery Stop ${idx + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNextStop}
          aria-label="Next Artwork Wing"
          style={{
            width: "44px",
            height: "44px",
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
          <ChevronRight size={20} />
        </button>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .gallery-spotlight-card {
            max-width: calc(100% - 48px) !important;
            bottom: 80px !important;
            padding: 14px 18px !important;
          }
        }
      `}</style>
    </div>
  );
}
