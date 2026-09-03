"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/composants/header/header";

const BASE_PATH = "/inessogadzi";

const PROJECTS = 11;

/* ========================================================= GRILLE ========================================================= */
const IMAGE_SIZE = 155;
const GAP = 38;
const STEP_X = IMAGE_SIZE + GAP;
const STEP_Y = IMAGE_SIZE + GAP;

/* ========================================================= COURBURE ========================================================= */
const CURVE_HORIZONTAL = 0.0000000001;
const CURVE_VERTICAL = 0.000000001;

/* ========================================================= MOUVEMENT ========================================================= */
const FOLLOW = 0.16;
const FRICTION = 0.91;
const DRAG_MULTIPLIER = 1.35;

/* ========================================================= ZOOM ========================================================= */
const BASE_SCALE = 1;
const HOLD_SCALE = 0.84;
const ZOOM_PRESS_SPEED = 0.24;
const ZOOM_RELEASE_SPEED = 0.17;
const ZOOM_ELASTICITY = 0.055;
const ZOOM_MAX_VELOCITY = 0.035;

/* ========================================================= FOND ========================================================= */
const BACKGROUND = "#111111";

/* ========================================================= GRAIN ========================================================= */
const GRAIN_CONTRAST = 1.0;
const GRAIN_SAMPLES = 3;

/* ========================================================= TYPOGRAPHIE SURVOL ========================================================= */
const HOVER_FONT_SIZE = 20;
const HOVER_LETTER_SPACING = 1;

/* ========================================================= DONNÉES ========================================================= */

type ProjectData = {
  title: string;
  type: string;
  role: string;
  date: string;
  description: ReactNode;
};

const PROJECTS_DATA_FR: Record<number, ProjectData> = {
  1: {
    title: "Arkitekt",
    type: "Typographie",
    role: "Direction artistique",
    date: "2023",
    description: (
      <>
        Cet exercice, réalisé sur Illustrator, était consacré à
        l’expérimentation typographique. <br />
        Le champ était libre : créer une typographie de toutes pièces,
        travailler quelques caractères ou encore détourner une typographie
        existante. J’ai choisi de concevoir mon propre alphabet, de A à Z, ainsi
        qu’une série de chiffres de 1 à 9.
        <br />
        <br />
        J’ai travaillé sur un contraste marqué entre des empattements imposants
        et des lignes très fines, en cherchant à trouver un équilibre entre
        force et délicatesse.
      </>
    ),
  },

  2: {
    title: "Photographie",
    type: "Photographie",
    role: "Photographe",
    date: "2020 - aujourd'hui",
    description: (
      <>
        J’ai eu l’occasion d’expérimenter la photographie à travers différents
        exercices et situations de prise de vue. Cette sélection rassemble des
        images aux approches variées, choisies pour leur intérêt visuel et pour
        témoigner de ma pratique photographique.
        <br />
        <br />
        Ces photographies ont été conservées dans leur état d’origine, sans
        retouche, afin de mettre en avant le travail réalisé directement lors de
        la prise de vue.
      </>
    ),
  },

  3: {
    title: "Zen",
    type: "Vidéo",
    role: "Vidéaste",
    date: "2024",
    description: (
      <>
        Poésie. Sérénité. Apaisement. Ralentir pour mieux contempler.
        <br />
        <br />
        Dans une démarche romantique, nous avons choisi de nous attarder sur ce
        qui relève du sensible : ces instants suspendus où la nature invite à
        observer, ressentir et simplement être.
        <br />
        <br />
        Inspirées par la pensée de Goethe, pour qui la nature, lorsqu’elle est
        traversée par le regard de l’esprit, révèle ce qui ne peut être dit,
        nous avons souhaité lui accorder une place centrale dans notre
        réflexion.
        <br />
        <br />
        Notre démarche s’est ainsi construite autour de la valorisation des
        paysages comme espaces de contemplation, capables de susciter une
        expérience intime, presque spirituelle, et de nous reconnecter à ce qui
        nous entoure.
      </>
    ),
  },

  4: {
    title: "Le fil résistif",
    type: "Vidéo",
    role: "Vidéaste",
    date: "2023",
    description: (
      <>
        Dans le cadre de mon stage de fin de licence chez Interface Z, j’ai été
        chargée de promouvoir un capteur appelé « le fil résistif ». Il s’agit
        d’un simple fil qui, au contact d’un objet conducteur, permet d’exécuter
        un code.
        <br />
        <br />
        La question qui a guidé le projet était : comment faire de la cymatique
        numériquement ? En conservant l’idée d’une matière organique, j’ai créé
        un objet textile inspiré des motifs formés par le sable sous l’effet des
        vibrations sonores. Le fil résistif, cousu directement dans le tissu,
        devient alors l’interface de l’expérience.
        <br />
        <br />
        À l’aide de Max 8 et de Jitter, j’ai créé un visuel génératif dont les
        variations simulent différentes fréquences sonores. Le visuel réagit
        ainsi au contact avec l’objet conducteur et évolue en temps réel.
        <br />
        <br />
        L’ensemble a ensuite été capturé en vidéo, donnant naissance à une
        expérience à la frontière entre son, matière et mouvement.
      </>
    ),
  },

  5: {
    title: "Noises",
    type: "Vidéo",
    role: "Vidéaste",
    date: "2022",
    description: (
      <>
        Tout a commencé lorsque j’ai découvert Chaos Walking, réalisé par Doug
        Liman. Dans cet univers, les pensées des hommes deviennent audibles de
        tous. Ils appellent ce phénomène « le Bruit ».
        <br />
        <br />
        Ce qui m’a intriguée est sa représentation à l’écran : une émanation
        brumeuse qui apparaît autour des personnages lorsqu’ils pensent. Je me
        suis alors demandé : à quoi ressemble réellement le bruit ? Et si le son
        pouvait être rendu visible, quelle forme prendrait-il ?
        <br />
        <br />
        C’est à partir de cette question que j’ai cherché à rendre visibles les
        ondes sonores dans la matière. Cette démarche, appelée cymatique, permet
        de révéler les vibrations acoustiques à travers différents éléments
        comme l’eau ou le sable.
        <br />
        <br />
        De l’invisible au visible, du son à la matière, Noises cherche ainsi à
        donner une forme à ce qui ne peut habituellement pas être vu.
      </>
    ),
  },

  6: {
    title: "Virgil Was Here",
    type: "Fanzine",
    role: "Graphiste",
    date: "2022",
    description: (
      <>
        La consigne était de réaliser un fanzine sur le sujet de notre choix
        afin de développer notre maîtrise d’InDesign.
        <br />
        <br />À cette période, l’actualité était marquée par la disparition de
        Virgil Abloh et la présentation de sa dernière collection. J’ai choisi
        de consacrer mon fanzine à cet ultime défilé, intitulé « Virgil Was Here
        ».
      </>
    ),
  },

  7: {
    title: "Windmap",
    type: "Charte graphique",
    role: "Designer graphique",
    date: "2024",
    description: (
      <>
        La météo maritime est un univers où le vent, les vagues, les marées et
        les conditions météorologiques évoluent constamment. Pour les
        navigateurs, les plaisanciers ou les passionnés de la mer, ces
        informations sont essentielles pour comprendre l’état du littoral et
        anticiper les conditions à venir.
        <br />
        <br />
        Dans ce contexte, il m’est demandé d’imaginer l’identité visuelle et
        l’application d’un service dédié aux prévisions maritimes. L’objectif
        est de créer un univers graphique capable de traduire visuellement les
        différents phénomènes qui rythment la mer et de rendre ces informations
        facilement accessibles à l’utilisateur.
      </>
    ),
  },

  8: {
    title: "Le Ministère du Temps",
    type: "Charte graphique",
    role: "Designer graphique",
    date: "2024",
    description: (
      <>
        Le Ministère du Temps est une institution fictive qui apparaît dans la
        série télévisée espagnole « El Ministerio del Tiempo » (Le Ministère du
        Temps). Son rôle est de préserver l'intégrité de l'histoire et de
        veiller à ce que les événements du passé ne soient pas modifiés.
        <br />
        <br />
        Le Ministère du Temps est une organisation secrète, connue uniquement de
        quelques individus, et son existence est gardée secrète du grand public.
        Il est composé d'une équipe hétéroclite d'agents provenant de
        différentes époques, chacun apportant ses compétences et connaissances
        spécifiques pour maintenir l'intégrité du continuum temporel.
        <br />
        <br />
        Dans ce contexte, il m'est demandé d'imaginer la nouvelle identité
        visuelle du Ministère du Temps en mettant en avant l'idée de voyage
        temporel et de préservation de l'histoire.
      </>
    ),
  },

  9: {
    title: "Le Trot: les voix d'hier, échos d'aujourd'hui",
    type: "Documentaire interactif",
    role: "Directrice artistique",
    date: "jan. 2025 - juin. 2025",
    description: (
      <>
        Le trot coréen, genre musical populaire au niveau national durant le XXe
        siècle, est désormais perçu comme désuet et réservé aux générations plus
        âgées. Ce documentaire explore l'attachement des personnes âgées pour ce
        genre musical en retraçant son évolution.
        <br />
        <br />
        Direction du pôle image du documentaire interactif « Le Trot : les voix
        d'hier échos d'aujourd'hui » | réalisé en Corée du Sud
      </>
    ),
  },

  10: {
    title: "Sevran en Mouvement",
    type: "Projet Web",
    role: "UX/UI | Développeuse",
    date: "nov. 2024 - avr. 2025",
    description: (
      <>
        Sevran en Mouvement – Ensemble, construisons le futur de Sevran ! Ce
        site est conçu pour informer, inspirer et connecter les habitants autour
        des projets de la ville.
        <br />
        <br />
        Idéation & Développement web de la page d'accueil du projet Sevran en
        mouvement | Carte 3D interactive (HTML, CSS, JAVASCRIPT, Three.js, Vite)
      </>
    ),
  },

  11: {
    title: "Marketing & Communication",
    type: "Contenus digitaux",
    role: "Chargée de communication",
    date: "2026",
    description: <></>,
  },
};

