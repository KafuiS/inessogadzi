"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* ============================================================
   PROJETS
============================================================ */

const PROJECTS = [
  "/projects/project-1.jpg",
  "/projects/project-2.jpg",
  "/projects/project-3.jpg",
  "/projects/project-4.jpg",
  "/projects/project-5.jpg",
  "/projects/project-6.jpg",
  "/projects/project-7.jpg",
  "/projects/project-8.jpg",
  "/projects/project-9.jpg",
  "/projects/project-10.jpg",
  "/projects/project-11.jpg",
  "/projects/project-12.jpg",
  "/projects/project-13.jpg",
  "/projects/project-14.jpg",
  "/projects/project-15.jpg",
  "/projects/project-16.jpg",
];

/* ============================================================
   GALERIE
============================================================ */

const PROJECT_COUNT = 108;
const IMAGE_SIZE = 155;
const STEP_X = 193;
const STEP_Y = 193;

const GALLERY_IMAGE_SCALE = 1;

/* ============================================================
   SPHÈRE
============================================================ */

const SPHERE_RADIUS = 2.7;
const PROJECT_SIZE = 0.56;
const SPHERE_RELAXATION_ITERATIONS = 80;
const SEGMENTS_X = 18;
const SEGMENTS_Y = 12;
const CAMERA_FOV = 58;

/* ============================================================
   TRANSITION
============================================================ */

const TRANSITION_DURATION = 1800;

/* ============================================================
   COURBURE GALERIE
============================================================ */

const GALLERY_CURVE_HORIZONTAL = 0.0000000001;
const GALLERY_CURVE_VERTICAL = 0.0000000001;

/* ============================================================
   GRAIN
============================================================ */

const GRAIN_CONTRAST = 1.0;
const GRAIN_SAMPLES = 3;
const GRAIN_OPACITY = 0.16;
const GRAIN_UPDATE_EVERY = 4;

/* ============================================================
   CURSEUR
============================================================ */

function CursorTrail(): React.JSX.Element {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let cursorX = mouseX;
    let cursorY = mouseY;

    let trailX = mouseX;
    let trailY = mouseY;

    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent): void => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = (): void => {
      cursorX += (mouseX - cursorX) * 0.42;
      cursorY += (mouseY - cursorY) * 0.42;

      trailX += (mouseX - trailX) * 0.16;
      trailY += (mouseY - trailY) * 0.16;

      const cursorElement = cursorRef.current;
      const trailElement = trailRef.current;

      if (cursorElement !== null) {
        cursorElement.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      if (trailElement !== null) {
        trailElement.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);

    animate();

    return (): void => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="custom-cursor-trail" aria-hidden="true" />

      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />

      <style jsx global>{`
        html,
        body,
        * {
          cursor: none !important;
        }

        .custom-cursor-trail {
          position: fixed;
          top: 0;
          left: 0;
          width: 92px;
          height: 92px;
          margin-left: -46px;
          margin-top: -46px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2147483646;
          background: rgba(255, 255, 255, 0.055);
          filter: blur(18px);
          transform: translate3d(-100px, -100px, 0);
          will-change: transform;
        }

        .custom-cursor {
          position: fixed;
          top: 0;
          left: 0;
          width: 13px;
          height: 13px;
          margin-left: -6.5px;
          margin-top: -6.5px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2147483647;
          background: rgba(255, 255, 255, 0.62);
          box-shadow:
            0 0 10px rgba(255, 255, 255, 0.14),
            0 0 24px rgba(255, 255, 255, 0.07);
          transform: translate3d(-100px, -100px, 0);
          will-change: transform;
        }

        @media (max-width: 900px) {
          html,
          body,
          * {
            cursor: auto !important;
          }

          .custom-cursor,
          .custom-cursor-trail {
            display: none;
          }
        }
      `}</style>
    </>
  );
}

/* ============================================================
   GRAIN AU-DESSUS DE TOUT
============================================================ */

