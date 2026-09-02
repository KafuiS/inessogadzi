"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function Header({ textColor = "#fff" }: { textColor?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  /* ========================================================= GRAIN ========================================================= */ useEffect(() => {
    if (!menuOpen) return;
    const canvasElement = grainCanvasRef.current;
    if (canvasElement === null) return;
    const context = canvasElement.getContext("2d");
    if (context === null) return;
    const canvas = canvasElement;
    const ctx = context;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    const GRAIN_ALPHA = 0.055;
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
    function renderGrain(): void {
      const imageData = ctx.createImageData(
        Math.floor(width * pixelRatio),
        Math.floor(height * pixelRatio),
      );
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const value = Math.random() * 255;
        pixels[i] = value;
        pixels[i + 1] = value;
        pixels[i + 2] = value;
        pixels[i + 3] = GRAIN_ALPHA * 255;
      }
      ctx.putImageData(imageData, 0, 0);
      animationFrame = requestAnimationFrame(renderGrain);
    }
    resize();
    window.addEventListener("resize", resize);
    renderGrain();
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [menuOpen]);
  /* ========================================================= BLOQUER LE SCROLL ========================================================= */ useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  /* ========================================================= FERMER LE MENU AVEC ESC ========================================================= */ useEffect(() => {
    if (!menuOpen) return;
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);
  return (
    <>
      {" "}
      {/* ===================================================== HEADER ===================================================== */}{" "}
      <header className="site-header">
        {" "}
        {/* ================================================= LOGO ================================================= */}{" "}
        <a href="/galerie" className="site-logo" aria-label="Galerie">
          {" "}
          <Image
            src="/projects/IS.png"
            alt="Logo"
            width={42}
            height={42}
            priority
          />{" "}
        </a>{" "}
        {/* ================================================= NAVIGATION DESKTOP ================================================= */}{" "}
        <nav className="site-navigation" aria-label="Navigation principale">
          {" "}
          <a href="/">ABOUT</a>
          <a href="/galerie">WORK</a>{" "}
          <a href="mailto:ines.sogadzi@hotmail.fr"> REACH OUT </a>{" "}
          <a href="/cv">CV</a>{" "}
        </nav>{" "}
        {/* ================================================= BURGER ================================================= */}{" "}
        <button
          type="button"
          className="mobile-burger"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          {" "}
          <span /> <span /> <span />{" "}
        </button>{" "}
      </header>{" "}
      {/* ===================================================== OVERLAY ===================================================== */}{" "}
      <div
        className={menuOpen ? "menu-overlay menu-overlay-open" : "menu-overlay"}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />{" "}
      {/* ===================================================== MENU MOBILE / TABLETTE ===================================================== */}{" "}
      <div
        className={menuOpen ? "mobile-menu mobile-menu-open" : "mobile-menu"}
        aria-hidden={!menuOpen}
      >
        {" "}
        {/* ================================================= GRAIN DU MENU ================================================= */}{" "}
        <canvas
          ref={grainCanvasRef}
          className="mobile-menu-grain"
          aria-hidden="true"
        />{" "}
        <div className="mobile-menu-content">
          {" "}
          {/* ================================================= TOP BAR ================================================= */}{" "}
          <div className="mobile-menu-top">
            {" "}
            {/* CROIX */}{" "}
            <button
              type="button"
              className="mobile-close"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              {" "}
              <span /> <span />{" "}
            </button>{" "}
          </div>{" "}
          {/* ================================================= NAVIGATION MOBILE ================================================= */}{" "}
          <nav className="mobile-navigation" aria-label="Navigation mobile">
            {" "}
            <a href="/" onClick={() => setMenuOpen(false)}>
              {" "}
              ABOUT{" "}
            </a>{" "}
            <a
              href="mailto:ines.sogadzi@hotmail.fr"
              onClick={() => setMenuOpen(false)}
            >
              {" "}
              REACH OUT{" "}
            </a>{" "}
            <a href="/cv" onClick={() => setMenuOpen(false)}>
              {" "}
              CV{" "}
            </a>{" "}
          </nav>{" "}
        </div>{" "}
      </div>{" "}
      <style jsx>{`
        /* ==================================================== HEADER ==================================================== */
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 90px;
          padding: 24px 32px;
          display: flex;
          align-items: flex-start;
          z-index: 5000;
          pointer-events: none;
        } /* ==================================================== LOGO ==================================================== */
        .site-logo {
          display: block;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          pointer-events: auto;
          color: #fff !important;
          text-decoration: none !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          cursor: pointer;
        }
        .site-logo img {
          display: block;
          width: 42px !important;
          height: 42px !important;
          max-width: 42px !important;
          max-height: 42px !important;
          object-fit: contain;
        } /* ==================================================== NAVIGATION DESKTOP SPACE GROTESK ==================================================== */
        .site-navigation {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 34px;
          pointer-events: auto;
        }
        .site-navigation a,
        .site-navigation a:link,
        .site-navigation a:visited,
        .site-navigation a:hover,
        .site-navigation a:active,
        .site-navigation a:focus {
          color: ${textColor} !important;
          background: transparent !important;
          font-family: "Space Grotesk", Arial, Helvetica, sans-serif !important;
          font-size: 12px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          letter-spacing: 0.045em !important;
          text-transform: uppercase !important;
          text-decoration: none !important;
          text-decoration-line: none !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
          white-space: nowrap;
          cursor: pointer;
          transition: opacity 150ms ease;
        }
        .site-navigation a:hover {
          opacity: 0.55;
        } /* ==================================================== BURGER ==================================================== */
        .mobile-burger {
          display: none;
          position: fixed;
          top: 16px;
          right: 18px;
          width: 44px;
          height: 44px;
          padding: 0;
          margin: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          pointer-events: auto;
          z-index: 6000;
        }
        .mobile-burger span {
          position: absolute;
          left: 11px;
          display: block;
          width: 22px;
          height: 1px;
          background: ${textColor};
        }
        .mobile-burger span:nth-child(1) {
          top: 12px;
        }
        .mobile-burger span:nth-child(2) {
          top: 19px;
        }
        .mobile-burger span:nth-child(3) {
          top: 26px;
        } /* ==================================================== OVERLAY ==================================================== */
        .menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 4000;
          background: rgba(0, 0, 0, 0.04);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition:
            opacity 250ms ease,
            visibility 250ms ease;
        }
        .menu-overlay-open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        } /* ==================================================== MENU MOBILE ==================================================== */
        .mobile-menu {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 43vh;
          min-height: 280px;
          max-height: 440px;
          z-index: 5000;
          background: rgba(8, 8, 8, 0.91);
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          overflow: hidden;
          transform: translateY(100%);
          transition:
            opacity 280ms ease,
            visibility 280ms ease,
            transform 350ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .mobile-menu-open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: translateY(0);
        } /* ==================================================== GRAIN ==================================================== */
        .mobile-menu-grain {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          display: block;
          pointer-events: none;
          opacity: 0.42;
          mix-blend-mode: screen;
        } /* ==================================================== CONTENU ==================================================== */
        .mobile-menu-content {
          position: relative;
          width: 100%;
          height: 100%;
          z-index: 20;
          display: flex;
          flex-direction: column;
        } /* ==================================================== TOP BAR ==================================================== */
        .mobile-menu-top {
          position: relative;
          width: 100%;
          height: 54px;
          flex: 0 0 54px;
        } /* ==================================================== CROIX ==================================================== */
        .mobile-close {
          position: absolute;
          top: 8px;
          right: 18px;
          width: 44px;
          height: 44px;
          padding: 0;
          margin: 0;
          border: 0;
          background: transparent;
          cursor: pointer;
          z-index: 6000;
        }
        .mobile-close span {
          position: absolute;
          top: 21px;
          left: 11px;
          width: 22px;
          height: 1px;
          background: #fff;
        }
        .mobile-close span:first-child {
          transform: rotate(45deg);
        }
        .mobile-close span:last-child {
          transform: rotate(-45deg);
        } /* ==================================================== NAVIGATION MOBILE SPACE GROTESK ==================================================== */
        .mobile-navigation {
          flex: 1;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
          gap: 2px;
          padding: 8px 0 18px;
        }
        .mobile-navigation a,
        .mobile-navigation a:link,
        .mobile-navigation a:visited,
        .mobile-navigation a:hover,
        .mobile-navigation a:active,
        .mobile-navigation a:focus {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 17px;
          padding: 3px 20px;
          margin: 0;
          color: #fff !important;
          background: transparent !important;
          font-family: "Space Grotesk", Arial, Helvetica, sans-serif !important;
          font-size: 12px !important;
          font-weight: 400 !important;
          line-height: 1 !important;
          letter-spacing: 0.055em !important;
          text-transform: uppercase !important;
          text-decoration: none !important;
          text-decoration-line: none !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          cursor: pointer;
          white-space: nowrap;
          transition:
            background-color 150ms ease,
            color 150ms ease;
        } /* ==================================================== HOVER — BANDE TRÈS FINE ==================================================== */
        .mobile-navigation a:hover,
        .mobile-navigation a:focus-visible {
          color: #000 !important;
          background: #fff !important;
        } /* ==================================================== TABLETTE ==================================================== */
        @media (max-width: 1024px) {
          .site-header {
            height: 70px;
            padding: 18px 20px;
          }
          .site-navigation {
            display: none;
          }
          .site-logo,
          .site-logo img {
            width: 34px !important;
            height: 34px !important;
            max-width: 34px !important;
            max-height: 34px !important;
          }
          .mobile-burger {
            display: block;
          }
          .mobile-navigation a,
          .mobile-navigation a:link,
          .mobile-navigation a:visited,
          .mobile-navigation a:hover,
          .mobile-navigation a:active,
          .mobile-navigation a:focus {
            min-height: 16px;
            padding: 3px 18px;
            font-size: 11px !important;
          }
        } /* ==================================================== MOBILE ==================================================== */
        @media (max-width: 700px) {
          .mobile-menu {
            height: 44vh;
            min-height: 270px;
            max-height: 410px;
          }
          .mobile-navigation a,
          .mobile-navigation a:link,
          .mobile-navigation a:visited,
          .mobile-navigation a:hover,
          .mobile-navigation a:active,
          .mobile-navigation a:focus {
            min-height: 16px;
            padding: 3px 18px;
            font-size: 11px !important;
          }
        } /* ==================================================== PETIT MOBILE ==================================================== */
        @media (max-width: 480px) {
          .mobile-burger {
            right: 12px;
          }
          .mobile-close {
            right: 12px;
          }
          .mobile-menu {
            height: 45vh;
            min-height: 260px;
          }
          .mobile-navigation a,
          .mobile-navigation a:link,
          .mobile-navigation a:visited,
          .mobile-navigation a:hover,
          .mobile-navigation a:active,
          .mobile-navigation a:focus {
            min-height: 15px;
            padding: 2px 16px;
            font-size: 10px !important;
          }
        }
      `}</style>{" "}
    </>
  );
}