const PROJECTS_DATA_EN: Record<number, ProjectData> = {
  1: {
    title: "Arkitekt",
    type: "Typography",
    role: "Art Direction",
    date: "2023",
    description: (
      <>
        This Illustrator exercise focused on typographic experimentation.
        <br />
        <br />
        The brief was open-ended: create a typeface from scratch, work on a
        selection of characters, or reinterpret an existing typeface. I chose to
        design my own alphabet, from A to Z, along with a series of numbers from
        1 to 9.
        <br />
        <br />I worked on a strong contrast between imposing serifs and very
        fine lines, looking for a balance between strength and delicacy.
      </>
    ),
  },

  2: {
    title: "Photography",
    type: "Photography",
    role: "Photographer",
    date: "2020 - present",
    description: (
      <>
        I have had the opportunity to experiment with photography through
        various exercises and shooting situations. This selection brings
        together images with different approaches, chosen for their visual
        interest and to showcase my photographic practice.
        <br />
        <br />
        These photographs have been kept in their original state, without
        retouching, in order to highlight the work carried out directly during
        the shooting process.
      </>
    ),
  },

  3: {
    title: "Zen",
    type: "Video",
    role: "Videographer",
    date: "2024",
    description: (
      <>
        Poetry. Serenity. Calm. Slowing down in order to contemplate more
        deeply.
        <br />
        <br />
        Through a romantic approach, we chose to focus on the sensitive: those
        suspended moments when nature invites us to observe, feel and simply
        exist.
        <br />
        <br />
        Inspired by Goethe's thoughts on nature and the way the mind reveals
        what cannot be expressed through words, we wanted to give nature a
        central place in our reflection.
        <br />
        <br />
        Our approach was therefore built around landscapes as spaces for
        contemplation, capable of creating an intimate, almost spiritual
        experience and reconnecting us with our surroundings.
      </>
    ),
  },

  4: {
    title: "The Resistive Thread",
    type: "Video",
    role: "Videographer",
    date: "2023",
    description: (
      <>
        As part of my final-year internship at Interface Z, I was responsible
        for promoting a sensor called "the resistive thread". It is a simple
        thread that, when in contact with a conductive object, can trigger a
        piece of code.
        <br />
        <br />
        The question guiding the project was: how can cymatics be created
        digitally? Keeping the idea of an organic material, I created a textile
        object inspired by the patterns formed by sand under the effect of sound
        vibrations. The resistive thread, sewn directly into the fabric, becomes
        the interface of the experience.
        <br />
        <br />
        Using Max 8 and Jitter, I created a generative visual whose variations
        simulate different sound frequencies. The visual reacts to contact with
        the conductive object and evolves in real time.
        <br />
        <br />
        The whole experience was then captured on video, resulting in a project
        at the intersection of sound, material and movement.
      </>
    ),
  },

  5: {
    title: "Noises",
    type: "Video",
    role: "Videographer",
    date: "2022",
    description: (
      <>
        It all started when I discovered Chaos Walking, directed by Doug Liman.
        In this universe, people's thoughts become audible to everyone. They
        call this phenomenon "the Noise".
        <br />
        <br />
        What intrigued me was its representation on screen: a misty emanation
        that appears around characters when they think. I began wondering: what
        does the Noise actually look like? And if sound could be made visible,
        what form would it take?
        <br />
        <br />
        From this question, I explored ways of making sound waves visible
        through matter. This approach, known as cymatics, reveals acoustic
        vibrations through different materials such as water or sand.
        <br />
        <br />
        From invisible to visible, from sound to matter, Noises seeks to give
        form to something that normally cannot be seen.
      </>
    ),
  },

  6: {
    title: "Virgil Was Here",
    type: "Fanzine",
    role: "Graphic Designer",
    date: "2022",
    description: (
      <>
        The brief was to create a fanzine on a subject of our choice in order to
        develop our skills in InDesign.
        <br />
        <br />
        At the time, the news was marked by the passing of Virgil Abloh and the
        presentation of his final collection. I chose to dedicate my fanzine to
        this final fashion show, entitled "Virgil Was Here".
      </>
    ),
  },

  7: {
    title: "Windmap",
    type: "Visual Identity",
    role: "Graphic Designer",
    date: "2024",
    description: (
      <>
        Maritime weather is an environment where wind, waves, tides and weather
        conditions are constantly changing. For sailors, boaters and sea
        enthusiasts, this information is essential for understanding coastal
        conditions and anticipating what is to come.
        <br />
        <br />
        In this context, I was asked to imagine the visual identity and
        application of a service dedicated to marine forecasts. The objective
        was to create a visual universe capable of translating the different
        phenomena that shape the sea while making this information easily
        accessible to users.
      </>
    ),
  },

  8: {
    title: "The Ministry of Time",
    type: "Visual Identity",
    role: "Graphic Designer",
    date: "2024",
    description: (
      <>
        The Ministry of Time is a fictional institution appearing in the Spanish
        television series "El Ministerio del Tiempo" (The Ministry of Time). Its
        role is to preserve the integrity of history and ensure that past events
        are not altered.
        <br />
        <br />
        The Ministry of Time is a secret organization known only to a few
        individuals, with its existence kept hidden from the general public. It
        is composed of a diverse team of agents from different periods of
        history, each bringing their own skills and knowledge to maintain the
        integrity of the timeline.
        <br />
        <br />
        In this context, I was asked to imagine a new visual identity for the
        Ministry of Time, emphasizing the ideas of time travel and the
        preservation of history.
      </>
    ),
  },

  9: {
    title: "Le Trot: Voices of Yesterday, Echoes of Today",
    type: "Interactive Documentary",
    role: "Art Director",
    date: "Jan. 2025 - June 2025",
    description: (
      <>
        Korean trot, a musical genre that was nationally popular throughout the
        20th century, is now often perceived as outdated and associated with
        older generations. This documentary explores older people's attachment
        to the genre by tracing its evolution.
        <br />
        <br />
        Art direction for the visual department of the interactive documentary
        "Le Trot: Voices of Yesterday, Echoes of Today" | produced in South
        Korea
      </>
    ),
  },

  10: {
    title: "Sevran en Mouvement",
    type: "Web Project",
    role: "UX/UI | Developer",
    date: "Nov. 2024 - Apr. 2025",
    description: (
      <>
        Sevran en Mouvement – Together, let's build the future of Sevran! This
        website was designed to inform, inspire and connect residents around the
        city's projects.
        <br />
        <br />
        Ideation & Web development of the homepage for the Sevran en Mouvement
        project | Interactive 3D map (HTML, CSS, JAVASCRIPT, Three.js, Vite)
      </>
    ),
  },

  11: {
    title: "Marketing & Communication",
    type: "Digital Content",
    role: "Communications Officer",
    date: "2026",
    description: <></>,
  },
};

