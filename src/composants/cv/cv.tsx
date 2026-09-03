"use client";

import Image from "next/image";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Header from "@/composants/header/header";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const BASE_PATH = "/inessogadzi";

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

      if (cursorRef.current !== null) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      if (trailRef.current !== null) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
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
    </>
  );
}

/* ============================================================
   GRAIN
============================================================ */

const GRAIN_OPACITY = 0.13;
const GRAIN_SAMPLES = 3;
const GRAIN_UPDATE_EVERY = 4;

function GrainOverlay(): React.JSX.Element {
  const grainCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainCanvasRef.current;

    if (canvas === null) {
      return;
    }

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

    const resize = (): void => {
      if (disposed) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const generateGrain = (): void => {
      if (disposed || canvas.width <= 0 || canvas.height <= 0) {
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
          Math.min(255, Math.round(128 + centered)),
        );

        pixels[i] = luminance;
        pixels[i + 1] = luminance;
        pixels[i + 2] = luminance;
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

    resize();
    generateGrain();

    window.addEventListener("resize", resize);

    animationFrame = window.requestAnimationFrame(animate);

    return (): void => {
      disposed = true;

      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);

      if (canvas.parentElement === body) {
        body.removeChild(canvas);
      }
    };
  }, []);

  return (
    <canvas ref={grainCanvasRef} aria-hidden="true" className="grain-canvas" />
  );
}

/* ============================================================
   MISE À L'ÉCHELLE DE LA CARTE CV
============================================================ */

const CV_DESIGN_WIDTH = 1180;

