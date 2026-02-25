import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const preloaderRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLSpanElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Exit animation
                const exitTl = gsap.timeline({
                    onComplete,
                });
                exitTl
                    .to(preloaderRef.current, {
                        yPercent: -100,
                        duration: 1,
                        ease: 'power4.inOut',
                    });
            },
        });

        // Animate name letters in
        if (nameRef.current) {
            const chars = nameRef.current.querySelectorAll('span');
            tl.to(chars, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: 'power3.out',
            }, 0);
        }

        // Animate counter & bar
        const obj = { val: 0 };
        tl.to(obj, {
            val: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                const v = Math.round(obj.val);
                setCounter(v);
                if (barRef.current) {
                    barRef.current.style.width = `${v}%`;
                }
            },
        }, 0.3);

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    const nameChars = 'IMIĘ NAZWISKO'.split('');

    return (
        <div className="preloader" ref={preloaderRef}>
            <div className="preloader__name" ref={nameRef}>
                {nameChars.map((char, i) => (
                    <span key={i}>{char === ' ' ? '\u00A0' : char}</span>
                ))}
            </div>
            <div className="preloader__counter">
                <span ref={counterRef}>{counter}</span>%
            </div>
            <div className="preloader__bar-track">
                <div className="preloader__bar-fill" ref={barRef} />
            </div>
        </div>
    );
}
