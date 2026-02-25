import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AboutSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const linesRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({ delay: 0.2 });

            tl.from(imageRef.current, { scale: 0.9, opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' })
                .from([labelRef.current, headingRef.current], { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, '-=0.5');

            // Text lines reveal
            if (linesRef.current) {
                const lineSpans = linesRef.current.querySelectorAll('.line span');
                tl.to(lineSpans, { y: 0, stagger: 0.05, duration: 0.5, ease: 'power2.out' }, '-=0.3');
            }

            // Stats counter
            if (statsRef.current) {
                const statNumbers = statsRef.current.querySelectorAll('.about__stat-number');
                statNumbers.forEach((el) => {
                    const target = parseInt(el.getAttribute('data-value') || '0');
                    const obj = { val: 0 };
                    gsap.to(obj, {
                        val: target,
                        delay: 0.6,
                        duration: 1.5,
                        ease: 'power2.out',
                        onUpdate: () => {
                            el.textContent = Math.round(obj.val) + (el.getAttribute('data-suffix') || '');
                        },
                    });
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="panel about" ref={sectionRef}>
            <div className="about__inner">
                <div className="about__image-wrapper" ref={imageRef}>
                    <div className="about__image-placeholder">
                        TWOJE<br />ZDJĘCIE
                    </div>
                </div>

                <div className="about__content">
                    <div className="about__label" ref={labelRef}>O Mnie</div>
                    <h2 className="about__heading" ref={headingRef}>
                        Tworzę cyfrowe<br />doświadczenia
                    </h2>
                    <div className="about__text" ref={linesRef}>
                        <span className="line"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span></span>
                        <span className="line"><span>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span></span>
                        <span className="line"><span>Ut enim ad minim veniam, quis nostrud exercitation.</span></span>
                        <span className="line"><span>Duis aute irure dolor in reprehenderit in voluptate velit.</span></span>
                    </div>

                    <div className="about__stats" ref={statsRef}>
                        <div className="about__stat">
                            <div className="about__stat-number" data-value="5" data-suffix="+">0</div>
                            <div className="about__stat-label">Lat doświadczenia</div>
                        </div>
                        <div className="about__stat">
                            <div className="about__stat-number" data-value="30" data-suffix="+">0</div>
                            <div className="about__stat-label">Projektów</div>
                        </div>
                        <div className="about__stat">
                            <div className="about__stat-number" data-value="15" data-suffix="+">0</div>
                            <div className="about__stat-label">Klientów</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
