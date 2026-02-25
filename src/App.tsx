import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './index.css';

import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';

import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ExperienceSection from './components/ExperienceSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const SECTION_NAMES = ['Hero', 'O mnie', 'Doświadczenie', 'Umiejętności', 'Projekty', 'Kontakt'];

function App() {
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    const handlePreloaderComplete = useCallback(() => {
        setLoading(false);
    }, []);

    useEffect(() => {
        if (loading) return;

        // Wait for DOM to render after preloader is gone
        const timeout = setTimeout(() => {
            const wrapper = wrapperRef.current;
            if (!wrapper) return;

            const panels = gsap.utils.toArray<HTMLElement>('.panel');
            const totalWidth = panels.reduce((acc, panel) => acc + panel.offsetWidth, 0);

            // Main horizontal scroll
            const scrollTween = gsap.to(panels, {
                x: () => -(totalWidth - window.innerWidth),
                ease: 'none',
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 1,
                    end: () => `+=${totalWidth - window.innerWidth}`,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        // Update progress bar
                        if (progressRef.current) {
                            progressRef.current.style.width = `${self.progress * 100}%`;
                        }
                        // Update active section
                        const sectionIndex = Math.round(self.progress * (panels.length - 1));
                        setActiveSection(sectionIndex);
                    },
                },
            });

            ScrollTrigger.refresh();

            return () => {
                scrollTween.kill();
                ScrollTrigger.getAll().forEach((t) => t.kill());
            };
        }, 100);

        return () => clearTimeout(timeout);
    }, [loading]);

    return (
        <>
            {loading && <Preloader onComplete={handlePreloaderComplete} />}
            <CustomCursor />

            {/* Progress bar */}
            <div className="progress-bar" ref={progressRef} />

            {/* Section nav dots */}
            <nav className="section-nav">
                {SECTION_NAMES.map((name, i) => (
                    <button
                        key={i}
                        className={`section-nav__dot ${i === activeSection ? 'active' : ''}`}
                        title={name}
                        onClick={() => {
                            // Scroll to the corresponding section
                            const panels = document.querySelectorAll('.panel');
                            if (panels[i]) {
                                const totalScrollable =
                                    Array.from(panels).reduce((acc, p) => acc + (p as HTMLElement).offsetWidth, 0) -
                                    window.innerWidth;
                                const targetScroll = (i / (panels.length - 1)) * totalScrollable;
                                gsap.to(window, {
                                    scrollTo: targetScroll,
                                    duration: 1.5,
                                    ease: 'power3.inOut',
                                });
                            }
                        }}
                    />
                ))}
            </nav>

            {/* Horizontal scroll container */}
            <div ref={containerRef}>
                <div className="horizontal-scroll-wrapper" ref={wrapperRef}>
                    <HeroSection />
                    <AboutSection />
                    <ExperienceSection />
                    <SkillsSection />
                    <ProjectsSection />
                    <ContactSection />
                </div>
            </div>
        </>
    );
}

export default App;
