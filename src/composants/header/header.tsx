"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const BASE_PATH = "/inessogadzi";

export default function Header({
  textColor = "#fff",
}: {
  textColor?: string;
}): React.JSX.Element {
  const [menuOpen, setMenuOpen] = useState(false);
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathname = usePathname();

  const isEnglish = pathname.startsWith(`${BASE_PATH}/en`);
  const languageLabel = isEnglish ? "FR" : "EN";

  function getLanguageTarget(): string {
    const cleanPathname = pathname.replace(BASE_PATH, "");

    if (isEnglish) {
      const frenchPath = cleanPathname.replace(/^\/en/, "");
      return `${BASE_PATH}${frenchPath || "/"}`;
    }

    return `${BASE_PATH}/en${cleanPathname || "/"}`;
  }

  const languageTarget = getLanguageTarget();

  /* =========================
     GRAIN
  ========================= */

  useEffect(() => {
    const canvas = grainCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrain = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;

        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = 18;
      }

      ctx.putImageData(imageData, 0, 0);

      animationFrame = requestAnimationFrame(drawGrain);
    };

    resize();
    window.addEventListener("resize", resize);

    drawGrain();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      {/* =========================
          HEADER
      ========================= */}

      <header className="site-header">
        {/* LOGO */}

        <a
          href={isEnglish ? `${BASE_PATH}/en/galerie` : `${BASE_PATH}/galerie`}
          className="site-logo"
          aria-label="Galerie"
        >
          <Image
            src={`${BASE_PATH}/projects/IS.png`}
            alt="Logo"
            width={42}
            height={42}
            priority
          />
        </a>

        {/* DESKTOP NAVIGATION */}

        <nav className="site-navigation" aria-label="Navigation principale">
          <a href={isEnglish ? `${BASE_PATH}/en` : BASE_PATH}>ABOUT</a>

          <a
            href={
              isEnglish ? `${BASE_PATH}/en/galerie` : `${BASE_PATH}/galerie`
            }
          >
            WORK
          </a>

          <a href="mailto:ines.sogadzi@hotmail.fr">REACH OUT</a>

          <a href={isEnglish ? `${BASE_PATH}/en/cv` : `${BASE_PATH}/cv`}>CV</a>
        </nav>

        {/* LANGUAGE */}

        <a
          href={languageTarget}
          className="language-switch"
          aria-label={isEnglish ? "Passer au français" : "Switch to English"}
        >
          {languageLabel}
        </a>

        {/* BURGER */}

        <button
          type="button"
          className={`mobile-burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </header>

      {/* =========================
          MOBILE MENU
      ========================= */}

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <nav className="mobile-navigation" aria-label="Navigation mobile">
          <a
            href={isEnglish ? `${BASE_PATH}/en` : BASE_PATH}
            onClick={() => setMenuOpen(false)}
          >
            ABOUT
          </a>

          <a
            href={
              isEnglish ? `${BASE_PATH}/en/galerie` : `${BASE_PATH}/galerie`
            }
            onClick={() => setMenuOpen(false)}
          >
            WORK
          </a>

          <a
            href="mailto:ines.sogadzi@hotmail.fr"
            onClick={() => setMenuOpen(false)}
          >
            REACH OUT
          </a>

          <a
            href={isEnglish ? `${BASE_PATH}/en/cv` : `${BASE_PATH}/cv`}
            onClick={() => setMenuOpen(false)}
          >
            CV
          </a>
        </nav>
      </div>

      {/* =========================
          GRAIN
      ========================= */}

      <canvas
        ref={grainCanvasRef}
        className="header-grain"
        aria-hidden="true"
      />

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          pointer-events: none;
        }

        .site-logo {
          position: fixed;
          top: 24px;
          left: 32px;
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: auto;
          z-index: 1002;
        }

        .site-navigation {
          position: fixed;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 28px;
          pointer-events: auto;
        }

        .site-navigation a,
        .mobile-navigation a {
          color: ${textColor} !important;
          text-decoration: none;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          transition:
            opacity 0.25s ease,
            transform 0.25s ease;
        }

        .site-navigation a:hover,
        .mobile-navigation a:hover {
          opacity: 0.55;
        }

        .language-switch {
          position: fixed;
          top: 24px;
          right: 32px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${textColor} !important;
          background: transparent;
          border: 1px solid ${textColor} !important;
          border-radius: 50%;
          text-decoration: none;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.04em;
          pointer-events: auto;
          z-index: 1003;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease;
        }

        .language-switch:hover {
          background: ${textColor};
          color: #000 !important;
          transform: translateY(-1px);
        }

        .mobile-burger {
          position: fixed;
          top: 24px;
          right: 24px;
          width: 38px;
          height: 38px;
          padding: 0;
          display: none;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: transparent;
          border: 1px solid ${textColor};
          border-radius: 50%;
          cursor: pointer;
          pointer-events: auto;
          z-index: 1004;
        }

        .mobile-burger span {
          display: block;
          width: 13px;
          height: 1px;
          background: ${textColor};
          transition:
            transform 0.25s ease,
            opacity 0.25s ease;
        }

        .mobile-burger.open span:first-child {
          transform: translateY(3px) rotate(45deg);
        }

        .mobile-burger.open span:last-child {
          transform: translateY(-3px) rotate(-45deg);
        }

        .mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #111;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 0.3s ease,
            visibility 0.3s ease;
        }

        .mobile-menu.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .mobile-navigation {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 22px;
        }

        .header-grain {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 998;
          opacity: 0.08;
          mix-blend-mode: screen;
        }

        @media (max-width: 900px) {
          .site-navigation {
            display: none;
          }

          .mobile-burger {
            display: flex;
          }

          .language-switch {
            right: 76px;
          }
        }

        @media (max-width: 480px) {
          .site-logo {
            left: 18px;
          }

          .mobile-burger {
            right: 12px;
          }

          .language-switch {
            right: 62px;
          }
        }
      `}</style>
    </>
  );
}
