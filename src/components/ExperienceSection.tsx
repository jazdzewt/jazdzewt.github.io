import { useEffect, useRef } from 'react';

const experiences = [
    {
        role: 'Placeholder — Stanowisko',
        company: 'Firma Placeholder Sp. z o.o.',
        date: '2023 — Obecnie',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
        role: 'Placeholder — Stanowisko',
        company: 'Inna Firma S.A.',
        date: '2021 — 2023',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
    {
        role: 'Placeholder — Stanowisko',
        company: 'Startup XYZ',
        date: '2019 — 2021',
        desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    },
    {
        role: 'Placeholder — Staż',
        company: 'Firma ABC',
        date: '2018 — 2019',
        desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    },
];

export default function ExperienceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // No GSAP animations — CSS handles visibility
    }, []);

    return (
        <section className="panel experience" ref={sectionRef}>
            <div className="experience__inner">
                <div className="experience__header" ref={headerRef}>
                    <div className="experience__label">Doświadczenie</div>
                    <h2 className="experience__heading">Moja ścieżka<br />kariery</h2>
                </div>

                <div className="experience__timeline" ref={itemsRef}>
                    {experiences.map((exp, i) => (
                        <div className="experience__item" key={i}>
                            <div className="experience__item-header">
                                <span className="experience__item-role">{exp.role}</span>
                                <span className="experience__item-date">{exp.date}</span>
                            </div>
                            <div className="experience__item-company">{exp.company}</div>
                            <div className="experience__item-desc">{exp.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
