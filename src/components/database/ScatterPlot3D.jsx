// @ts-nocheck
/**
 * ScatterPlot3D — WebGL 3D scatter using Three.js (already in package.json)
 * Props:
 *   points  : { x, y, z, biomass, color }[]
 *   xLabel, yLabel, zLabel : string
 *   height  : number (px)
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function ScatterPlot3D({
  points  = [],
  xLabel  = 'X',
  yLabel  = 'Y',
  zLabel  = 'Z',
  height  = 440,
}) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || points.length === 0) return;

    const w = container.clientWidth || 600;
    const h = height;

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9fafb);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.01, 200);
    camera.position.set(2.4, 1.8, 2.4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.borderRadius = '12px';
    container.appendChild(renderer.domElement);

    // ── Controls ──────────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping   = true;
    controls.dampingFactor   = 0.06;
    controls.minDistance     = 0.5;
    controls.maxDistance     = 8;

    // ── Normalise data to [-1, 1]³ ────────────────────────────────────────
    const valid = points.filter(p =>
      Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z)
    );
    if (valid.length === 0) { renderer.dispose(); return; }

    const xs = valid.map(p => p.x);
    const ys = valid.map(p => p.y);
    const zs = valid.map(p => p.z);
    const xMin = Math.min(...xs), xMax = Math.max(...xs);
    const yMin = Math.min(...ys), yMax = Math.max(...ys);
    const zMin = Math.min(...zs), zMax = Math.max(...zs);
    const norm = (v, lo, hi) => (hi === lo ? 0 : ((v - lo) / (hi - lo)) * 2 - 1);

    // ── Point cloud ───────────────────────────────────────────────────────
    const posArr = new Float32Array(valid.length * 3);
    const colArr = new Float32Array(valid.length * 3);
    const tmpCol = new THREE.Color();

    valid.forEach((p, i) => {
      posArr[i * 3]     = norm(p.x, xMin, xMax);
      posArr[i * 3 + 1] = norm(p.y, yMin, yMax);
      posArr[i * 3 + 2] = norm(p.z, zMin, zMax);
      tmpCol.set(p.color ?? '#22c55e');
      colArr[i * 3]     = tmpCol.r;
      colArr[i * 3 + 1] = tmpCol.g;
      colArr[i * 3 + 2] = tmpCol.b;
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
    geo.setAttribute('color',    new THREE.BufferAttribute(colArr, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      sizeAttenuation: true,
    });

    const cloud = new THREE.Points(geo, mat);
    scene.add(cloud);

    // ── Axes (colour-coded X=red, Y=green, Z=blue) ────────────────────────
    const axMat = new THREE.LineBasicMaterial({ vertexColors: true });
    const axVerts = new Float32Array([
      -1,-1,-1,  1,-1,-1,   // X
      -1,-1,-1, -1, 1,-1,   // Y
      -1,-1,-1, -1,-1, 1,   // Z
    ]);
    const axCols = new Float32Array([
      1,0.25,0.25, 1,0.25,0.25,
      0.2,0.75,0.2, 0.2,0.75,0.2,
      0.3,0.3,1,   0.3,0.3,1,
    ]);
    const axGeo = new THREE.BufferGeometry();
    axGeo.setAttribute('position', new THREE.BufferAttribute(axVerts, 3));
    axGeo.setAttribute('color',    new THREE.BufferAttribute(axCols, 3));
    scene.add(new THREE.LineSegments(axGeo, axMat));

    // Grid floor
    const grid = new THREE.GridHelper(2, 8, 0xd1d5db, 0xe5e7eb);
    grid.position.y = -1;
    scene.add(grid);

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // ── Axis label sprites ────────────────────────────────────────────────
    function makeLabel(text, color) {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 72;
      const ctx = c.getContext('2d');
      ctx.font = 'bold 26px Inter, system-ui, sans-serif';
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 128, 36);
      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true })
      );
      sp.scale.set(0.65, 0.18, 1);
      return sp;
    }
    const xSp = makeLabel(xLabel, '#ef4444'); xSp.position.set(1.22, -1.05, -1);
    const ySp = makeLabel(yLabel, '#22c55e'); ySp.position.set(-1.22, 1.15, -1);
    const zSp = makeLabel(zLabel, '#3b82f6'); zSp.position.set(-1, -1.05, 1.22);
    scene.add(xSp, ySp, zSp);

    // ── Raycaster / hover tooltip ─────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.04;
    const mouse = new THREE.Vector2(-9, -9);

    const onMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(cloud);
      if (hits.length > 0) {
        const p = valid[hits[0].index];
        setTooltip({
          cx: e.clientX - rect.left,
          cy: e.clientY - rect.top,
          biomass: p.biomass,
          px: p.x, py: p.y, pz: p.z,
        });
        renderer.domElement.style.cursor = 'crosshair';
      } else {
        setTooltip(null);
        renderer.domElement.style.cursor = 'grab';
      }
    };
    renderer.domElement.addEventListener('mousemove', onMove);

    // ── Animation loop ────────────────────────────────────────────────────
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      const nw = container.clientWidth;
      camera.aspect = nw / h;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, h);
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('mousemove', onMove);
      controls.dispose();
      geo.dispose(); mat.dispose(); axGeo.dispose(); axMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [points, xLabel, yLabel, zLabel, height]);

  if (points.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-border text-muted-foreground text-sm"
        style={{ height }}>
        No data available for 3D view with current filters.
      </div>
    );
  }

  return (
    <div className="relative select-none">
      <div ref={containerRef} style={{ height }} className="rounded-xl overflow-hidden border border-border" />

      {tooltip && (
        <div
          className="absolute z-50 glass-card rounded-xl p-2.5 text-xs border border-border shadow-lg pointer-events-none space-y-0.5"
          style={{ left: tooltip.cx + 14, top: Math.max(tooltip.cy - 70, 4) }}
        >
          <p className="font-bold text-sm text-foreground mb-1">{tooltip.biomass}</p>
          <p><span className="text-red-500 font-semibold">{xLabel}:</span> {tooltip.px?.toFixed(2)}</p>
          <p><span className="text-green-600 font-semibold">{yLabel}:</span> {tooltip.py?.toFixed(3)}</p>
          <p><span className="text-blue-500 font-semibold">{zLabel}:</span> {tooltip.pz?.toFixed(1)}</p>
        </div>
      )}

      <p className="mt-2 text-center text-[10px] text-muted-foreground">
        🖱 Drag to rotate · Scroll to zoom · Right-drag to pan
      </p>
    </div>
  );
}