function GrainOverlay(): React.JSX.Element | null {
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainCanvasRef.current;

    if (canvas === null) {
      return;
    }

    /*
     * IMPORTANT :
     *
     * Le canvas du grain est sorti du stacking context
     * de la page et ajouté directement au <body>.
     *
     * Il se trouve donc réellement au-dessus du canvas WebGL.
     */

    const body = document.body;

    if (canvas.parentElement !== body) {
      body.appendChild(canvas);
    }

    const context = canvas.getContext("2d");

    if (context === null) {
      return;
    }

    const ctx = context;

    let animationFrame = 0;
    let frameCounter = 0;
    let disposed = false;

    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    const resize = (): void => {
      if (disposed) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      /*
       * Le canvas travaille directement en pixels natifs.
       */
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      ctx.imageSmoothingEnabled = false;
    };

    const generateGrain = (): void => {
      if (disposed) {
        return;
      }

      if (canvas.width <= 0 || canvas.height <= 0) {
        return;
      }

      const grainImage = ctx.createImageData(canvas.width, canvas.height);

      const pixels = grainImage.data;

      /*
       * Même logique de génération que le grain
       * utilisé sur la galerie.
       *
       * Mais contrairement à la version précédente,
       * le grain est généré directement avec une alpha
       * contrôlée pixel par pixel.
       *
       * Le canvas lui-même reste donc transparent.
       */

      for (let i = 0; i < pixels.length; i += 4) {
        let value = 0;

        for (let sample = 0; sample < GRAIN_SAMPLES; sample += 1) {
          value += Math.random();
        }

        value /= GRAIN_SAMPLES;

        const centered = (value - 0.5) * 255;

        const luminance = Math.max(
          0,
          Math.min(255, Math.round(128 + centered * GRAIN_CONTRAST)),
        );

        pixels[i] = luminance;
        pixels[i + 1] = luminance;
        pixels[i + 2] = luminance;

        /*
         * Transparence réelle du pixel.
         *
         * Cela évite de dépendre uniquement de
         * mix-blend-mode pour rendre le grain visible.
         */
        pixels[i + 3] = Math.round(GRAIN_OPACITY * 255);
      }

      ctx.putImageData(grainImage, 0, 0);
    };

    const animate = (): void => {
      if (disposed) {
        return;
      }

      frameCounter += 1;

      if (frameCounter % GRAIN_UPDATE_EVERY === 0) {
        generateGrain();
      }

      animationFrame = window.requestAnimationFrame(animate);
    };

    /*
     * Initialisation immédiate.
     */
    resize();

    generateGrain();

    window.addEventListener("resize", resize);

    animationFrame = window.requestAnimationFrame(animate);

    return (): void => {
      disposed = true;

      window.cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);

      /*
       * On retire proprement le canvas du body.
       */
      if (canvas.parentElement === body) {
        body.removeChild(canvas);
      }
    };
  }, []);

  /*
   * Le canvas est créé avec un style inline afin que
   * son z-index ne dépende absolument pas de styled-jsx.
   *
   * 2147483640 = suffisamment haut pour passer au-dessus
   * du canvas Three.js, du contenu et des stacking contexts
   * ordinaires de la page.
   */
  return (
    <canvas
      ref={grainCanvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        display: "block",
        pointerEvents: "none",
        zIndex: 2147483640,
        opacity: 1,
        mixBlendMode: "screen",
        imageRendering: "pixelated",
        background: "transparent",
        transform: "translate3d(0, 0, 0)",
        backfaceVisibility: "hidden",
        isolation: "isolate",
      }}
    />
  );
}

/* ============================================================
   POSITION SPHÈRE
============================================================ */

type SpherePosition = {
  latitude: number;
  longitude: number;
};

function createInitialDirections(): THREE.Vector3[] {
  const directions: THREE.Vector3[] = [];

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < PROJECT_COUNT; index += 1) {
    const y = 1 - ((index + 0.5) / PROJECT_COUNT) * 2;

    const radius = Math.sqrt(Math.max(0, 1 - y * y));

    const theta = goldenAngle * index;

    directions.push(
      new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)),
    );
  }

  return directions;
}

/* ============================================================
   RELAXATION SPHÈRE
============================================================ */

function relaxSpherePoints(): THREE.Vector3[] {
  const points = createInitialDirections();

  const difference = new THREE.Vector3();
  const force = new THREE.Vector3();

  for (
    let iteration = 0;
    iteration < SPHERE_RELAXATION_ITERATIONS;
    iteration += 1
  ) {
    const strength = 0.075 * (1 - iteration / SPHERE_RELAXATION_ITERATIONS);

    const forces = points.map(() => new THREE.Vector3());

    for (let i = 0; i < points.length; i += 1) {
      const current = points[i];
      const currentForce = forces[i];

      if (current === undefined || currentForce === undefined) {
        continue;
      }

      for (let j = i + 1; j < points.length; j += 1) {
        const other = points[j];
        const otherForce = forces[j];

        if (other === undefined || otherForce === undefined) {
          continue;
        }

        difference.copy(current).sub(other);

        const distance = difference.length();

        if (distance < 0.000001) {
          continue;
        }

        const repulsion = 1 / (distance * distance);

        const tangentCurrent = difference.clone();

        tangentCurrent.sub(
          current.clone().multiplyScalar(difference.dot(current)),
        );

        const tangentOther = difference.clone().negate();

        tangentOther.sub(other.clone().multiplyScalar(tangentOther.dot(other)));

        currentForce.add(tangentCurrent.multiplyScalar(repulsion * strength));

        otherForce.add(tangentOther.multiplyScalar(repulsion * strength));
      }
    }

    for (let index = 0; index < points.length; index += 1) {
      const point = points[index];
      const pointForce = forces[index];

      if (point === undefined || pointForce === undefined) {
        continue;
      }

      force.copy(pointForce);

      point.add(force);

      point.normalize();
    }
  }

  return points;
}

