import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'Twitter / X', href: '#' },
    { label: 'Dribbble', href: '#' },
];

export default function ContactSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // No scroll-triggered animations — CSS handles visibility
    }, []);

    // Magnetic hover effect
    const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
        gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    };

    return (
        <section className="panel contact" ref={sectionRef}>
            <div className="contact__label" ref={labelRef}>Kontakt</div>
            <h2 className="contact__heading" ref={headingRef}>
                Stwórzmy coś{' '}
                <a
                    href="mailto:placeholder@email.com"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    razem
                </a>
            </h2>

            <div className="contact__links" ref={linksRef}>
                {socialLinks.map((link, i) => (
                    <a
                        className="contact__link"
                        href={link.href}
                        key={i}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {link.label}
                    </a>
                ))}
            </div>

            <div className="contact__footer" ref={footerRef}>
                © 2026 — Wszelkie prawa zastrzeżone
            </div>
        </section>
    );
}
