"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { Eye, Play, Pause, Compass, ShoppingBag, RotateCcw, Sparkles } from "lucide-react";

export default function VirtualGallery3D({ artworks, onSelectArtwork, onAddToCart, isInCart }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCinematic, setIsCinematic] = useState(true);
  const [activeArtwork, setActiveArtwork] = useState(null);
  const [hoveredArt, setHoveredArt] = useState(null);
  const [isMobileView, setIsMobileView] = useState(false);

  const cameraPosRef = useRef({ x: 0, y: 2.3, z: 24 });
  const cameraLookRef = useRef({ x: 0, y: 2.3, z: 0 });
  const targetLookRef = useRef({ x: 0, y: 2.3, z: 0 });
  const tweenRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const rotationAngleRef = useRef(0);

  const resetToEntrance = useCallback(() => {
    setActiveArtwork(null);
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.timeline();
    tweenRef.current.to(cameraPosRef.current, {
      x: 0,
      y: 2.3,
      z: 22,
      duration: 1.8,
      ease: "power2.inOut"
    });
    tweenRef.current.to(targetLookRef.current, {
      x: 0,
      y: 2.3,
      z: 0,
      duration: 1.8,
      ease: "power2.inOut"
    }, "<");
  }, []);

  const focusOnArtwork = useCallback((artwork, targetPos, lookTarget) => {
    setActiveArtwork(artwork);
    if (tweenRef.current) tweenRef.current.kill();
    tweenRef.current = gsap.timeline();
    tweenRef.current.to(cameraPosRef.current, {
      x: targetPos.x,
      y: targetPos.y,
      z: targetPos.z,
      duration: 1.6,
      ease: "power3.out"
    });
    tweenRef.current.to(targetLookRef.current, {
      x: lookTarget.x,
      y: lookTarget.y,
      z: lookTarget.z,
      duration: 1.6,
      ease: "power3.out"
    }, "<");
  }, []);

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
    scene.background = new THREE.Color(0x0a0b10);
    scene.fog = new THREE.FogExp2(0x0a0b10, 0.018);

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);
    camera.position.set(cameraPosRef.current.x, cameraPosRef.current.y, cameraPosRef.current.z);

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

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111218, 0.45);
    scene.add(hemiLight);

    const corridorLength = 52;
    const corridorWidth = 13;
    const corridorHeight = 6.4;

    const floorGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x13151f,
      roughness: 0.22,
      metalness: 0.18
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 5);
    floor.receiveShadow = true;
    scene.add(floor);

    const ceilGeo = new THREE.PlaneGeometry(corridorWidth, corridorLength);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x161822, roughness: 0.85 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, corridorHeight, 5);
    scene.add(ceil);

    const stripMat = new THREE.MeshBasicMaterial({ color: 0xfff6dd });
    const leftStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.26, corridorLength), stripMat);
    leftStrip.rotation.x = Math.PI / 2;
    leftStrip.position.set(-3.2, corridorHeight - 0.02, 5);
    scene.add(leftStrip);

    const rightStrip = new THREE.Mesh(new THREE.PlaneGeometry(0.26, corridorLength), stripMat);
    rightStrip.rotation.x = Math.PI / 2;
    rightStrip.position.set(3.2, corridorHeight - 0.02, 5);
    scene.add(rightStrip);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0xe0ddd7, roughness: 0.9, metalness: 0.02 });

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
      {
        art: artworks[0],
        pos: [corridorWidth / 2 - 0.06, 2.9, 15],
        rot: [0, -Math.PI / 2, 0],
        size: [3.5, 2.6],
        cameraTarget: { x: 3.0, y: 2.5, z: 15 },
        lookTarget: { x: corridorWidth / 2, y: 2.8, z: 15 }
      },
      {
        art: artworks[1],
        pos: [-corridorWidth / 2 + 0.06, 2.9, 9],
        rot: [0, Math.PI / 2, 0],
        size: [3.4, 2.6],
        cameraTarget: { x: -3.0, y: 2.5, z: 9 },
        lookTarget: { x: -corridorWidth / 2, y: 2.8, z: 9 }
      },
      {
        art: artworks[2],
        pos: [corridorWidth / 2 - 0.06, 2.9, 3],
        rot: [0, -Math.PI / 2, 0],
        size: [3.5, 2.6],
        cameraTarget: { x: 3.0, y: 2.5, z: 3 },
        lookTarget: { x: corridorWidth / 2, y: 2.8, z: 3 }
      },
      {
        art: artworks[3] || artworks[0],
        pos: [-corridorWidth / 2 + 0.06, 2.9, -3],
        rot: [0, Math.PI / 2, 0],
        size: [3.4, 2.6],
        cameraTarget: { x: -3.0, y: 2.5, z: -3 },
        lookTarget: { x: -corridorWidth / 2, y: 2.8, z: -3 }
      },
      {
        art: artworks[4] || artworks[1],
        pos: [0, 3.1, -corridorLength / 2 + 5.1],
        rot: [0, 0, 0],
        size: [4.4, 3.2],
        cameraTarget: { x: 0, y: 2.6, z: -corridorLength / 2 + 12 },
        lookTarget: { x: 0, y: 3.0, z: -corridorLength / 2 + 5 }
      }
    ];

    artworkPlacements.forEach((item) => {
      if (!item.art) return;
      const group = new THREE.Group();
      group.position.set(...item.pos);
      group.rotation.set(...item.rot);

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(item.size[0] + 0.38, item.size[1] + 0.38, 0.12),
        new THREE.MeshStandardMaterial({ color: 0x0f1015, roughness: 0.25, metalness: 0.35 })
      );
      frame.castShadow = true;
      group.add(frame);

      const matting = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size[0] + 0.16, item.size[1] + 0.16),
        new THREE.MeshStandardMaterial({ color: 0xf5f4ee, roughness: 0.9 })
      );
      matting.position.z = 0.065;
      group.add(matting);

      const placeholder = new THREE.Mesh(
        new THREE.PlaneGeometry(item.size[0], item.size[1]),
        new THREE.MeshStandardMaterial({ color: 0x1b1d28, roughness: 0.85 })
      );
      placeholder.position.z = 0.07;
      group.add(placeholder);

      const spotLight = new THREE.SpotLight(0xfff4dc, 3.8, 14, Math.PI / 6.5, 0.45);
      spotLight.position.set(0, 4.6, 2.6);
      spotLight.target = frame;
      spotLight.castShadow = true;
      group.add(spotLight);
      group.add(spotLight.target);

      group.userData.artwork = item.art;
      group.userData.cameraTarget = item.cameraTarget;
      group.userData.lookTarget = item.lookTarget;
      artworkMeshes.push(group);
      scene.add(group);

      if (item.art.image) {
        textureLoader.load(item.art.image, (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          placeholder.material = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 });
        });
      }
    });

    const createSculptureExhibit = (x, z) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);

      const pedestalGeo = new THREE.BoxGeometry(1.2, 1.25, 1.2);
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x101117, roughness: 0.3, metalness: 0.2 });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = 0.625;
      pedestal.castShadow = true;
      pedestal.receiveShadow = true;
      group.add(pedestal);

      const bustGeo = new THREE.DodecahedronGeometry(0.55, 1);
      const bustMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.2, metalness: 0.65 });
      const bust = new THREE.Mesh(bustGeo, bustMat);
      bust.position.y = 1.6;
      bust.castShadow = true;
      group.add(bust);

      const bustLight = new THREE.PointLight(0xe2b170, 2.2, 7);
      bustLight.position.set(0, 2.8, 0);
      group.add(bustLight);

      scene.add(group);
    };

    createSculptureExhibit(-2.8, 14.8);
    createSculptureExhibit(2.8, 8.8);

    const createVisitorFigure = (x, z, rotY) => {
      const group = new THREE.Group();
      group.position.set(x, 0, z);
      group.rotation.y = rotY;

      const bodyGeo = new THREE.CylinderGeometry(0.24, 0.28, 1.6, 8);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x181a24, roughness: 0.8 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.8;
      body.castShadow = true;
      group.add(body);

      const headGeo = new THREE.SphereGeometry(0.21, 10, 10);
      const head = new THREE.Mesh(headGeo, bodyMat);
      head.position.y = 1.76;
      head.castShadow = true;
      group.add(head);

      scene.add(group);
    };

    createVisitorFigure(2.4, 13.5, -Math.PI / 2.3);
    createVisitorFigure(-2.2, 4.2, Math.PI / 1.9);
    createVisitorFigure(0.9, -1.8, Math.PI);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingRef.current) {
        const deltaX = (e.clientX - dragStartRef.current.x) * 0.003;
        rotationAngleRef.current += deltaX;
        dragStartRef.current.x = e.clientX;
        targetLookRef.current.x = Math.sin(rotationAngleRef.current) * 8;
        targetLookRef.current.z = cameraPosRef.current.z - Math.cos(rotationAngleRef.current) * 8;
        return;
      }

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
      canvas.style.cursor = "grab";
    };

    const handlePointerDown = (e) => {
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = "grabbing";
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    const handleClick = (e) => {
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
          focusOnArtwork(root.userData.artwork, root.userData.cameraTarget, root.userData.lookTarget);
        }
      }
    };

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("click", handleClick);

    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (isCinematic && !activeArtwork && !isDraggingRef.current) {
        const cycleProgress = (Math.sin(elapsedTime * 0.14) + 1) / 2;
        const targetZ = THREE.MathUtils.lerp(22, -10, cycleProgress);
        const swayX = Math.sin(elapsedTime * 0.35) * 1.4;

        cameraPosRef.current.z = THREE.MathUtils.lerp(cameraPosRef.current.z, targetZ, 0.03);
        cameraPosRef.current.x = THREE.MathUtils.lerp(cameraPosRef.current.x, swayX, 0.03);
        cameraPosRef.current.y = 2.3 + Math.sin(elapsedTime * 0.7) * 0.06;

        targetLookRef.current.x = Math.sin(elapsedTime * 0.28) * 2.8;
        targetLookRef.current.y = 2.4;
        targetLookRef.current.z = cameraPosRef.current.z - 8;
      }

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraPosRef.current.x, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraPosRef.current.y, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, cameraPosRef.current.z, 0.08);

      cameraLookRef.current.x = THREE.MathUtils.lerp(cameraLookRef.current.x, targetLookRef.current.x, 0.08);
      cameraLookRef.current.y = THREE.MathUtils.lerp(cameraLookRef.current.y, targetLookRef.current.y, 0.08);
      cameraLookRef.current.z = THREE.MathUtils.lerp(cameraLookRef.current.z, targetLookRef.current.z, 0.08);

      camera.lookAt(cameraLookRef.current.x, cameraLookRef.current.y, cameraLookRef.current.z);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("click", handleClick);
      if (tweenRef.current) tweenRef.current.kill();
      renderer.dispose();
    };
  }, [artworks, focusOnArtwork, isCinematic, activeArtwork]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: isMobileView ? "68vw" : "82vh",
        minHeight: isMobileView ? "320px" : "540px",
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
          gap: "10px",
          flexWrap: "wrap"
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
          <Sparkles size={14} color="var(--gold-primary)" />
          <span style={{ fontSize: "clamp(0.72rem, 2vw, 0.84rem)", color: "#fff", fontWeight: 600 }}>
            3D Atelier Exhibition Hall
          </span>
        </div>

        <button
          onClick={resetToEntrance}
          className="btn-secondary"
          style={{
            padding: "6px 14px",
            fontSize: "0.78rem",
            minHeight: "34px",
            borderRadius: "999px"
          }}
          title="Return to Grand Entrance"
        >
          <RotateCcw size={13} />
          <span>Reset View</span>
        </button>
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
          onClick={() => {
            setIsCinematic(!isCinematic);
            if (activeArtwork) setActiveArtwork(null);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: isCinematic ? "var(--gold-primary)" : "rgba(9, 10, 15, 0.88)",
            color: isCinematic ? "#090a0f" : "#fff",
            border: isCinematic ? "none" : "1px solid var(--border-subtle)",
            borderRadius: "999px",
            padding: "8px 16px",
            fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
            fontWeight: 600,
            backdropFilter: "blur(12px)",
            transition: "var(--transition)",
            minHeight: "36px"
          }}
        >
          {isCinematic ? <Pause size={14} /> : <Play size={14} />}
          <span>{isCinematic ? "Cinematic Glide Active" : "Resume Cinematic Glide"}</span>
        </button>
      </div>

      {hoveredArt && hoveredArt.id !== activeArtwork?.id && (
        <div
          style={{
            position: "absolute",
            bottom: "32px",
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
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", paddingLeft: "6px" }}>Click to focus</span>
        </div>
      )}

      {activeArtwork && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            zIndex: 20,
            background: "rgba(9, 10, 15, 0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--border-active)",
            borderRadius: "16px",
            padding: isMobileView ? "14px 18px" : "18px 24px",
            maxWidth: isMobileView ? "calc(100% - 40px)" : "400px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.85)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
            <span className={`tag-badge tag-${activeArtwork.category}`} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
              {activeArtwork.categoryLabel}
            </span>
            <button
              onClick={() => resetToEntrance()}
              style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}
            >
              Close
            </button>
          </div>

          <h3 style={{ fontSize: isMobileView ? "1.05rem" : "1.25rem", color: "#fff", lineHeight: "1.2", marginBottom: "4px" }}>
            {activeArtwork.title}
          </h3>

          <p style={{ fontSize: "0.84rem", color: "var(--gold-primary)", marginBottom: "14px", fontWeight: 500 }}>
            {activeArtwork.artist} &bull; <span style={{ color: "#fff", fontWeight: 600 }}>${activeArtwork.price.toLocaleString()} USD</span>
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => onSelectArtwork(activeArtwork)}
              className="btn-gold"
              style={{ padding: "8px 18px", fontSize: "0.82rem", minHeight: "38px" }}
            >
              <Eye size={14} />
              Inspect Masterwork
            </button>
            <button
              onClick={() => onAddToCart(activeArtwork)}
              className="btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.82rem", minHeight: "38px" }}
            >
              <ShoppingBag size={14} />
              {isInCart ? "In Portfolio" : "Acquire"}
            </button>
          </div>
        </div>
      )}

      {!isMobileView && !activeArtwork && (
        <div style={{
          position: "absolute",
          bottom: "16px",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.45)",
          letterSpacing: "0.06em",
          pointerEvents: "none",
          background: "rgba(9, 10, 15, 0.6)",
          padding: "5px 14px",
          borderRadius: "999px",
          backdropFilter: "blur(8px)",
          whiteSpace: "nowrap"
        }}>
          Click any canvas on wall to approach &bull; Drag to rotate 3D view
        </div>
      )}
    </div>
  );
}