/* ============================================================
   LATITUDE / LONGITUDE
============================================================ */

function createPositions(): SpherePosition[] {
  const directions = relaxSpherePoints();

  return directions.map((direction) => ({
    latitude: Math.asin(THREE.MathUtils.clamp(direction.y, -1, 1)),
    longitude: Math.atan2(direction.x, -direction.z),
  }));
}

/* ============================================================
   POINT SPHÈRE
============================================================ */

function getSpherePoint(
  radius: number,
  latitude: number,
  longitude: number,
): THREE.Vector3 {
  const cosLatitude = Math.cos(latitude);

  return new THREE.Vector3(
    radius * cosLatitude * Math.sin(longitude),

    radius * Math.sin(latitude),

    -radius * cosLatitude * Math.cos(longitude),
  );
}

/* ============================================================
   GÉOMÉTRIE COURBÉE
============================================================ */

function createCurvedGeometry(
  latitude: number,
  longitude: number,
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const center = getSpherePoint(SPHERE_RADIUS, latitude, longitude);

  const verticalAngle = PROJECT_SIZE / SPHERE_RADIUS;

  const cosLatitude = Math.max(Math.abs(Math.cos(latitude)), 0.45);

  const horizontalAngle = PROJECT_SIZE / (SPHERE_RADIUS * cosLatitude);

  for (let y = 0; y <= SEGMENTS_Y; y += 1) {
    const v = y / SEGMENTS_Y;

    const localLatitude = latitude + (v - 0.5) * verticalAngle;

    for (let x = 0; x <= SEGMENTS_X; x += 1) {
      const u = x / SEGMENTS_X;

      const localLongitude = longitude + (u - 0.5) * horizontalAngle;

      const worldPoint = getSpherePoint(
        SPHERE_RADIUS,
        localLatitude,
        localLongitude,
      );

      const localPoint = worldPoint.clone().sub(center);

      vertices.push(localPoint.x, localPoint.y, localPoint.z);

      uvs.push(u, 1 - v);
    }
  }

  const rowSize = SEGMENTS_X + 1;

  for (let y = 0; y < SEGMENTS_Y; y += 1) {
    for (let x = 0; x < SEGMENTS_X; x += 1) {
      const a = y * rowSize + x;

      const b = a + 1;

      const c = a + rowSize;

      const d = c + 1;

      indices.push(a, b, c);

      indices.push(b, d, c);
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  geometry.setIndex(indices);

  geometry.computeVertexNormals();

  return geometry;
}

/* ============================================================
   GÉOMÉTRIE PLATE
============================================================ */

function createFlatGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();

  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const half = PROJECT_SIZE / 2;

  for (let y = 0; y <= SEGMENTS_Y; y += 1) {
    const v = y / SEGMENTS_Y;

    for (let x = 0; x <= SEGMENTS_X; x += 1) {
      const u = x / SEGMENTS_X;

      vertices.push(-half + u * PROJECT_SIZE, half - v * PROJECT_SIZE, 0);

      uvs.push(u, v);
    }
  }

  const rowSize = SEGMENTS_X + 1;

  for (let y = 0; y < SEGMENTS_Y; y += 1) {
    for (let x = 0; x < SEGMENTS_X; x += 1) {
      const a = y * rowSize + x;

      const b = a + 1;

      const c = a + rowSize;

      const d = c + 1;

      indices.push(a, b, c);

      indices.push(b, d, c);
    }
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3),
  );

  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  geometry.setIndex(indices);

  geometry.computeVertexNormals();

  return geometry;
}

/* ============================================================
   TEXTURES
============================================================ */

