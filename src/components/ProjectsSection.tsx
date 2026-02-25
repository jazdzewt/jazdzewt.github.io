import { useEffect, useRef, useState } from 'react';

const projects = [
    {
        title: 'Projekt Placeholder #1',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.',
        tags: ['React', 'TypeScript', 'GSAP'],
        gradient: 'linear-gradient(135deg, #685155, #7A6F9B)',
    },
    {
        title: 'Projekt Placeholder #2',
        desc: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        tags: ['Next.js', 'Node.js', 'MongoDB'],
        gradient: 'linear-gradient(135deg, #7A6F9B, #8B85C1)',
    },
    {
        title: 'Projekt Placeholder #3',
        desc: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.',
        tags: ['Python', 'Flask', 'PostgreSQL'],
        gradient: 'linear-gradient(135deg, #8B85C1, #D4CDF4)',
    },
    {
        title: 'Projekt Placeholder #4',
        desc: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.',
        tags: ['Figma', 'UI/UX', 'Prototyping'],
        gradient: 'linear-gradient(135deg, #815E5B, #685155)',
    },
];

export default function ProjectsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const [tiltState, setTiltState] = useState<Record<number, { x: number; y: number }>>({});

    useEffect(() => {
        // No GSAP animations — CSS handles visibility
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15;
        setTiltState((prev) => ({ ...prev, [index]: { x: y, y: x } }));
    };

    const handleMouseLeave = (index: number) => {
        setTiltState((prev) => ({ ...prev, [index]: { x: 0, y: 0 } }));
    };

    return (
        <section className="panel projects" ref={sectionRef}>
            <div className="projects__inner">
                <div className="projects__header" ref={headerRef}>
                    <div className="projects__label">Portfolio</div>
                    <h2 className="projects__heading">Wybrane<br />projekty</h2>
                </div>

                <div className="projects__grid" ref={gridRef}>
                    {projects.map((project, i) => (
                        <div
                            className="project-card"
                            key={i}
                            onMouseMove={(e) => handleMouseMove(e, i)}
                            onMouseLeave={() => handleMouseLeave(i)}
                            style={{
                                transform: `perspective(600px) rotateX(${tiltState[i]?.x || 0}deg) rotateY(${tiltState[i]?.y || 0}deg)`,
                                transition: tiltState[i] && (tiltState[i].x !== 0 || tiltState[i].y !== 0)
                                    ? 'transform 0.1s ease-out'
                                    : 'transform 0.5s ease-out',
                            }}
                        >
                            <div className="project-card__image">
                                <div
                                    className="project-card__image-placeholder"
                                    style={{ background: project.gradient }}
                                >
                                    {project.title}
                                </div>
                            </div>
                            <div className="project-card__overlay">
                                <div className="project-card__title">{project.title}</div>
                                <div className="project-card__desc">{project.desc}</div>
                                <div className="project-card__tags">
                                    {project.tags.map((tag, j) => (
                                        <span className="project-card__tag" key={j}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
