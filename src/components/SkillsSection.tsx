import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';

// Neutral, muted colour palette
const skills = [
    { name: 'JavaScript', icon: '⚡', color: '#8A7040', metalness: 0.9 },
    { name: 'TypeScript', icon: '🔷', color: '#3E6080', metalness: 0.9 },
    { name: 'React', icon: '⚛️', color: '#306878', metalness: 0.4 },
    { name: 'Node.js', icon: '🟢', color: '#3A6648', metalness: 0.4 },
    { name: 'Python', icon: '🐍', color: '#4A5880', metalness: 0.4 },
    { name: 'CSS/SCSS', icon: '🎨', color: '#5E5082', metalness: 0.4 },
    { name: 'Figma', icon: '🖌️', color: '#684670', metalness: 0.4 },
    { name: 'Git', icon: '📦', color: '#784030', metalness: 0.4 },
];

const SIZE = 140; // canvas/orb size in px

// ─────────────────────────────────────────────────────────────
//  Bake emoji onto a canvas and return it as a CanvasTexture.
//  White background = multiplicative identity → sphere base
//  colour shows through unmodified; lighting still applies above.
// ─────────────────────────────────────────────────────────────
function makeEmojiTexture(emoji: string, res = 512): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = res;
    c.height = res;
    const ctx = c.getContext('2d')!;

    // White base so MeshStandardMaterial colour multiplies unchanged
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, res, res);

    // Draw emoji centred
    const fs = Math.round(res * 0.44);
    ctx.font = `${fs}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, res / 2, res / 2 + fs * 0.04); // slight optical y-offset

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}


export default function SkillsSection() {
    const wrapperRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const cleanups: (() => void)[] = [];

        skills.forEach((skill, i) => {
            const wrapper = wrapperRefs.current[i];
            if (!wrapper) return;

            // ── Canvas ──────────────────────────────────────────
            const canvas = document.createElement('canvas');
            canvas.style.cssText = 'position:absolute;inset:0;border-radius:50%;display:block;';
            wrapper.appendChild(canvas);

            // ── Renderer ────────────────────────────────────────
            const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(SIZE, SIZE);
            renderer.setClearColor(0x000000, 0);

            // ── Scene / camera ──────────────────────────────────
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
            camera.position.z = 3.2;

            // ── Lights ──────────────────────────────────────────
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));

            const key = new THREE.DirectionalLight(0xfff8f0, 2.0);
            key.position.set(-2.5, 3.5, 4);
            scene.add(key);

            const rim = new THREE.PointLight(0x8899cc, 0.9, 20);
            rim.position.set(3, -2, -1);
            scene.add(rim);

            const fill = new THREE.PointLight(0xffffff, 0.35, 15);
            fill.position.set(0, -3, 3);
            scene.add(fill);

            // ── Sphere ──────────────────────────────────────────
            const geo = new THREE.SphereGeometry(1, 64, 64);
            const tex = makeEmojiTexture(skill.icon);
            const mat = new THREE.MeshStandardMaterial({
                map: tex,
                color: new THREE.Color(skill.color),
                metalness: skill.metalness,
            });
            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);

            // ── Render loop (slow axial spin) ────────────────────
            let rafId: number;
            const animate = () => {
                rafId = requestAnimationFrame(animate);
                mesh.rotation.y += 0.006;
                renderer.render(scene, camera);
            };
            animate();

            // ── Hover interactions ──────────────────────────────
            const onEnter = () => {
                gsap.to(mesh.scale, { x: 1.14, y: 1.14, z: 1.14, duration: 0.3, ease: 'power2.out' });
            };
            const onLeave = () => {
                gsap.to(mesh.scale, { x: 1, y: 1, z: 1, duration: 0.45, ease: 'power2.out' });
                gsap.to(mesh.rotation, { x: mesh.rotation.x % (Math.PI * 2), duration: 0.5, ease: 'power2.out' });
            };
            const onMove = (e: MouseEvent) => {
                const rect = wrapper.getBoundingClientRect();
                const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // -1..1
                const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
                gsap.to(mesh.rotation, { x: -ny * 0.45, y: nx * 0.45, duration: 0.25, ease: 'power1.out' });
            };

            wrapper.addEventListener('mouseenter', onEnter);
            wrapper.addEventListener('mouseleave', onLeave);
            wrapper.addEventListener('mousemove', onMove as EventListener);

            cleanups.push(() => {
                cancelAnimationFrame(rafId);
                wrapper.removeEventListener('mouseenter', onEnter);
                wrapper.removeEventListener('mouseleave', onLeave);
                wrapper.removeEventListener('mousemove', onMove as EventListener);
                renderer.dispose();
                geo.dispose();
                mat.dispose();
                tex.dispose();
                canvas.remove();
            });
        });

        return () => cleanups.forEach(fn => fn());
    }, []);

    return (
        <section
            className="panel skills"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem' }}
        >
            {/* Header */}
            <div className="skills__planet-header" style={{ textAlign: 'center' }}>
                <div className="skills__label">Umiejętności</div>
                <h2 className="skills__heading">Technologie &<br />narzędzia</h2>
            </div>

            {/* 4 × 2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${SIZE}px)`, gap: '2.8rem' }}>
                {skills.map((s, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>

                        {/* Orb wrapper — Three.js canvas is injected here */}
                        <div
                            ref={el => { if (el) wrapperRefs.current[i] = el; }}
                            style={{
                                position: 'relative',
                                width: SIZE,
                                height: SIZE,
                                borderRadius: '50%',
                                cursor: 'default',
                                // Subtle coloured glow beneath
                                filter: `drop-shadow(0 0 18px ${s.color}66)`,
                            }}
                        />

                        {/* Label below the sphere */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', pointerEvents: 'none' }}>
                            <span style={{ fontSize: 22 }}>{s.icon}</span>
                            <span style={{
                                fontFamily: 'var(--font-display)',
                                fontWeight: 600,
                                fontSize: 13,
                                color: 'var(--color-text-muted, rgba(255,255,255,0.7))',
                                letterSpacing: '0.04em',
                                textAlign: 'center',
                            }}>
                                {s.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