function loadTexture(
  loader: THREE.TextureLoader,
  src: string,
): Promise<THREE.Texture | null> {
  return new Promise((resolve) => {
    loader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;

        texture.minFilter = THREE.LinearFilter;

        texture.magFilter = THREE.LinearFilter;

        texture.wrapS = THREE.ClampToEdgeWrapping;

        texture.wrapT = THREE.ClampToEdgeWrapping;

        texture.flipY = false;

        texture.needsUpdate = true;

        resolve(texture);
      },
      undefined,
      () => {
        console.warn(`Image impossible à charger : ${src}`);

        resolve(null);
      },
    );
  });
}

/* ============================================================
   ROTATIONS INITIALES
============================================================ */

const LOCAL_ROTATION_X = THREE.MathUtils.degToRad(4);

const LOCAL_ROTATION_Y = THREE.MathUtils.degToRad(4);

const LOCAL_ROTATION_Z = THREE.MathUtils.degToRad(6);

function getLocalRotation(index: number): THREE.Euler {
  return new THREE.Euler(
    Math.sin(index * 1.731) * LOCAL_ROTATION_X,

    Math.cos(index * 2.193) * LOCAL_ROTATION_Y,

    Math.sin(index * 2.871 + 1.2) * LOCAL_ROTATION_Z,
  );
}

/* ============================================================
   MODULO
============================================================ */

function modulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}

/* ============================================================
   MAPPING GALERIE
============================================================ */

function getGalleryImageIndex(
  column: number,
  row: number,
  imageCount: number,
): number {
  if (imageCount <= 1) {
    return 0;
  }

  const rowStep = imageCount >= 5 ? 3 : 2;

  return modulo(column - row * rowStep, imageCount);
}

/* ============================================================
   CELLULES GALERIE
============================================================ */

type GalleryCell = {
  column: number;
  row: number;
};

function createGalleryCells(width: number, height: number): GalleryCell[] {
  const columnsEachSide = Math.ceil(width / STEP_X / 2) + 5;

  const rowsEachSide = Math.ceil(height / STEP_Y / 2) + 5;

  const cells: GalleryCell[] = [];

  for (let row = -rowsEachSide; row <= rowsEachSide; row += 1) {
    for (
      let column = -columnsEachSide;
      column <= columnsEachSide;
      column += 1
    ) {
      cells.push({
        column,
        row,
      });
    }
  }

  return cells;
}

/* ============================================================
   CELLULES TRANSITION
============================================================ */

function createTransitionGalleryAssignments(
  width: number,
  height: number,
  meshImageIndices: number[],
  imageCount: number,
): GalleryCell[] {
  const assignments: GalleryCell[] = [];

  if (imageCount <= 0 || meshImageIndices.length === 0) {
    return assignments;
  }

  const allCells = createGalleryCells(width, height);

  const cellsByImage: GalleryCell[][] = Array.from(
    {
      length: imageCount,
    },
    () => [],
  );

  for (const cell of allCells) {
    const imageIndex = getGalleryImageIndex(cell.column, cell.row, imageCount);

    const bucket = cellsByImage[imageIndex];

    if (bucket !== undefined) {
      bucket.push(cell);
    }
  }

  const distanceToCenter = (cell: GalleryCell): number => {
    return cell.column * cell.column + cell.row * cell.row;
  };

  for (const bucket of cellsByImage) {
    bucket.sort((a, b) => distanceToCenter(a) - distanceToCenter(b));
  }

  const meshesByImage: number[][] = Array.from(
    {
      length: imageCount,
    },
    () => [],
  );

  meshImageIndices.forEach((imageIndex, meshIndex) => {
    const bucket = meshesByImage[imageIndex];

    if (bucket !== undefined) {
      bucket.push(meshIndex);
    }
  });

  for (let imageIndex = 0; imageIndex < imageCount; imageIndex += 1) {
    const meshBucket = meshesByImage[imageIndex];

    const cellBucket = cellsByImage[imageIndex];

    if (meshBucket === undefined || cellBucket === undefined) {
      continue;
    }

    const count = Math.min(meshBucket.length, cellBucket.length);

    for (let index = 0; index < count; index += 1) {
      const meshIndex = meshBucket[index];

      const cell = cellBucket[index];

      if (meshIndex === undefined || cell === undefined) {
        continue;
      }

      assignments[meshIndex] = cell;
    }
  }

  return assignments;
}

/* ============================================================
   POSITION ÉCRAN GALERIE
============================================================ */

type GalleryScreenPosition = {
  x: number;
  y: number;
};