/* ========================================================= URLS ========================================================= */

const PROJECT_URLS: Record<number, string> = {
  2: "",
  3: `${BASE_PATH}/projects/zen.mp4`,
  4: `${BASE_PATH}/projects/resistif.mp4`,
  5: `${BASE_PATH}/projects/noises.mp4`,
  6: `${BASE_PATH}/projects/virgil.pdf`,
  7: `${BASE_PATH}/projects/windmap.pdf`,
  8: `${BASE_PATH}/projects/charte-ministere-temps.pdf`,
  9: "https://trot.mastercmw.com/",
  10: "https://sevran-en-mouvement.mastercmw.com/accueil/",
  11: "#",
};

/* ========================================================= TYPES ========================================================= */

type ProjectModalProps = {
  projectIndex: number;
  onClose: () => void;
};

type GalleryProject = {
  index: number;
  image?: HTMLImageElement;
  video?: HTMLVideoElement;
};

type ProjectMedia =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

/* ========================================================= MÉDIAS ========================================================= */

function getProjectMedia(projectIndex: number): ProjectMedia[] {
  if (projectIndex === 2) {
    return [
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-2.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-2-2.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-2-3.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-2-4.jpg`,
      },
    ];
  }

  if (projectIndex === 11) {
    return [
      {
        type: "video",
        src: `${BASE_PATH}/projects/project-11-1.mp4`,
      },
      {
        type: "video",
        src: `${BASE_PATH}/projects/project-11-2.mp4`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-11-1.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-11-2.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-11-digital-1.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-11-digital-2.jpg`,
      },
      {
        type: "image",
        src: `${BASE_PATH}/projects/project-11-digital-3.jpg`,
      },
    ];
  }

  return [
    {
      type: "image",
      src: `${BASE_PATH}/projects/project-${projectIndex}.jpg`,
    },
    {
      type: "image",
      src: `${BASE_PATH}/projects/project-${projectIndex}-2.jpg`,
    },
    {
      type: "image",
      src: `${BASE_PATH}/projects/project-${projectIndex}-3.jpg`,
    },
  ];
}

