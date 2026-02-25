import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const shape1Ref = useRef<HTMLDivElement>(null);
    const shape2Ref = useRef<HTMLDivElement>(null);
    const shape3Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const chars = titleRef.current?.querySelectorAll('.char');
            if (!chars) return;

            const tl = gsap.timeline({ delay: 3.2 });

            tl.to(chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1,
                stagger: 0.04,
                ease: 'power3.out',
            })
                .to(subtitleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                }, '-=0.4')
                .to(indicatorRef.current, {
                    opacity: 1,
                    duration: 0.6,
                }, '-=0.3');

            // Floating shapes parallax via mousemove
            const handleMouseMove = (e: MouseEvent) => {
                const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
                const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

                gsap.to(shape1Ref.current, { x: xPercent * 40, y: yPercent * 30, duration: 1, ease: 'power2.out' });
                gsap.to(shape2Ref.current, { x: xPercent * -25, y: yPercent * -20, duration: 1.2, ease: 'power2.out' });
                gsap.to(shape3Ref.current, { x: xPercent * 20, y: yPercent * 15, duration: 1, ease: 'power2.out' });
            };

            window.addEventListener('mousemove', handleMouseMove);
            return () => window.removeEventListener('mousemove', handleMouseMove);
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const firstName = 'IMIĘ';
    const lastName = 'NAZWISKO';

    return (
        <section className="panel hero" ref={sectionRef}>
            <div className="hero__shape hero__shape--1" ref={shape1Ref} />
            <div className="hero__shape hero__shape--2" ref={shape2Ref} />
            <div className="hero__shape hero__shape--3" ref={shape3Ref} />

            <h1 className="hero__title" ref={titleRef}>
                {firstName.split('').map((char, i) => (
                    <span className="char" key={`f-${i}`}>{char}</span>
                ))}
                <br />
                {lastName.split('').map((char, i) => (
                    <span className="char" key={`l-${i}`} style={{ color: 'var(--color-lavender)' }}>{char}</span>
                ))}
            </h1>

            <p className="hero__subtitle" ref={subtitleRef}>
                Creative Developer & Designer — Placeholder tagline for your portfolio
            </p>

            <div className="hero__scroll-indicator" ref={indicatorRef}>
                <span>Scroll</span>
                <div className="hero__scroll-line" />
            </div>
        </section>
    );
}