function ScaledCvPaper({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [paperHeight, setPaperHeight] = useState(0);

  useEffect(() => {
    const outerEl = outerRef.current;
    const paperEl = paperRef.current;

    if (outerEl === null || paperEl === null) {
      return;
    }

    const update = (): void => {
      const availableWidth = outerEl.offsetWidth;
      const nextScale = Math.min(1, availableWidth / CV_DESIGN_WIDTH);

      setScale(nextScale);
      setPaperHeight(paperEl.offsetHeight);
    };

    update();

    const resizeObserver = new ResizeObserver(update);

    resizeObserver.observe(outerEl);
    resizeObserver.observe(paperEl);

    window.addEventListener("resize", update);

    return (): void => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="cv-scale-outer"
      style={{
        height: paperHeight > 0 ? paperHeight * scale : undefined,
      }}
    >
      <div
        ref={paperRef}
        className="cv-paper"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   PETITE ICÔNES
============================================================ */

function MailIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-icon">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 7l8 6 8-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function LocationIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-icon">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="10"
        r="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon(): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="contact-icon">
      <rect
        x="7"
        y="3"
        width="10"
        height="18"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle cx="12" cy="17.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

/* ============================================================
   CV
============================================================ */

export default function CV(): React.JSX.Element {
  return (
    <>
      <Header textColor="#111111" />

      <CursorTrail />

      <main className={`${spaceGrotesk.className} cv-page`}>
        {/* ====================================================
            FORMES DÉCORATIVES
        ==================================================== */}

        <div className="shape shape-blue" />
        <div className="shape shape-beige" />
        <div className="shape shape-bottom" />

        {/* ====================================================
            CONTENU CV
        ==================================================== */}

        <div className="cv-wrapper">
          <ScaledCvPaper>
            {/* ================================================
                COLONNE GAUCHE
            ================================================ */}

            <aside className="sidebar">
              {/* PHOTO */}

              <div className="photo-wrapper">
                <Image
                  src={`${BASE_PATH}/projects/photo-ines.jpg`}
                  alt="Inès SOGADZI"
                  fill
                  priority
                  sizes="180px"
                  className="photo"
                />
              </div>

              {/* CONTACT */}

              <div className="contact">
                <a
                  href="mailto:ines.sogadzi@hotmail.fr"
                  className="contact-item"
                >
                  <MailIcon />
                  <span>ines.sogadzi@hotmail.fr</span>
                </a>

                <a href="tel:+33781603996" className="contact-item">
                  <PhoneIcon />
                  <span>+33 7 81 60 39 96</span>
                </a>
              </div>

              {/* COMPÉTENCES */}

              <section className="sidebar-section">
                <h2>COMPÉTENCES</h2>

                <ul className="bullet-list">
                  <li>Marketing digital 360°</li>

                  <li>Communication digitale</li>

                  <li>
                    Création de contenus
                    <br />
                    (photo, vidéo, montage){" "}
                  </li>

                  <li>Community management</li>

                  <li>Direction artistique</li>

                  <li>Gestion de projet</li>

                  <li>
                    Référencement naturel <br /> (SEO)
                  </li>
                  <li>Campagnes d'acquisition</li>
                  <li>
                    Email marketing
                    <br />
                    &amp; newsletter
                  </li>

                  <li>
                    Analyse des
                    <br />
                    performances (KPIs)
                  </li>
                  <li>
                    Veille stratégique et <br />
                    concurrentielle{" "}
                  </li>
                </ul>
              </section>

              {/* INFORMATIQUE */}

              <section className="sidebar-section computer-section">
                <h2>INFORMATIQUE</h2>

                <div className="small-text">
                  <p>
                    <strong>CMS :</strong> Wordpress, Hubspot, WIX
                  </p>

                  <p>
                    <strong>Gestion de projet :</strong>
                    <br />
                    Google Marketing Platform (Analytics, Ads), Trello, Miro,
                    Zapier
                  </p>

                  <p>
                    <strong>PAO :</strong> Photoshop, Illustrator, InDesign,
                    After Effects, Premiere Pro, Figma, Canva
                  </p>

                  <p>
                    <strong>Pack Office :</strong> Excel, PowerPoint, Word
                  </p>

                  <p>
                    <strong>Programmation :</strong> HTML, CSS, JavaScript,
                    MySQL, PHP
                  </p>

                  <p>
                    <strong>CRM :</strong> MailChimp, Odoo
                  </p>
                </div>
              </section>

              {/* ATOUTS */}

              <section className="sidebar-section">
                <h2>ATOUTS</h2>

                <ul className="strengths">
                  <li>Sens du détail</li>
                  <li>Autonomie</li>
                  <li>Adaptabilité</li>
                  <li>Rigueur</li>
                  <li>Proactivité</li>
                  <li>Créativité</li>
                </ul>
              </section>

              {/* LANGUES */}

              <section className="sidebar-section languages">
                <h2>LANGUES</h2>

                <p>
                  <strong>Français</strong>
                  <br />
                  Langue maternelle
                </p>
                <p>
                  <strong>Anglais</strong>
                  <br />
                  Courant
                </p>
              </section>

              {/* REFERENCES */}

              <section className="sidebar-section languages">
                <h2>RÉFÉRENCES</h2>

                <p>
                  <strong>Pierre Ployart</strong>
                  <br />
                  Country Manager France, Coros
                  <br />
                  <a
                    href="https://fr.linkedin.com/in/pierre-ployart"
                    className="contact-item"
                  >
                    {" "}
                    https://fr.linkedin.com/in/pierre-ployart
                  </a>
                </p>

                <p>
                  <strong>Shannon Kierse</strong>
                  <br />
                  Marketing Manager, Atlantic Centre of Education <br />
                  <a
                    href="https://ie.linkedin.com/in/shannon-kierse-914488113"
                    className="contact-item"
                  >
                    {" "}
                    https://ie.linkedin.com/in/shannon-kierse-914488113{" "}
                  </a>
                </p>
              </section>
            </aside>

            {/* ================================================
                COLONNE DROITE
            ================================================ */}

            <div className="main-column">
              {/* ============================================
                  INTRODUCTION
              ============================================ */}

              <section className="intro">
                <h1>Inès SOGADZI</h1>

                <div className="job-title">
                  MARKETING DIGITAL | COMMUNICATION | GESTION DE PROJET
                </div>
              </section>

              {/* ============================================
                  EXPÉRIENCES
              ============================================ */}

              <section className="cv-section">
                <h2 className="section-title">EXPÉRIENCES PROFESSIONNELLES</h2>

                <div className="timeline">
                  {/* EXPERIENCE 1 */}

                  <article className="timeline-item">
                    <div className="timeline-dot" />

                    <div className="experience">
                      <h3>Erasmus + | Assistante Marketing</h3>

                      <div className="meta">
                        <span>De jan. 2026 à juin 2026</span>

                        <strong>Atlantic Centre of Education</strong>

                        <span>Galway, Ireland</span>
                      </div>

                      <p>
                        <em>
                          Gestion de la communication et du marketing digital de
                          deux entités : une école d'anglais (Atlantic Centre of
                          Education) et quatre complexes de résidences en
                          location saisonnière (Galway Lakeside Apartments)
                          accueillant respectivement une clientèle
                          internationale .{" "}
                        </em>
                      </p>

                      <ul className="experience-list">
                        <li>
                          Pilotage de la <strong>présence digitale</strong> des
                          deux marques (sites web, réseaux sociaux et
                          e-réputation), incluant les mises à jour de contenu,
                          les améliorations UX et les audits de sites
                        </li>

                        <li>
                          Conception et déploiement des{" "}
                          <strong>campagnes Meta Ads et Google Ads</strong>{" "}
                          destinées à promouvoir les formations et les offres
                          d'hébergement : Spring Courses, Summer Courses,
                          campagne LinkedIn, Summer Sales des résidences.
                        </li>

                        <li>
                          Création et publication de{" "}
                          <strong>80 contenus</strong> sur les réseaux sociaux
                          (40 pour l'école, 40 pour les résidences).
                        </li>

                        <li>
                          Réalisation de{" "}
                          <strong>shootings photo hebdomadaires</strong> afin
                          d'alimenter les supports de communication et
                          production de <strong>6 interviews vidéo</strong>{" "}
                          mettant en avant les étudiants et l'établissement.
                        </li>

                        <li>
                          Rédaction, conception et envoi des{" "}
                          <strong>newsletters et campagnes emailing</strong> via
                          HubSpot et Mailchimp{" "}
                        </li>

                        <li>
                          Développement de{" "}
                          <strong>5 partenariats stratégiques</strong> (3 pour
                          l'école, 2 pour les résidences).
                        </li>

                        <li>
                          Élaboration de <strong>reportings mensuels</strong> et
                          suivi des performances marketing (Google Analytics,
                          KPIs).
                        </li>
                        <li>
                          Réalisation d'une{" "}
                          <strong>veille stratégique et concurrentielle</strong>{" "}
                          afin d'identifier les tendances du marché et
                          d'accompagner les décisions en matière de
                          communication digitale et d'expérience utilisateur.
                        </li>
                      </ul>
                    </div>
                  </article>

                  {/* EXPERIENCE 2 */}

                  <article className="timeline-item">
                    <div className="timeline-dot" />

                    <div className="experience">
                      <h3>Cheffe de Projet Digital</h3>

                      <div className="meta">
                        <span>De sept. 2023 à août 2025</span>

                        <strong>Meltour</strong>

                        <span>Saint-Maur-des-Fossés</span>
                      </div>

                      <div className="contract">Contrat d'apprentissage :</div>

                      <p>
                        <em>
                          Contrat d'apprentissage : Gestion de la stratégie
                          digitale et de la visibilité en ligne d'une agence
                          spécialisée dans les voyages sur mesure haut de gamme
                        </em>
                      </p>

                      <ul className="experience-list">
                        <li>
                          Gestion du site web WordPress, incluant l'
                          <strong>
                            optimisation de l'expérience utilisateur
                          </strong>{" "}
                          (UX), la <strong>gestion des contenus</strong> et le{" "}
                          <strong>suivi de la maintenance évolutive</strong>{" "}
                          (TMA) avec un prestataire externe.{" "}
                        </li>

                        <li>
                          <strong>
                            Développement du référencement naturel (SEO)
                          </strong>{" "}
                          grâce à la rédaction de{" "}
                          <strong>38 circuits de voyage</strong>, de{" "}
                          <strong>22 articles optimisés</strong> et à la
                          création de <strong>2 nouvelles rubriques</strong>, de
                          la recherche de mots-clés jusqu'à la mise en ligne,
                          <strong>
                            contribuant à une augmentation de 50 % du taux de
                            conversion et de 30 % du taux de clics.
                          </strong>{" "}
                        </li>

                        <li>
                          Rédaction, conception et diffusion de{" "}
                          <strong>25 newsletters</strong>
                          ainsi que de <strong>185 publications</strong> sur
                          Instagram et Facebook, incluant l'élaboration du
                          calendrier éditorial, la rédaction des contenus et la
                          conception des visuels, contribuant à une{" "}
                          <strong>
                            croissance de 50 % de la communauté Instagram.
                          </strong>{" "}
                        </li>

                        <li>
                          Gestion des <strong>campagnes Google Ads</strong>, en
                          collaboration avec les consultants Google, afin
                          d'optimiser la visibilité et les performances des
                          campagnes.{" "}
                        </li>

                        <li>
                          <strong>
                            Suivi, analyse et reporting hebdomadaires et
                            mensuels des KPIs
                          </strong>{" "}
                          via Google Analytics afin d'évaluer les performances
                          des actions digitales et d'identifier les axes
                          d'optimisation.{" "}
                        </li>

                        <li>
                          Réalisation de{" "}
                          <strong>veilles concurrentielles</strong> afin
                          d'identifier les tendances du secteur et de soutenir
                          l'évolution de la stratégie digitale.{" "}
                        </li>
                      </ul>
                    </div>
                  </article>
                </div>
              </section>

              {/* ============================================
                  FORMATIONS
              ============================================ */}

              <section className="cv-section education-section">
                <h2 className="section-title">DIPLÔMES ET FORMATIONS</h2>

                <div className="timeline">
                  {/* MASTER */}

                  <article className="timeline-item">
                    <div className="timeline-dot" />

                    <div className="education">
                      <h3>Master Cultures et Métiers du Web</h3>

                      <div className="meta">
                        <span>De sept. 2023 à août 2025</span>

                        <strong>Université Gustave Eiffel</strong>

                        <span>Champs-sur-Marne</span>
                      </div>
                      <p>
                        <strong>Mention :</strong> Bien
                      </p>
                      <ul className="experience-list">
                        <li>
                          Projets et Création (documentaire interactif, web
                          design, projet web)
                        </li>

                        <li>Sciences sociales et numérique</li>

                        <li>
                          Cultures visuelles (photographie, néo-géographie)
                        </li>

                        <li>
                          Codage (base de données, HTML/CSS, PHP/SQL, CMS,
                          JAVASCRIPT)
                        </li>
                      </ul>

                      <div className="education-details">
                        <p>
                          <strong>Spécialisation:</strong> Réalisation du
                          documentaire interactif{" "}
                          <em>Le Trot : les voix d'hier échos d'aujourd'hui</em>
                        </p>

                        <p>
                          Responsable image et Directrice artistique sur le set
                          <strong>| réalisé en Corée du Sud</strong>{" "}
                        </p>

                        <p>
                          <strong>Option :</strong> Gestion de projet et
                          lancement du site web <em>Sevran en mouvement</em>
                        </p>

                        <p>
                          Designer UX/UI et Développeuse web{" "}
                          <strong>
                            | projet soutenu auprès de Stéphane Blanchet{" "}
                          </strong>{" "}
                          (Maire de Sevran)
                        </p>
                      </div>
                    </div>
                  </article>

                  {/* LICENCE */}

                  <article className="timeline-item">
                    <div className="timeline-dot" />

                    <div className="education">
                      <h3>
                        Licence d'Arts - études visuelles, médias et arts
                        numériques
                      </h3>

                      <div className="meta">
                        <span>De sept. 2020 à mai 2023</span>

                        <strong>Université Gustave Eiffel</strong>

                        <span>Champs-sur-Marne</span>
                      </div>

                      <div className="education-details">
                        <p>
                          <strong>Option :</strong> arts visuels et sonores
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </ScaledCvPaper>

          {/* ==================================================
              DOWNLOAD
          ================================================== */}

          <div className="download-zone">
            <a
              href={`${BASE_PATH}/projects/cv.pdf`}
              download="cv-ines-sogadzi.pdf"
              className="download-button"
            >
              <span>TÉLÉCHARGER LE CV</span>

              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 3v12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M7 11l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M5 21h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>
            </a>
          </div>
        </div>

        <GrainOverlay />
      </main>

      <style jsx global>{`
        /* =====================================================
           RESET
        ===================================================== */

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          background: #f7f7f3;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* =====================================================
           CURSEUR
        ===================================================== */

        html,
        body,
        body * {
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
          background: rgba(17, 17, 17, 0.62);
          box-shadow:
            0 0 10px rgba(17, 17, 17, 0.14),
            0 0 24px rgba(17, 17, 17, 0.07);
          transform: translate3d(-100px, -100px, 0);
          will-change: transform;
        }

        /* =====================================================
           PAGE
        ===================================================== */

        .cv-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          background: #f7f7f3;
          color: #111111;
          font-family: ${spaceGrotesk.style.fontFamily};
          isolation: isolate;
        }

        /* =====================================================
           HEADER
        ===================================================== */

        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 82px;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 500;
          pointer-events: none;
        }

        .logo {
          width: 42px;
          height: 42px;
          display: block;
          pointer-events: auto;
        }

        .logo :global(img) {
          display: block;
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .header-right {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 42px;
          height: 42px;
        }

        .header-label {
          font-size: 11px;
          line-height: 1;
          font-weight: 600;
          letter-spacing: 0.15em;
          opacity: 0.55;
        }

        /* =====================================================
           FORMES
        ===================================================== */

        .shape {
          position: fixed;
          pointer-events: none;
          z-index: 0;
        }

        .shape-blue {
          width: 54vw;
          height: 72vh;
          top: -18vh;
          right: -12vw;
          border-radius: 48% 52% 45% 55% / 40% 46% 54% 60%;
          background: #e8f1f7;
          transform: rotate(13deg);
        }

        .shape-beige {
          width: 38vw;
          height: 48vh;
          top: -17vh;
          left: -10vw;
          border-radius: 45% 55% 60% 40% / 55% 42% 58% 45%;
          background: #ecebe4;
          transform: rotate(-11deg);
        }

        .shape-bottom {
          width: 48vw;
          height: 32vh;
          bottom: -18vh;
          left: 12vw;
          border-radius: 55% 45% 52% 48% / 50% 58% 42% 50%;
          background: #eeeae3;
          transform: rotate(-17deg);
        }

        /* =====================================================
           WRAPPER
        ===================================================== */

        .cv-wrapper {
          position: relative;
          z-index: 10;
          width: min(1180px, calc(100% - 80px));
          margin: 0 auto;
          padding: 112px 0 80px;
        }

        /* =====================================================
           MISE À L'ÉCHELLE DE LA CARTE
        ===================================================== */

        .cv-scale-outer {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        /* =====================================================
           FEUILLE CV
        ===================================================== */

        .cv-paper {
          position: absolute;
          top: 0;
          left: 0;
          width: 1180px;
          transform-origin: top left;
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          min-height: 1510px;
          overflow: hidden;
          background: rgba(255, 255, 252, 0.9);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.055),
            0 4px 20px rgba(0, 0, 0, 0.025);
        }

        /* =====================================================
           SIDEBAR
        ===================================================== */

        .sidebar {
          position: relative;
          z-index: 2;
          padding: 52px 30px 48px 34px;
          background: rgba(248, 248, 243, 0.83);
        }

        /* =====================================================
           PHOTO
        ===================================================== */

        .photo-wrapper {
          position: relative;
          width: 178px;
          height: 178px;
          margin: 0 auto 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }

        .photo {
          object-fit: cover;
          object-position: center center;
        }

        /* =====================================================
           CONTACT
        ===================================================== */

        .contact {
          display: flex;
          flex-direction: column;
          gap: 11px;
          margin-bottom: 32px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #111111;
          text-decoration: none;
          font-size: 12px;
          line-height: 1.25;
          font-weight: 400;
        }

        .contact-icon {
          flex: 0 0 auto;
          width: 16px;
          height: 16px;
        }

        /* =====================================================
           SIDEBAR SECTIONS
        ===================================================== */

        .sidebar-section {
          margin-top: 30px;
        }

        .sidebar-section h2 {
          margin: 0 0 13px;
          font-family:
            "Anton", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 19px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.06em;
        }

        .strengths {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .strengths li {
          margin-bottom: 8px;
          font-size: 12.5px;
          line-height: 1.15;
          font-weight: 700;
        }

        .bullet-list {
          margin: 0;
          padding-left: 17px;
        }

        .bullet-list li {
          margin: 0 0 5px;
          padding-left: 0;
          font-size: 11.5px;
          line-height: 1.15;
          font-weight: 400;
        }

        .small-text {
          font-size: 10.8px;
          line-height: 1.24;
        }

        .small-text p {
          margin: 0 0 7px;
        }

        .small-text strong {
          font-weight: 700;
        }

        .languages p {
          margin: 0;
          font-size: 11.5px;
          line-height: 1.35;
        }

        .languages strong {
          font-weight: 700;
        }

        /* =====================================================
           COLONNE PRINCIPALE
        ===================================================== */

        .main-column {
          position: relative;
          z-index: 3;
          min-width: 0;
          padding: 38px 42px 54px 34px;
        }

        /* =====================================================
           INTRO
        ===================================================== */

        .intro {
          margin-bottom: 28px;
        }

        .intro h1 {
          margin: 0;
          text-align: right;
          font-family:
            "Anton", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 30px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        .job-title {
          margin-top: 15px;
          text-align: right;
          color: #b9bca5;
          font-size: 21px;
          line-height: 1;
          font-weight: 400;
          letter-spacing: 0.015em;
        }

        /* =====================================================
           SECTIONS
        ===================================================== */

        .cv-section {
          margin-top: 28px;
        }

        .education-section {
          margin-top: 25px;
        }

        .section-title {
          margin: 0 0 12px;
          font-family:
            "Anton", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 20px;
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.045em;
        }

        /* =====================================================
           TIMELINE
        ===================================================== */

        .timeline {
          position: relative;
          padding-left: 25px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          top: 4px;
          bottom: 0;
          left: 5px;
          width: 1.5px;
          background: #5c5c59;
        }

        .timeline-item {
          position: relative;
          padding: 0 0 18px;
        }

        .timeline-item:last-child {
          padding-bottom: 0;
        }

        .timeline-dot {
          position: absolute;
          top: 2px;
          left: -24px;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #111111;
        }

        .timeline-item h3 {
          margin: 0 0 5px;
          font-size: 13.2px;
          line-height: 1.2;
          font-weight: 700;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 4px;
          color: #6f6f6f;
          font-size: 11px;
          line-height: 1.25;
        }

        .meta strong {
          color: #111111;
          font-weight: 500;
        }

        .contract {
          margin-top: 3px;
          color: #555555;
          font-size: 11px;
          line-height: 1.2;
        }

        .experience-list {
          margin: 5px 0 0;
          padding-left: 16px;
        }

        .experience-list li {
          margin: 0 0 2px;
          padding-left: 0;
          font-size: 11.2px;
          line-height: 1.18;
          font-weight: 400;
        }

        .education .experience-list {
          margin-top: 6px;
        }

        .education-details {
          margin-top: 15px;
        }

        .education-details p {
          margin: 0 0 3px;
          font-size: 11.2px;
          line-height: 1.2;
        }

        .education-details strong {
          font-weight: 700;
        }

        .education-details em {
          font-style: italic;
        }

        /* =====================================================
           DOWNLOAD
        ===================================================== */

        .download-zone {
          display: flex;
          justify-content: center;
          padding-top: 34px;
        }

        .download-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-width: 190px;
          height: 44px;
          padding: 0 20px;
          border-radius: 3px;
          background: #777777;
          color: #ffffff;
          text-decoration: none;
          font-family:
            "Anton", Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.045em;
          transition:
            transform 180ms ease,
            opacity 180ms ease,
            background 180ms ease;
        }

        .download-button svg {
          width: 17px;
          height: 17px;
        }

        .download-button:hover {
          transform: translateY(-2px);
          opacity: 0.82;
          background: #686868;
        }

        /* =====================================================
           GRAIN
        ===================================================== */

        .grain-canvas {
          position: fixed;
          inset: 0;
          width: 100vw;
          height: 100dvh;
          display: block;
          pointer-events: none;
          z-index: 2147483640;
          opacity: 1;
          mix-blend-mode: multiply;
          image-rendering: pixelated;
          background: transparent;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          isolation: isolate;
        }

        /* =====================================================
           TABLETTE / MOBILE
        ===================================================== */

        @media (max-width: 900px) {
          html,
          body,
          body * {
            cursor: auto !important;
          }

          .custom-cursor,
          .custom-cursor-trail {
            display: none;
          }

          .cv-wrapper {
            width: calc(100% - 32px);
            padding: 92px 0 60px;
          }
        }

        @media (max-width: 650px) {
          .download-button {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .cv-wrapper {
            width: calc(100% - 20px);
            padding: 84px 0 50px;
          }
        }

        /* =====================================================
           PRINT
        ===================================================== */

        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            width: 210mm;
            background: #ffffff !important;
          }

          body * {
            cursor: auto !important;
          }

          .cv-page {
            width: 210mm;
            min-height: 297mm;
            background: #ffffff;
          }

          .site-header,
          .download-zone,
          .grain-canvas,
          .custom-cursor,
          .custom-cursor-trail {
            display: none !important;
          }

          .shape {
            position: absolute;
          }

          .cv-wrapper {
            width: 210mm;
            padding: 0;
            margin: 0;
          }

          .cv-scale-outer {
            height: auto !important;
            overflow: visible;
          }

          .cv-paper {
            position: static;
            width: 210mm;
            min-height: 297mm;
            transform: none !important;
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
}