/* ========================================================= CURSEUR ========================================================= */

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

    function handlePointerMove(event: PointerEvent): void {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function animate(): void {
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

      animationFrame = requestAnimationFrame(animate);
    }

    window.addEventListener("pointermove", handlePointerMove);

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="custom-cursor-trail" aria-hidden="true" />

      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Anton&family=Geist:wght@100..900&family=IBM+Plex+Mono:wght@100;200;300;400;500;600;700&family=Space+Grotesk:wght@300..700&display=swap");

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

/* ========================================================= GRAIN DU POPUP ========================================================= */

function PopupGrain(): React.JSX.Element {
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasElement = grainCanvasRef.current;

    if (canvasElement === null) {
      return;
    }

    const context = canvasElement.getContext("2d");

    if (context === null) {
      return;
    }

    const canvas = canvasElement;
    const ctx = context;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let frameCounter = 0;

    function resize(): void {
      width = window.innerWidth;
      height = window.innerHeight;

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingEnabled = false;
    }

    function generateGrain(): void {
      if (canvas.width <= 0 || canvas.height <= 0) {
        return;
      }

      const grainImage = ctx.createImageData(canvas.width, canvas.height);

      const pixels = grainImage.data;

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
        pixels[i + 3] = 255;
      }

      ctx.putImageData(grainImage, 0, 0);
    }

    function animate(): void {
      frameCounter += 1;

      if (frameCounter % 4 === 0) {
        generateGrain();
      }

      animationFrame = requestAnimationFrame(animate);
    }

    resize();
    generateGrain();

    window.addEventListener("resize", resize);

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={grainCanvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5010,
        opacity: 0.085,
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ========================================================= ICÔNE VOLUME ========================================================= */

function VolumeIcon({ muted }: { muted: boolean }): React.JSX.Element {
  if (muted) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="white" />

        <path
          d="M17 9L21 16"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        <path
          d="M21 9L17 16"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M4 9V15H8L13 19V5L8 9H4Z" fill="white" />

      <path
        d="M16 9.2C16.9 10.1 17.4 11.2 17.4 12.5C17.4 13.8 16.9 14.9 16 15.8"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M18.7 6.8C20.3 8.4 21.2 10.3 21.2 12.5C21.2 14.7 20.3 16.6 18.7 18.2"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ========================================================= POPUP ========================================================= */

function ProjectModal({
  projectIndex,
  onClose,
}: ProjectModalProps): React.JSX.Element {
  const [activeMedia, setActiveMedia] = useState(0);

  const pathname = usePathname();
  const isEnglish = pathname.startsWith(`${BASE_PATH}/en`);

  const projectsData = isEnglish ? PROJECTS_DATA_EN : PROJECTS_DATA_FR;

  const [videoMuted, setVideoMuted] = useState<Record<string, boolean>>({
    [`${BASE_PATH}/projects/project-11-1.mp4`]: true,
    [`${BASE_PATH}/projects/project-11-2.mp4`]: true,
  });

  const project = projectsData[projectIndex] ?? projectsData[1];

  const projectUrl = PROJECT_URLS[projectIndex] ?? "#";

  const media = getProjectMedia(projectIndex);

  const isProject11 = projectIndex === 11;

  const showVisitSite =
    projectIndex !== 1 && projectIndex !== 2 && projectIndex !== 11;

  const project11Slides = [
    {
      label: isEnglish ? "Video" : "Vidéo",
      items: media.slice(0, 2),
      description: isEnglish ? (
        <>
          Create video content for social media, from the initial idea to
          editing, working on rhythm, storytelling and visual identity. Each
          Reel was designed to be dynamic, spontaneous and consistent with the
          Atlantic Centre of Education's visual universe.
          <br />
          <br />
          This experience allowed me to explore another way of telling a story
          and engaging audiences.
        </>
      ) : (
        <>
          Créer des contenus vidéo pour les réseaux sociaux, de l’idée au
          montage, en travaillant le rythme, le storytelling et l’identité
          visuelle. Chaque Reel était pensé pour être à la fois dynamique,
          spontané et cohérent avec l’univers de l’Atlantic Centre of Education.
          <br />
          <br />
          Cette expérience m’a permis d’explorer une autre manière de raconter
          une histoire et d'engager les audiences.
        </>
      ),
    },

    {
      label: isEnglish ? "Images" : "Images",
      items: media.slice(2, 4),
      description: isEnglish ? (
        <>
          Create content for social media, from editorial thinking to visual
          creation, adapting each publication to the codes and formats of the
          platforms. Working on copywriting, tone, information hierarchy and
          visual impact to create coherent, readable and engaging content.
          <br />
          <br />
          This selection of publications created for ACE reflects my experience
          in content creation and my ability to transform an idea into content
          designed to attract attention, communicate a message and engage
          audiences.
        </>
      ) : (
        <>
          Concevoir des contenus pour les réseaux sociaux, de la réflexion
          éditoriale à la création visuelle, en adaptant chaque publication aux
          codes et aux formats des plateformes. Travailler le copywriting, le
          ton, la hiérarchie de l’information et l’impact visuel pour créer des
          contenus cohérents, lisibles et engageants.
          <br />
          <br />
          Cette sélection de publications réalisées pour l’ACE témoigne de mon
          expérience en création de contenu et de ma capacité à transformer une
          idée en contenu pensé pour attirer l’attention, transmettre un message
          et engager les audiences.
        </>
      ),
    },

    {
      label: isEnglish ? "Digital Communication" : "Communication digital",
      items: media.slice(4, 7),
      description: isEnglish ? (
        <>
          Create digital communication materials by working on layout,
          information hierarchy and visual identity in order to make content
          clear, readable and consistent.
          <br />
          <br />
          This factsheet created for the Atlantic Centre of Education
          demonstrates my ability to visually structure information and adapt it
          to the constraints of a digital medium.
        </>
      ) : (
        <>
          Concevoir des supports de communication digitale en travaillant la
          mise en page, la hiérarchie de l’information et l’identité visuelle
          afin de rendre les contenus clairs, lisibles et cohérents.
          <br />
          <br />
          Ce factsheet réalisé pour l’Atlantic Centre of Education illustre ma
          capacité à structurer visuellement une information et à l’adapter aux
          contraintes d’un support digital.
        </>
      ),
    },
  ];

  const activeProject11Slide = isProject11
    ? (project11Slides[activeMedia] ?? project11Slides[0])
    : null;

  const activeItems = isProject11 ? (activeProject11Slide?.items ?? []) : media;

  useEffect(() => {
    setActiveMedia(0);
  }, [projectIndex]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        goToPreviousMedia();
        return;
      }

      if (event.key === "ArrowRight") {
        goToNextMedia();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function toggleVideoSound(src: string): void {
    setVideoMuted((previous) => ({
      ...previous,
      [src]: !(previous[src] ?? true),
    }));
  }

  const carouselLength = isProject11 ? project11Slides.length : media.length;

  function goToPreviousMedia(): void {
    if (carouselLength <= 1) {
      return;
    }

    setActiveMedia((current) =>
      current <= 0 ? carouselLength - 1 : current - 1,
    );
  }

  function goToNextMedia(): void {
    if (carouselLength <= 1) {
      return;
    }

    setActiveMedia((current) =>
      current >= carouselLength - 1 ? 0 : current + 1,
    );
  }

  return (
    <div className="project-modal">
      <PopupGrain />

      <div className="project-modal-content">
        <div className="project-modal-header">
          <img
            src={`${BASE_PATH}/projects/IS.png`}
            alt="Logo"
            className="project-modal-logo"
          />
        </div>

        <div className="project-modal-main">
          <div className="project-modal-copy">
            <div className="project-modal-project-title">
              {isProject11
                ? `${project.title} — ${activeProject11Slide?.label ?? ""}`
                : project.title}
            </div>

            <div className="project-modal-meta">
              <div>{project.type}</div>
              <div>{project.role}</div>
              <div>{project.date}</div>
            </div>

            <p>
              {isProject11
                ? activeProject11Slide?.description
                : project.description}
            </p>

            {showVisitSite && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-visit-site"
                aria-label={
                  isEnglish
                    ? `Visit site — ${project.title}`
                    : `Visiter le site — ${project.title}`
                }
              >
                <span>{isEnglish ? "Visit site" : "Visiter le site"}</span>

                <img
                  src={`${BASE_PATH}/projects/carre-fleche.png`}
                  alt=""
                  className="project-visit-icon"
                />
              </a>
            )}
          </div>

          <div
            className={
              isProject11
                ? "project-modal-image-wrap project-modal-project-11-media"
                : "project-modal-image-wrap"
            }
          >
            {carouselLength > 1 && (
              <>
                <button
                  type="button"
                  className="project-carousel-arrow project-carousel-arrow-left"
                  onClick={goToPreviousMedia}
                  aria-label={isEnglish ? "Previous media" : "Média précédent"}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M14.5 4.5L7 12L14.5 19.5" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="project-carousel-arrow project-carousel-arrow-right"
                  onClick={goToNextMedia}
                  aria-label={isEnglish ? "Next media" : "Média suivant"}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9.5 4.5L17 12L9.5 19.5" />
                  </svg>
                </button>
              </>
            )}

            {isProject11 ? (
              <div className="project-11-media-grid">
                {activeItems.map((item) =>
                  item.type === "image" ? (
                    <img
                      key={item.src}
                      src={item.src}
                      alt=""
                      className="project-modal-image project-11-media-item"
                    />
                  ) : (
                    <div key={item.src} className="project-11-video-item">
                      <video
                        src={item.src}
                        className="project-modal-video project-11-video"
                        autoPlay
                        muted={videoMuted[item.src] ?? true}
                        loop
                        playsInline
                        preload="auto"
                      />

                      <button
                        type="button"
                        className="project-11-volume-button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleVideoSound(item.src);
                        }}
                        aria-label={
                          (videoMuted[item.src] ?? true)
                            ? isEnglish
                              ? "Turn sound on"
                              : "Activer le son"
                            : isEnglish
                              ? "Turn sound off"
                              : "Couper le son"
                        }
                      >
                        <span className="project-11-volume-icon">
                          <VolumeIcon muted={videoMuted[item.src] ?? true} />
                        </span>
                      </button>
                    </div>
                  ),
                )}
              </div>
            ) : (
              (() => {
                const activeItem = media[activeMedia];

                return activeItem.type === "image" ? (
                  <img
                    key={`${projectIndex}-${activeMedia}`}
                    src={activeItem.src}
                    alt={
                      isEnglish
                        ? `Project ${projectIndex} — image ${activeMedia + 1}`
                        : `Projet ${projectIndex} — image ${activeMedia + 1}`
                    }
                    className="project-modal-image"
                  />
                ) : (
                  <video
                    key={`${projectIndex}-${activeMedia}`}
                    src={activeItem.src}
                    className="project-modal-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                );
              })()
            )}
          </div>

          <div className="project-modal-copy-mobile">
            <div className="project-modal-project-title">
              {isProject11
                ? `${project.title} — ${activeProject11Slide?.label ?? ""}`
                : project.title}
            </div>

            <div className="project-modal-meta">
              <div>{project.type}</div>
              <div>{project.role}</div>
              <div>{project.date}</div>
            </div>

            <p>
              {isProject11
                ? activeProject11Slide?.description
                : project.description}
            </p>

            {showVisitSite && (
              <a
                href={projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-visit-site"
                aria-label={
                  isEnglish
                    ? `Visit site — ${project.title}`
                    : `Visiter le site — ${project.title}`
                }
              >
                <span>{isEnglish ? "Visit site" : "Visiter le site"}</span>

                <img
                  src={`${BASE_PATH}/projects/carre-fleche.png`}
                  alt=""
                  className="project-visit-icon"
                />
              </a>
            )}
          </div>
        </div>

        <div
          className={
            isProject11
              ? "project-thumbnails project-11-thumbnails"
              : "project-thumbnails"
          }
        >
          {isProject11
            ? project11Slides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={
                    index === activeMedia
                      ? "project-thumbnail project-thumbnail-active"
                      : "project-thumbnail"
                  }
                  onClick={() => setActiveMedia(index)}
                  aria-label={
                    isEnglish
                      ? `Show slide ${index + 1} — ${slide.label}`
                      : `Afficher la slide ${index + 1} — ${slide.label}`
                  }
                >
                  <div className="project-11-thumbnail-preview">
                    {slide.items.map((item) =>
                      item.type === "image" ? (
                        <img
                          key={item.src}
                          src={item.src}
                          alt=""
                          className="project-thumbnail-image"
                        />
                      ) : (
                        <video
                          key={item.src}
                          src={item.src}
                          className="project-thumbnail-image"
                          muted
                          playsInline
                          autoPlay
                          loop
                          preload="metadata"
                        />
                      ),
                    )}
                  </div>
                </button>
              ))
            : media.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  className={
                    index === activeMedia
                      ? "project-thumbnail project-thumbnail-active"
                      : "project-thumbnail"
                  }
                  onClick={() => setActiveMedia(index)}
                  aria-label={
                    isEnglish
                      ? `Show media ${index + 1}`
                      : `Afficher le média ${index + 1}`
                  }
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt=""
                      className="project-thumbnail-image"
                    />
                  ) : (
                    <video
                      src={item.src}
                      className="project-thumbnail-image"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  )}
                </button>
              ))}
        </div>

        <button
          type="button"
          className="project-modal-close"
          onClick={onClose}
          aria-label={isEnglish ? "Close project" : "Fermer le projet"}
        >
          <span />
          <span />
        </button>
      </div>

      <style jsx>{`
        .project-modal {
          position: fixed;
          inset: 0;
          z-index: 4000;
          width: 100vw;
          height: 100dvh;
          overflow: hidden;
          background: rgba(17, 17, 17, 0.94);
          font-family: "Geist", Arial, Helvetica, sans-serif;
        }

        .project-modal-content {
          position: relative;
          z-index: 5001;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .project-modal-project-title {
          font-family: "Space Grotesk", Arial, Helvetica, sans-serif;
          font-size: 11px;
          line-height: 1.2;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
        }

        .project-modal-copy p,
        .project-modal-copy-mobile p {
          font-family: "Geist", Arial, Helvetica, sans-serif;
          font-size: 11px;
          line-height: 1.5;
          font-style: italic;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.82);
          text-align: justify;
          text-justify: inter-word;
        }

        .project-modal-meta,
        .project-visit-site,
        .project-thumbnail,
        .project-modal-close {
          font-family: "IBM Plex Mono", monospace;
        }

        .project-modal-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70px;
          display: flex;
          align-items: center;
          padding: 0 32px;
          z-index: 5020;
          pointer-events: none;
        }

        .project-modal-logo {
          display: block;
          width: auto;
          height: 25px;
          object-fit: contain;
        }

        .project-modal-main {
          position: relative;
          flex: 1;
          min-height: 0;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 90px 7vw 115px;
        }

        .project-modal-copy {
          position: absolute;
          left: 7vw;
          top: 50%;
          transform: translateY(-50%);
          width: min(250px, 20vw);
          z-index: 5015;
          text-align: left;
        }

        .project-modal-project-title {
          margin: 0 0 7px;
          text-align: left;
        }

        .project-modal-meta {
          margin: 0 0 14px;
          color: rgba(255, 255, 255, 0.52);
          font-size: 9px;
          line-height: 1.45;
          font-weight: 400;
          letter-spacing: 0.025em;
          text-align: left;
        }

        .project-modal-meta div {
          margin: 0;
        }

        .project-modal-copy p,
        .project-modal-copy-mobile p {
          margin: 0;
        }

        .project-visit-site {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 22px;
          padding-bottom: 2px;
          color: #ffffff;
          font-size: 10px;
          line-height: 1;
          font-weight: 400;
          text-decoration-line: underline;
          text-decoration-color: #ffffff;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          cursor: none;
          transition:
            opacity 180ms ease,
            transform 180ms ease;
        }

        .project-visit-site:hover {
          opacity: 0.65;
          transform: translateX(2px);
        }

        .project-visit-icon {
          display: block;
          width: 16px;
          height: 16px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .project-carousel-arrow {
          position: absolute;
          top: 50%;
          width: 44px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          border: 0;
          outline: none;
          background: transparent;
          color: #ffffff;
          cursor: none;
          z-index: 5030;
          transform: translateY(-50%);
          opacity: 0.72;
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        .project-carousel-arrow:hover {
          opacity: 1;
        }

        .project-carousel-arrow:active {
          opacity: 0.5;
        }

        .project-carousel-arrow svg {
          display: block;
          width: 32px;
          height: 24px;
          fill: none;
          stroke: currentColor;
          stroke-width: 0.75;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .project-carousel-arrow-left {
          left: -48px;
        }

        .project-carousel-arrow-right {
          right: -48px;
        }

        .project-carousel-arrow-left:hover {
          transform: translate(-2px, -50%);
        }

        .project-carousel-arrow-right:hover {
          transform: translate(2px, -50%);
        }

        .project-modal-image-wrap {
          position: relative;
          width: min(62vw, 720px);
          height: min(68vh, 720px);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 9vw;
        }

        .project-modal-image,
        .project-modal-video {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          object-position: center center;
          user-select: none;
          -webkit-user-drag: none;
        }

        .project-modal-video {
          background: transparent;
        }

        /* ===================================================== PROJET 11 ===================================================== */

        .project-modal-project-11-media {
          width: min(64vw, 900px);
          height: min(68vh, 720px);
        }

        .project-11-media-grid {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 34px;
        }

        .project-11-media-item {
          flex: 0 0 auto;
          width: 370px;
          height: 480px;
          max-width: none;
          max-height: none;
          aspect-ratio: 9 / 16;
          object-fit: contain;
        }

        .project-11-video-item {
          position: relative;
          flex: 0 0 auto;
          width: 276px;
          height: 491px;
          max-width: 276px;
          max-height: 491px;
          overflow: hidden;
          background: #000;
        }

        .project-11-video {
          display: block;
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          object-fit: contain;
          object-position: center center;
          background: #000;
        }

        .project-11-volume-button {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          margin: 0;
          border: 0;
          outline: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.38);
          backdrop-filter: blur(4px);
          cursor: none;
          z-index: 20;
          pointer-events: auto;
          transition:
            background 160ms ease,
            transform 160ms ease;
        }

        .project-11-volume-button:hover {
          background: rgba(0, 0, 0, 0.62);
          transform: scale(1.06);
        }

        .project-11-volume-button:active {
          transform: scale(0.94);
        }

        .project-11-volume-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .project-11-volume-icon svg {
          display: block;
          width: 17px;
          height: 17px;
        }

        .project-modal-project-11-media
          .project-11-media-grid:has(.project-11-media-item:nth-child(3)) {
          gap: 14px;
        }

        .project-modal-project-11-media
          .project-11-media-grid:has(.project-11-media-item:nth-child(3))
          .project-11-media-item {
          max-width: 31%;
        }

        .project-11-thumbnail-preview {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          overflow: hidden;
        }

        .project-11-thumbnail-preview .project-thumbnail-image {
          min-width: 0;
          min-height: 0;
          flex: 1 1 0;
          width: 0;
          height: 100%;
          object-fit: cover;
        }

        .project-modal-copy-mobile {
          display: none;
        }

        /* ===================================================== FERMETURE ===================================================== */

        .project-modal-close {
          position: fixed;
          top: 20px;
          right: 22px;
          width: 40px;
          height: 40px;
          padding: 0;
          margin: 0;
          border: 0;
          outline: none;
          background: transparent;
          cursor: none;
          z-index: 6000;
          pointer-events: auto;
        }

        .project-modal-close span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 25px;
          height: 1px;
          background: #ffffff;
        }

        .project-modal-close span:first-child {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .project-modal-close span:last-child {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        /* ===================================================== MINIATURES ===================================================== */

        .project-thumbnails {
          position: fixed;
          left: 50%;
          bottom: 24px;
          transform: translateX(-50%);
          z-index: 5200;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .project-thumbnail {
          position: relative;
          width: 62px;
          height: 62px;
          padding: 0;
          margin: 0;
          border: 0;
          outline: none;
          overflow: hidden;
          background: transparent;
          opacity: 0.32;
          cursor: none;
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        .project-thumbnail:hover {
          opacity: 1;
          transform: translateY(-2px);
        }

        .project-thumbnail-active {
          opacity: 1;
        }

        .project-thumbnail-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          user-select: none;
          -webkit-user-drag: none;
        } /* ===================================================== TABLET ===================================================== */

        @media (max-width: 900px) {
          .project-modal {
            z-index: 2147483000 !important;
          }

          .project-modal-content {
            z-index: 2147483001 !important;
            overflow: hidden;
          }

          .project-modal-header {
            z-index: 2147483002 !important;
            height: 64px;
            padding: 0 24px;
          }

          .project-modal-logo {
            height: 23px;
          }

          .project-modal-close {
            z-index: 2147483003 !important;
            top: 12px;
            right: 14px;
          }

          .project-thumbnails {
            z-index: 2147483004 !important;
          }

          .project-modal-main {
            width: 100%;
            height: 100%;
            flex: 1 1 auto;
            min-height: 0;
            box-sizing: border-box;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            padding: 78px 60px 145px;
            overflow-x: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }

          .project-modal-copy {
            display: none;
          }

          .project-modal-image-wrap {
            position: relative;
            flex: 0 0 auto;
            width: min(70vw, 600px);
            height: min(55vh, 520px);
            max-width: calc(100vw - 120px);
            max-height: 520px;
            margin: 15px auto 0;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .project-modal-image,
          .project-modal-video {
            display: block;
            max-width: 100%;
            max-height: 100%;
            width: auto;
            height: auto;
          }

          .project-carousel-arrow {
            position: absolute;
            top: 50%;
            width: 42px;
            height: 52px;
            z-index: 30;
            transform: translateY(-50%);
          }

          .project-carousel-arrow svg {
            width: 20px;
            height: 34px;
            stroke-width: 0.8;
          }

          .project-carousel-arrow-left {
            left: -42px;
          }

          .project-carousel-arrow-right {
            right: -42px;
          }

          .project-carousel-arrow-left:hover {
            transform: translate(-2px, -50%);
          }

          .project-carousel-arrow-right:hover {
            transform: translate(2px, -50%);
          }

          .project-modal-copy-mobile {
            display: block;
            flex: 0 0 auto;
            width: min(600px, 100%);
            max-width: 100%;
            box-sizing: border-box;
            margin: 24px auto 30px;
            padding: 0;
            z-index: 5015;
            text-align: left;
          }

          .project-modal-copy-mobile p {
            font-size: 10px;
            line-height: 1.45;
            max-width: 100%;
          }

          .project-modal-project-title {
            font-size: 10px;
            margin-bottom: 6px;
          }

          .project-modal-meta {
            font-size: 8.5px;
            margin-bottom: 11px;
          }

          .project-visit-site {
            margin-top: 20px;
            font-size: 9px;
          }

          /* PROJET 11 TABLET */

          .project-modal-project-11-media {
            width: min(82vw, 720px);
            height: min(55vh, 520px);
            max-width: calc(100vw - 120px);
            max-height: 520px;
            margin: 15px auto 0;
          }

          .project-11-media-grid {
            width: 100%;
            height: 100%;
            gap: 18px;
            justify-content: center;
          }

          .project-11-video-item {
            width: min(180px, 27vw);
            height: auto;
            aspect-ratio: 9 / 16;
            max-width: min(180px, 27vw);
            max-height: none;
          }

          .project-11-media-item {
            width: min(260px, 38vw);
            height: auto;
            max-width: min(260px, 38vw);
            max-height: 100%;
            aspect-ratio: 9 / 16;
          }

          .project-modal-project-11-media
            .project-11-media-grid:has(.project-11-media-item:nth-child(3))
            .project-11-media-item {
            max-width: 29%;
          }

          .project-11-volume-button {
            right: 8px;
            bottom: 8px;
            width: 28px;
            height: 28px;
          }

          .project-11-volume-icon {
            width: 28px;
            height: 28px;
          }

          .project-11-volume-icon svg {
            width: 16px;
            height: 16px;
          }

          .project-thumbnails {
            left: 50%;
            bottom: 18px;
            max-width: calc(100vw - 40px);
            overflow-x: auto;
            overflow-y: hidden;
            padding: 3px 2px;
            scrollbar-width: none;
          }

          .project-thumbnails::-webkit-scrollbar {
            display: none;
          }

          .project-thumbnail {
            flex: 0 0 auto;
            width: 56px;
            height: 56px;
          }
        }

        /* ===================================================== MOBILE ===================================================== */

        @media (max-width: 600px) {
          .project-modal-main {
            padding: 62px 18px 118px;
            overflow-x: hidden;
            overflow-y: auto;
          }

          .project-modal-header {
            height: 54px;
            padding: 0 18px;
          }

          .project-modal-logo {
            height: 21px;
          }

          .project-modal-close {
            top: 8px;
            right: 8px;
            width: 38px;
            height: 38px;
          }

          .project-modal-close span {
            width: 23px;
          }

          .project-modal-image-wrap {
            width: calc(100vw - 76px);
            height: auto;
            max-width: calc(100vw - 76px);
            max-height: none;
            min-height: 0;
            margin: 12px auto 0;
            aspect-ratio: auto;
          }

          .project-modal-image,
          .project-modal-video {
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 45vh;
            object-fit: contain;
          }

          .project-carousel-arrow {
            position: absolute;
            top: 50%;
            width: 34px;
            height: 42px;
            transform: translateY(-50%);
            z-index: 50;
          }

          .project-carousel-arrow svg {
            width: 25px;
            height: 21px;
            stroke-width: 0.75;
          }

          .project-carousel-arrow-left {
            left: -31px;
          }

          .project-carousel-arrow-right {
            right: -31px;
          }

          .project-carousel-arrow-left:hover {
            transform: translate(-1px, -50%);
          }

          .project-carousel-arrow-right:hover {
            transform: translate(1px, -50%);
          }

          .project-modal-copy-mobile {
            width: 100%;
            max-width: 100%;
            margin: 17px auto 28px;
            box-sizing: border-box;
            padding: 0;
          }

          .project-modal-copy-mobile p {
            font-size: 8.5px;
            line-height: 1.45;
            max-width: 100%;
            overflow-wrap: break-word;
            word-break: normal;
          }

          .project-modal-project-title {
            font-size: 9px;
            line-height: 1.25;
            margin-bottom: 5px;
            max-width: 100%;
            overflow-wrap: break-word;
          }

          .project-modal-meta {
            font-size: 7.5px;
            line-height: 1.4;
            margin-bottom: 9px;
          }

          .project-visit-site {
            margin-top: 18px;
            font-size: 8.5px;
            gap: 6px;
          }

          .project-visit-icon {
            width: 14px;
            height: 14px;
          }

          /* PROJET 11 MOBILE */

          .project-modal-project-11-media {
            width: calc(100vw - 76px);
            height: auto;
            max-width: calc(100vw - 76px);
            max-height: none;
            min-height: 0;
            margin: 12px auto 0;
          }

          .project-11-media-grid {
            width: 100%;
            height: auto;
            min-height: 0;
            gap: 8px;
          }

          .project-11-video-item {
            width: min(135px, 39vw);
            height: auto;
            aspect-ratio: 9 / 16;
            max-width: min(135px, 39vw);
            max-height: none;
          }

          .project-11-media-item {
            width: min(135px, 39vw);
            height: auto;
            max-width: min(135px, 39vw);
            max-height: none;
            aspect-ratio: 9 / 16;
          }

          .project-modal-project-11-media
            .project-11-media-grid:has(.project-11-media-item:nth-child(3)) {
            gap: 5px;
          }

          .project-modal-project-11-media
            .project-11-media-grid:has(.project-11-media-item:nth-child(3))
            .project-11-media-item {
            max-width: 31%;
          }

          .project-11-volume-button {
            right: 6px;
            bottom: 6px;
            width: 25px;
            height: 25px;
          }

          .project-11-volume-icon {
            width: 25px;
            height: 25px;
          }

          .project-11-volume-icon svg {
            width: 14px;
            height: 14px;
          }

          /* MINIATURES MOBILE */

          .project-thumbnails {
            left: 50%;
            bottom: 10px;
            width: auto;
            max-width: calc(100vw - 28px);
            gap: 6px;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 3px 2px;
            scrollbar-width: none;
          }

          .project-thumbnails::-webkit-scrollbar {
            display: none;
          }

          .project-thumbnail {
            flex: 0 0 auto;
            width: 46px;
            height: 46px;
          }
        }

        /* ===================================================== TRÈS PETITS ÉCRANS ===================================================== */

        @media (max-width: 380px) {
          .project-modal-main {
            padding-left: 14px;
            padding-right: 14px;
            padding-bottom: 112px;
          }

          .project-modal-image-wrap,
          .project-modal-project-11-media {
            width: calc(100vw - 68px);
            max-width: calc(100vw - 68px);
          }

          .project-carousel-arrow-left {
            left: -29px;
          }

          .project-carousel-arrow-right {
            right: -29px;
          }

          .project-carousel-arrow {
            width: 32px;
          }

          .project-carousel-arrow svg {
            width: 23px;
          }

          .project-modal-copy-mobile {
            margin-top: 14px;
          }

          .project-modal-copy-mobile p {
            font-size: 8px;
            line-height: 1.4;
          }

          .project-modal-project-title {
            font-size: 8.5px;
          }

          .project-modal-meta {
            font-size: 7px;
          }

          .project-thumbnail {
            width: 42px;
            height: 42px;
          }
        }
      `}</style>
    </div>
  );
}