function getGalleryScreenPosition(
  cell: GalleryCell,
  width: number,
  height: number,
): GalleryScreenPosition {
  let x = width / 2 + cell.column * STEP_X;

  let y = height / 2 + cell.row * STEP_Y;

  const centerX = width / 2;

  const centerY = height / 2;

  const dx = x - centerX;

  const dy = y - centerY;

  x += dx * Math.abs(dx) * GALLERY_CURVE_HORIZONTAL;

  y += dy * Math.abs(dy) * GALLERY_CURVE_VERTICAL;

  return {
    x,
    y,
  };
}

/* ============================================================
   ABOUT
============================================================ */

export default function About(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    /* ========================================================
       SCÈNE
    ======================================================== */

    const scene = new THREE.Scene();

    scene.background = new THREE.Color("#111111");

    /* ========================================================
       CAMÉRA
    ======================================================== */

    const camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      0.01,
      100,
    );

    camera.position.set(0, 0, 0);

    camera.lookAt(0, 0, -1);

    /* ========================================================
       RENDERER
    ======================================================== */

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    /* ========================================================
       GLOBE
    ======================================================== */

    const globe = new THREE.Group();

    scene.add(globe);

    /* ========================================================
       RESSOURCES
    ======================================================== */

    const textureLoader = new THREE.TextureLoader();

    const geometries: THREE.BufferGeometry[] = [];

    const flatGeometries: THREE.BufferGeometry[] = [];

    const materials: THREE.MeshBasicMaterial[] = [];

    const textures: THREE.Texture[] = [];

    const meshes: THREE.Mesh[] = [];

    let disposed = false;

    const positions = createPositions();

    let galleryImageCount = 0;

    /* ========================================================
       CRÉATION PROJETS
    ======================================================== */

    const createProjects = async (): Promise<void> => {
      const loadedTextures = await Promise.all(
        PROJECTS.map((src) => loadTexture(textureLoader, src)),
      );

      if (disposed) {
        loadedTextures.forEach((texture) => {
          texture?.dispose();
        });

        return;
      }

      const validTextures = loadedTextures.filter(
        (texture): texture is THREE.Texture => texture !== null,
      );

      if (validTextures.length === 0) {
        return;
      }

      galleryImageCount = validTextures.length;

      positions.forEach((position, index) => {
        const texture = validTextures[index % validTextures.length];

        if (texture === undefined) {
          return;
        }

        textures.push(texture);

        const geometry = createCurvedGeometry(
          position.latitude,
          position.longitude,
        );

        const flatGeometry = createFlatGeometry();

        geometries.push(geometry);

        flatGeometries.push(flatGeometry);

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 1,
          depthWrite: true,
          depthTest: true,
        });

        materials.push(material);

        const mesh = new THREE.Mesh(geometry, material);

        mesh.position.copy(
          getSpherePoint(SPHERE_RADIUS, position.latitude, position.longitude),
        );

        mesh.rotation.copy(getLocalRotation(index));

        mesh.userData.spherePosition = mesh.position.clone();

        mesh.userData.sphereRotation = mesh.rotation.clone();

        mesh.userData.index = index;

        mesh.userData.textureIndex = index % validTextures.length;

        mesh.userData.flatGeometry = flatGeometry;

        mesh.userData.startPosition = mesh.position.clone();

        mesh.userData.startRotation = mesh.rotation.clone();

        mesh.userData.startScale = new THREE.Vector3(1, 1, 1);

        mesh.userData.targetPosition = new THREE.Vector3();

        mesh.userData.targetRotation = new THREE.Euler(0, 0, 0);

        mesh.userData.targetScale = new THREE.Vector3(1, 1, 1);

        globe.add(mesh);

        meshes.push(mesh);
      });
    };

    void createProjects();

    /* ========================================================
       TRANSITION
    ======================================================== */

    let isTransitioning = false;
    let transitionStart = 0;
    let navigationStarted = false;

    function easeInOutCubic(value: number): number {
      if (value < 0.5) {
        return 4 * value * value * value;
      }

      return 1 - Math.pow(-2 * value + 2, 3) / 2;
    }

    /* ========================================================
       PIXELS -> MONDE
    ======================================================== */

    function screenToWorld(x: number, y: number): THREE.Vector3 {
      const depth = 2;

      const fovRadians = THREE.MathUtils.degToRad(CAMERA_FOV);

      const visibleHeight = 2 * Math.tan(fovRadians / 2) * depth;

      const visibleWidth = visibleHeight * camera.aspect;

      const worldX =
        ((x - window.innerWidth / 2) / window.innerWidth) * visibleWidth;

      const worldY =
        -((y - window.innerHeight / 2) / window.innerHeight) * visibleHeight;

      return new THREE.Vector3(worldX, worldY, -depth);
    }

    /* ========================================================
       DÉMARRAGE TRANSITION
    ======================================================== */

    const startTransition = (): void => {
      if (isTransitioning || navigationStarted) {
        return;
      }

      if (meshes.length === 0) {
        return;
      }

      if (galleryImageCount === 0) {
        return;
      }

      isTransitioning = true;

      transitionStart = performance.now();

      const meshImageIndices = meshes.map(
        (mesh) => (mesh.userData.textureIndex as number | undefined) ?? 0,
      );

      const galleryAssignments = createTransitionGalleryAssignments(
        window.innerWidth,
        window.innerHeight,
        meshImageIndices,
        galleryImageCount,
      );

      meshes.forEach((mesh, meshIndex) => {
        mesh.userData.startPosition = mesh.position.clone();

        mesh.userData.startRotation = mesh.rotation.clone();

        mesh.userData.startScale = mesh.scale.clone();

        const cell = galleryAssignments[meshIndex];

        const safeCell = cell ?? {
          column: 0,
          row: 0,
        };

        const screenPosition = getGalleryScreenPosition(
          safeCell,
          window.innerWidth,
          window.innerHeight,
        );

        mesh.userData.targetPosition = screenToWorld(
          screenPosition.x,
          screenPosition.y,
        );

        mesh.userData.targetRotation = new THREE.Euler(0, 0, 0);

        const fovRadians = THREE.MathUtils.degToRad(CAMERA_FOV);

        const visibleHeight = 2 * Math.tan(fovRadians / 2) * 2;

        const pixelsToWorld = visibleHeight / window.innerHeight;

        const targetSize = IMAGE_SIZE * GALLERY_IMAGE_SCALE * pixelsToWorld;

        const scale = targetSize / PROJECT_SIZE;

        mesh.userData.targetScale = new THREE.Vector3(scale, scale, scale);
      });

      setTransitioning(true);
    };

    /* ========================================================
       ANIMATION
    ======================================================== */

    let animationFrame = 0;
    let time = 0;

    const movementSpeed = 0.0011;

    const amplitudeY = 0.2;
    const amplitudeX = 0.12;
    const amplitudeZ = 0.055;

    const animate = (timestamp: number): void => {
      time += movementSpeed;

      if (!isTransitioning) {
        globe.rotation.y = Math.sin(time) * amplitudeY;

        globe.rotation.x = Math.sin(time * 0.73 + 1.7) * amplitudeX;

        globe.rotation.z = Math.sin(time * 0.51 + 3.2) * amplitudeZ;
      } else {
        globe.rotation.set(0, 0, 0);

        const elapsed = timestamp - transitionStart;

        const rawProgress = Math.min(1, elapsed / TRANSITION_DURATION);

        const progress = easeInOutCubic(rawProgress);

        meshes.forEach((mesh, meshIndex) => {
          const startPosition = mesh.userData.startPosition as
            | THREE.Vector3
            | undefined;

          const targetPosition = mesh.userData.targetPosition as
            | THREE.Vector3
            | undefined;

          const startRotation = mesh.userData.startRotation as
            | THREE.Euler
            | undefined;

          const targetRotation = mesh.userData.targetRotation as
            | THREE.Euler
            | undefined;

          const startScale = mesh.userData.startScale as
            | THREE.Vector3
            | undefined;

          const targetScale = mesh.userData.targetScale as
            | THREE.Vector3
            | undefined;

          if (
            startPosition === undefined ||
            targetPosition === undefined ||
            startRotation === undefined ||
            targetRotation === undefined ||
            startScale === undefined ||
            targetScale === undefined
          ) {
            return;
          }

          mesh.position.lerpVectors(startPosition, targetPosition, progress);

          mesh.rotation.x = THREE.MathUtils.lerp(
            startRotation.x,
            targetRotation.x,
            progress,
          );

          mesh.rotation.y = THREE.MathUtils.lerp(
            startRotation.y,
            targetRotation.y,
            progress,
          );

          mesh.rotation.z = THREE.MathUtils.lerp(
            startRotation.z,
            targetRotation.z,
            progress,
          );

          mesh.scale.lerpVectors(startScale, targetScale, progress);

          const curvedGeometry = geometries[meshIndex];

          const flatGeometry = mesh.userData.flatGeometry as
            | THREE.BufferGeometry
            | undefined;

          if (curvedGeometry === undefined || flatGeometry === undefined) {
            return;
          }

          const curvedPosition = curvedGeometry.getAttribute("position");

          const flatPosition = flatGeometry.getAttribute("position");

          const currentPosition = mesh.geometry.getAttribute("position");

          if (!curvedPosition || !flatPosition || !currentPosition) {
            return;
          }

          const curvedArray = curvedPosition.array as Float32Array | number[];

          const flatArray = flatPosition.array as Float32Array | number[];

          const currentArray = currentPosition.array as Float32Array | number[];

          const count = Math.min(
            curvedArray.length,
            flatArray.length,
            currentArray.length,
          );

          for (let i = 0; i < count; i += 1) {
            currentArray[i] = THREE.MathUtils.lerp(
              curvedArray[i] ?? 0,
              flatArray[i] ?? 0,
              progress,
            );
          }

          currentPosition.needsUpdate = true;

          const curvedUv = curvedGeometry.getAttribute("uv");

          const flatUv = flatGeometry.getAttribute("uv");

          const currentUv = mesh.geometry.getAttribute("uv");

          if (curvedUv && flatUv && currentUv) {
            const curvedUvArray = curvedUv.array as Float32Array | number[];

            const flatUvArray = flatUv.array as Float32Array | number[];

            const currentUvArray = currentUv.array as Float32Array | number[];

            const uvCount = Math.min(
              curvedUvArray.length,
              flatUvArray.length,
              currentUvArray.length,
            );

            for (let i = 0; i < uvCount; i += 1) {
              currentUvArray[i] = THREE.MathUtils.lerp(
                curvedUvArray[i] ?? 0,
                flatUvArray[i] ?? 0,
                progress,
              );
            }

            currentUv.needsUpdate = true;
          }
        });

        if (rawProgress >= 1 && !navigationStarted) {
          navigationStarted = true;

          window.setTimeout(() => {
            window.location.href = "/galerie";
          }, 80);
        }
      }

      renderer.render(scene, camera);

      animationFrame = window.requestAnimationFrame(animate);
    };

    /* ========================================================
       RESIZE
    ======================================================== */

    const resize = (): void => {
      const width = window.innerWidth;

      const height = window.innerHeight;

      camera.aspect = width / height;

      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    };

    window.addEventListener("resize", resize);

    resize();

    /* ========================================================
       EXPOSITION TRANSITION
    ======================================================== */

    (
      canvas as HTMLCanvasElement & {
        startAboutTransition?: () => void;
      }
    ).startAboutTransition = startTransition;

    animate(performance.now());

    /* ========================================================
       CLEANUP
    ======================================================== */

    return (): void => {
      disposed = true;

      window.cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);

      geometries.forEach((geometry) => {
        geometry.dispose();
      });

      flatGeometries.forEach((geometry) => {
        geometry.dispose();
      });

      materials.forEach((material) => {
        material.dispose();
      });

      new Set(textures).forEach((texture) => {
        texture.dispose();
      });

      renderer.dispose();
    };
  }, []);

  /* ==========================================================
     CLICK DÉCOUVRIR
  ========================================================== */

  const handleDiscover = (): void => {
    const canvas = canvasRef.current;

    if (canvas === null) {
      return;
    }

    const startTransition = (
      canvas as HTMLCanvasElement & {
        startAboutTransition?: () => void;
      }
    ).startAboutTransition;

    startTransition?.();
  };

  /* ==========================================================
     HTML
  ========================================================== */

  return (
    <>
      <CursorTrail />

      <main
        className={`${spaceGrotesk.className} about-page ${
          transitioning ? "is-transitioning" : ""
        }`}
      >
        {/* ==================================================
            SCÈNE THREE
        ================================================== */}

        <canvas ref={canvasRef} className="three-canvas" aria-hidden="true" />

        {/* ==================================================
            CONTENU
        ================================================== */}

        <a href="/" className="logo" aria-label="Accueil">
          <Image
            src="/projects/IS.png"
            alt="Logo"
            width={42}
            height={42}
            priority
          />
        </a>

        <section className="center">
          <div className="text">
            <p className="title">Portfolio d' Inès SOGADZI</p>

            <p className="description">
              Tout a commencé avec la mode : une passion devenue peu à peu une
              porte ouverte vers l’image, le design et la création.
              <br />
              <br />
              Au fil de mon parcours, j’ai appris à ne plus seulement créer,
              mais à penser les idées dans leur ensemble : de la direction
              artistique au marketing, de la création de contenu à la gestion de
              projet.
              <br />
              <br />
              Aujourd’hui, j’aime faire le lien entre stratégie et création,
              avec une même envie : transformer une seconde d’attention en
              véritable engagement.
              <br />
            </p>
          </div>

          <button
            type="button"
            className="discover"
            onClick={handleDiscover}
            disabled={transitioning}
          >
            DÉCOUVRIR
          </button>
        </section>

        {/* ==================================================
            GRAIN
           
            IMPORTANT :
            GrainOverlay n'est PAS rendu dans le stacking
            context du main. Le composant déplace son canvas
            directement dans document.body.
        ================================================== */}

        <GrainOverlay />
      </main>

      <style jsx>{`
        /* ==================================================
           PAGE
        ================================================== */

        .about-page {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: #111111;
          color: #ffffff;
          font-family: ${spaceGrotesk.style.fontFamily};
          font-style: normal;
          isolation: isolate;
        }

        /* ==================================================
           CANVAS THREE
        ================================================== */

        .three-canvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 5;
          pointer-events: none;
        }

        /* ==================================================
           LOGO
        ================================================== */

        .logo {
          position: fixed;
          top: 24px;
          left: 32px;
          width: 42px;
          height: 42px;
          z-index: 100;
          display: block;
        }

        .logo :global(img) {
          display: block;
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        /* ==================================================
           CENTRE
        ================================================== */

        .center {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 50;
          width: min(430px, 82vw);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          pointer-events: none;
          transition:
            opacity 400ms ease,
            transform 400ms ease;
        }

        .is-transitioning .center {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.96);
        }

        /* ==================================================
           TEXTE
        ================================================== */

        .text {
          font-family: ${spaceGrotesk.style.fontFamily};
          font-style: normal;
          font-size: 11px;
          line-height: 1.55;
          font-weight: 400;
          letter-spacing: 0.015em;
        }

        .text p {
          margin: 0;
          font-style: normal;
        }

        /* ==================================================
           TITRE
        ================================================== */

        .text .title {
          margin: 0;
          font-family: ${spaceGrotesk.style.fontFamily};
          font-size: 18px;
          line-height: 1.2;
          font-weight: 700;
          font-style: normal;
          letter-spacing: 0.01em;
        }

        /* ==================================================
           DESCRIPTION
        ================================================== */

        .text .description {
          margin-top: 18px;
          font-family: ${spaceGrotesk.style.fontFamily};
          font-size: 11px;
          line-height: 1.55;
          font-weight: 400;
          font-style: normal;
          letter-spacing: 0.015em;
        }

        /* ==================================================
           BOUTON
        ================================================== */

        .discover {
          margin-top: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 100px;
          height: 36px;
          padding: 0 14px;
          border: 0;
          border-radius: 4px;
          background: #777777;
          color: #ffffff;
          font-family:
            "Anton", Impact, Haettenschweiler, "Franklin Gothic Bold",
            "Arial Narrow", sans-serif;
          font-size: 16px;
          font-weight: 500;
          font-style: normal;
          letter-spacing: 0.025em;
          line-height: 1;
          cursor: pointer;
          pointer-events: auto;
          transition:
            opacity 180ms ease,
            transform 180ms ease,
            background 180ms ease;
        }

        .discover:hover {
          opacity: 0.8;
          transform: translateY(-2px);
          background: #808080;
        }

        .discover:disabled {
          pointer-events: none;
        }

        /* ==================================================
           TABLETTE
        ================================================== */

        @media (max-width: 900px) {
          .logo {
            top: 18px;
            left: 20px;
            width: 34px;
            height: 34px;
          }

          .logo :global(img) {
            width: 34px;
            height: 34px;
          }

          .text .title {
            font-size: 18px;
            font-weight: 700;
          }

          .text .description {
            font-size: 10px;
          }

          .discover {
            min-width: 94px;
            height: 34px;
            font-size: 15px;
          }
        }

        /* ==================================================
           MOBILE
        ================================================== */

        @media (max-width: 600px) {
          .logo {
            top: 16px;
            left: 18px;
            width: 32px;
            height: 32px;
          }

          .logo :global(img) {
            width: 32px;
            height: 32px;
          }

          .text .title {
            font-size: 18px;
            font-weight: 700;
          }

          .text .description {
            font-size: 8.5px;
          }

          .discover {
            margin-top: 20px;
            min-width: 88px;
            height: 32px;
            padding: 0 12px;
            font-size: 14px;
            border-radius: 3px;
          }
        }
      `}</style>
    </>
  );
}