/* ===================================================== GALERIE ===================================================== */

export default function Galerie(): React.JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const pathname = usePathname();
  const isEnglish = pathname.startsWith(`${BASE_PATH}/en`);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement === null) {
      return;
    }

    const context = canvasElement.getContext("2d", { alpha: false });

    if (context === null) {
      return;
    }

    const canvas = canvasElement;
    const ctx = context;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let centerX = width / 2;
    let centerY = height / 2;
    let pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    let velocityX = 0;
    let velocityY = 0;

    let dragging = false;

    let pointerX = 0;
    let pointerY = 0;

    let targetScale = BASE_SCALE;
    let currentScale = BASE_SCALE;

    let zoomVelocity = 0;

    let hoveredCell: {
      column: number;
      row: number;
    } | null = null;

    let animationFrame = 0;
    let grainFrame = 0;

    const images: GalleryProject[] = [];

    for (let i = 1; i <= PROJECTS; i += 1) {
      if (i === 11) {
        const video = document.createElement("video");

        video.src = `${BASE_PATH}/projects/project-11-1.mp4`;
        video.muted = true;
        video.defaultMuted = true;
        video.loop = true;
        video.autoplay = true;
        video.playsInline = true;
        video.preload = "auto";

        video.setAttribute("muted", "");
        video.setAttribute("autoplay", "");
        video.setAttribute("loop", "");
        video.setAttribute("playsinline", "");

        video.addEventListener("loadeddata", () => {
          void video.play().catch(() => {});
        });

        void video.play().catch(() => {});

        images.push({
          index: i,
          video,
        });
      } else {
        const image = new window.Image();

        image.src = `${BASE_PATH}/projects/project-${i}.jpg`;
        image.decoding = "async";

        images.push({
          index: i,
          image,
        });
      }
    }

    const grainCanvas = document.createElement("canvas");
    const grainContext = grainCanvas.getContext("2d");

    if (grainContext === null) {
      return;
    }

    const grainCtx = grainContext;

    grainCtx.imageSmoothingEnabled = false;

    function resize(): void {
      width = window.innerWidth;
      height = window.innerHeight;

      centerX = width / 2;
      centerY = height / 2;

      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }

    function modulo(value: number, divisor: number): number {
      return ((value % divisor) + divisor) % divisor;
    }

    function projectFor(column: number, row: number): GalleryProject {
      const normalizedColumn = modulo(column, PROJECTS);
      const normalizedRow = modulo(row, PROJECTS);

      const index = modulo(normalizedColumn + normalizedRow * 3, PROJECTS) + 1;

      return images[index - 1];
    }

    function deform(
      x: number,
      y: number,
    ): {
      x: number;
      y: number;
    } {
      const distanceX = x - centerX;
      const distanceY = y - centerY;

      return {
        x: x + distanceX * Math.abs(distanceY) * CURVE_HORIZONTAL,
        y: y + distanceY * Math.abs(distanceX) * CURVE_VERTICAL,
      };
    }

    function cellPosition(
      column: number,
      row: number,
    ): {
      x: number;
      y: number;
    } {
      const baseX = centerX + column * STEP_X + currentX;

      const baseY = centerY + row * STEP_Y + currentY;

      return deform(baseX, baseY);
    }

    function drawHoverText(
      project: GalleryProject,
      x: number,
      y: number,
    ): void {
      const projectData = (isEnglish ? PROJECTS_DATA_EN : PROJECTS_DATA_FR)[
        project.index
      ];

      if (!projectData) {
        return;
      }

      ctx.save();

      ctx.font = `${HOVER_FONT_SIZE}px "Anton", sans-serif`;
      ctx.letterSpacing = `${HOVER_LETTER_SPACING}px`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      ctx.fillText(projectData.title.toUpperCase(), x, y);

      ctx.restore();
    }

    function drawProject(project: GalleryProject, x: number, y: number): void {
      const imageSize = IMAGE_SIZE * currentScale;

      ctx.save();

      ctx.translate(x, y);

      ctx.beginPath();
      ctx.rect(-imageSize / 2, -imageSize / 2, imageSize, imageSize);

      ctx.clip();

      if (project.image) {
        const image = project.image;

        if (image.complete && image.naturalWidth > 0) {
          const ratio = Math.max(
            imageSize / image.naturalWidth,
            imageSize / image.naturalHeight,
          );

          const drawWidth = image.naturalWidth * ratio;
          const drawHeight = image.naturalHeight * ratio;

          ctx.drawImage(
            image,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight,
          );
        }
      }

      if (project.video) {
        const video = project.video;

        if (video.readyState >= 2) {
          const ratio = Math.max(
            imageSize / video.videoWidth,
            imageSize / video.videoHeight,
          );

          const drawWidth = video.videoWidth * ratio;
          const drawHeight = video.videoHeight * ratio;

          ctx.drawImage(
            video,
            -drawWidth / 2,
            -drawHeight / 2,
            drawWidth,
            drawHeight,
          );
        }
      }

      ctx.restore();
    }

    function drawVignette(): void {
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        Math.min(width, height) * 0.1,
        centerX,
        centerY,
        Math.max(width, height) * 0.75,
      );

      gradient.addColorStop(0, "rgba(17, 17, 17, 0)");
      gradient.addColorStop(0.65, "rgba(17, 17, 17, 0)");
      gradient.addColorStop(1, "rgba(17, 17, 17, 0.72)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function generateGrain(): void {
      const grainWidth = Math.max(1, Math.floor(width * 0.25));

      const grainHeight = Math.max(1, Math.floor(height * 0.25));

      grainCanvas.width = grainWidth;
      grainCanvas.height = grainHeight;

      const grainImage = grainCtx.createImageData(grainWidth, grainHeight);

      const pixels = grainImage.data;

      for (let i = 0; i < pixels.length; i += 4) {
        const value = Math.floor(Math.random() * 255);

        pixels[i] = value;
        pixels[i + 1] = value;
        pixels[i + 2] = value;
        pixels[i + 3] = 255;
      }

      grainCtx.putImageData(grainImage, 0, 0);
    }

    function drawGrain(): void {
      ctx.save();

      ctx.globalAlpha = 0.08;
      ctx.imageSmoothingEnabled = false;

      ctx.drawImage(grainCanvas, 0, 0, width, height);

      ctx.restore();
    }

    function getHoveredCell(
      clientX: number,
      clientY: number,
    ): {
      column: number;
      row: number;
    } | null {
      const localX = clientX - centerX - currentX;

      const localY = clientY - centerY - currentY;

      const column = Math.round(localX / STEP_X);

      const row = Math.round(localY / STEP_Y);

      const position = cellPosition(column, row);

      const distance = Math.sqrt(
        Math.pow(clientX - position.x, 2) + Math.pow(clientY - position.y, 2),
      );

      if (distance <= IMAGE_SIZE * currentScale * 0.5) {
        return {
          column,
          row,
        };
      }

      return null;
    }

    function getProjectAtPoint(
      clientX: number,
      clientY: number,
    ): number | null {
      const cell = getHoveredCell(clientX, clientY);

      if (cell === null) {
        return null;
      }

      const project = projectFor(cell.column, cell.row);

      return project.index;
    }

    function render(): void {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = BACKGROUND;

      ctx.fillRect(0, 0, width, height);

      const columns = Math.ceil(width / STEP_X) + 4;

      const rows = Math.ceil(height / STEP_Y) + 4;

      const centerColumn = Math.round(-currentX / STEP_X);

      const centerRow = Math.round(-currentY / STEP_Y);

      for (let row = centerRow - rows; row <= centerRow + rows; row += 1) {
        for (
          let column = centerColumn - columns;
          column <= centerColumn + columns;
          column += 1
        ) {
          const position = cellPosition(column, row);

          const project = projectFor(column, row);

          if (
            hoveredCell !== null &&
            hoveredCell.column === column &&
            hoveredCell.row === row
          ) {
            drawHoverText(project, position.x, position.y);
          } else {
            drawProject(project, position.x, position.y);
          }
        }
      }

      drawVignette();
      drawGrain();
    }

    function animate(): void {
      currentX += (targetX - currentX) * FOLLOW;

      currentY += (targetY - currentY) * FOLLOW;

      velocityX *= FRICTION;
      velocityY *= FRICTION;

      targetX += velocityX;
      targetY += velocityY;

      zoomVelocity += (targetScale - currentScale) * ZOOM_ELASTICITY;

      zoomVelocity = Math.max(
        -ZOOM_MAX_VELOCITY,
        Math.min(ZOOM_MAX_VELOCITY, zoomVelocity),
      );

      currentScale += zoomVelocity;
      zoomVelocity *= 0.86;

      render();

      animationFrame = requestAnimationFrame(animate);
    }

    function pointerDown(event: PointerEvent): void {
      const project = getProjectAtPoint(event.clientX, event.clientY);

      if (project !== null) {
        setSelectedProject(project);
        return;
      }

      dragging = true;

      pointerX = event.clientX;
      pointerY = event.clientY;

      velocityX = 0;
      velocityY = 0;

      targetScale = HOLD_SCALE;

      canvas.style.cursor = "none";

      canvas.setPointerCapture(event.pointerId);
    }

    function pointerMove(event: PointerEvent): void {
      if (dragging) {
        const deltaX = event.clientX - pointerX;

        const deltaY = event.clientY - pointerY;

        targetX += deltaX * DRAG_MULTIPLIER;

        targetY += deltaY * DRAG_MULTIPLIER;

        velocityX = deltaX * DRAG_MULTIPLIER;

        velocityY = deltaY * DRAG_MULTIPLIER;

        pointerX = event.clientX;
        pointerY = event.clientY;

        hoveredCell = null;
        return;
      }

      hoveredCell = getHoveredCell(event.clientX, event.clientY);
    }

    function pointerUp(event: PointerEvent): void {
      dragging = false;

      targetScale = BASE_SCALE;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
    }

    function pointerLeave(): void {
      hoveredCell = null;
    }

    canvas.addEventListener("pointerdown", pointerDown);

    canvas.addEventListener("pointermove", pointerMove);

    canvas.addEventListener("pointerup", pointerUp);

    canvas.addEventListener("pointercancel", pointerUp);

    canvas.addEventListener("pointerleave", pointerLeave);

    window.addEventListener("resize", resize);

    resize();
    generateGrain();

    canvas.style.cursor = "none";

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);

      canvas.removeEventListener("pointerdown", pointerDown);

      canvas.removeEventListener("pointermove", pointerMove);

      canvas.removeEventListener("pointerup", pointerUp);

      canvas.removeEventListener("pointercancel", pointerUp);

      canvas.removeEventListener("pointerleave", pointerLeave);

      images.forEach((project) => {
        if (project.video) {
          project.video.pause();
          project.video.removeAttribute("src");
          project.video.load();
        }
      });
    };
  }, [isEnglish]);

  return (
    <>
      <Header />

      <CursorTrail />

      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          background: BACKGROUND,
          zIndex: 0,
          cursor: "none",
          touchAction: "none",
          userSelect: "none",
        }}
      />

      {selectedProject !== null && (
        <ProjectModal
          projectIndex={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </>
  );
}
