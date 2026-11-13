
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#f3a18c');
scene.fog = new THREE.Fog('#f3a18c', 100, 520);

const camera = new THREE.PerspectiveCamera(
    70, innerWidth / innerHeight, 0.1, 1500
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
renderer.domElement.id = 'scene';

document.body.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffd9ce, 0x26384a, 2));

let sun = new THREE.DirectionalLight(0xffc69c, 3);
sun.position.set(-90, 130, 70);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
scene.add(sun);

const M = (c, r = 0.8) =>
    new THREE.MeshStandardMaterial({ color: c, roughness: r });

const road = M('#292e37');
const grass = M('#426b50');
const dark = M('#171b22');
const skin = M('#bd8464');
const shirt = M('#283242');
const pants = M('#151922');

function cube(x, y, z, a, b, c, m) {
    let o = new THREE.Mesh(
        new THREE.BoxGeometry(a, b, c), m
    );
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    scene.add(o);
    return o;
}

// Ground
cube(0, -0.3, 0, 900, 0.5, 900, grass);

// City roads
for (let n = -280; n <= 280; n += 40) {
    cube(n, 0.01, 0, 12, 0.05, 600, road);
    cube(0, 0.01, n, 600, 0.05, 12, road);
}

// Buildings
const facades = [
    '#c7b6a7', '#d7c5b3',
    '#9baab7', '#a99bb6',
    '#d5aa86', '#879b9c'
].map(M);

for (let x = -260; x <= 260; x += 40) {
    for (let z = -260; z <= 260; z += 40) {
        if (Math.random() < 0.12) continue;

        let w = 18 + Math.random() * 12;
        let d = 18 + Math.random() * 12;
        let h = 15 + Math.random() * 65;

        let b = cube(
            x, h / 2, z,
            w, h, d,
            facades[Math.floor(Math.random() * facades.length)]
        );

        for (let y = 4; y < h - 2; y += 4) {
            for (let xx = -w / 2 + 2; xx < w / 2 - 1; xx += 3) {
                cube(
                    b.position.x + xx,
                    y,
                    b.position.z + d / 2 + 0.04,
                    1.5, 1.6, 0.08,
                    M('#496b86', 0.25)
                );
            }
        }
    }
}

// Ocean
let sea = new THREE.Mesh(
    new THREE.PlaneGeometry(900, 180),
    new THREE.MeshStandardMaterial({
        color: '#167b9d',
        roughness: 0.2,
        metalness: 0.2
    })
);

sea.rotation.x = -Math.PI / 2;
sea.position.set(0, -0.15, -390);
scene.add(sea);

// Palm trees
for (let i = 0; i < 65; i++) {
    let x = -300 + Math.random() * 600;
    let z = -260 + Math.random() * 500;

    let tr = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.38, 8, 8),
        M('#78503a')
    );

    tr.position.set(x, 4, z);
    scene.add(tr);

    for (let a = 0; a < 6; a++) {
        let f = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 7, 5),
            M('#176b52')
        );

        f.rotation.z = -Math.PI / 2;
        f.rotation.y = a * Math.PI / 3;
        f.position.set(
            x + Math.cos(a * Math.PI / 3) * 2,
            8,
            z + Math.sin(a * Math.PI / 3) * 2
        );

        scene.add(f);
    }
}

// Sports cars
function car(color, x, z, rot = 0) {
    let g = new THREE.Group();
    g.position.set(x, 0.55, z);
    g.rotation.y = rot;
    scene.add(g);

    let body = new THREE.Mesh(
        new THREE.BoxGeometry(2.3, 0.65, 4.5),
        M(color, 0.25)
    );

    body.position.y = 0.1;
    body.castShadow = true;
    g.add(body);

    let cab = new THREE.Mesh(
        new THREE.BoxGeometry(1.65, 0.72, 2.15),
        new THREE.MeshStandardMaterial({
            color: '#80b8c8',
            roughness: 0.18,
            metalness: 0.1
        })
    );

    cab.position.set(0, 0.7, -0.25);
    g.add(cab);

    for (let X of [-1.15, 1.15]) {
        for (let Z of [-1.5, 1.5]) {
            let w = new THREE.Mesh(
                new THREE.CylinderGeometry(0.4, 0.4, 0.26, 16),
                dark
            );

            w.rotation.z = Math.PI / 2;
            w.position.set(X, -0.25, Z);
            g.add(w);
        }
    }

    return g;
}

let cars = [];

for (let i = 0; i < 35; i++) {
    cars.push(
        car(
            ['#11151b', '#b9253d', '#eee9df', '#2879a8', '#d5a239'][i % 5],
            -260 + Math.random() * 520,
            -260 + Math.random() * 520,
            Math.random() * 6.28
        )
    );
}

// Player
const player = new THREE.Group();
scene.add(player);
player.position.set(0, 0, 15);

function pc(x, y, z, a, b, c, m) {
    let o = new THREE.Mesh(
        new THREE.BoxGeometry(a, b, c), m
    );
    o.position.set(x, y, z);
    player.add(o);
}

pc(0, 1.3, 0, 0.7, 1.1, 0.4, shirt);
pc(0, 2.1, 0, 0.45, 0.45, 0.45, skin);
pc(-0.2, 0.5, 0, 0.23, 0.9, 0.27, pants);
pc(0.2, 0.5, 0, 0.23, 0.9, 0.27, pants);

// Controls
let keys = {};
let yaw = 0;
let vehicle = null;
let velocity = 0;

addEventListener('keydown', e => {
    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === 'f') {
        toggle();
    }
});

addEventListener('keyup', e => {
    keys[e.key.toLowerCase()] = false;
});

renderer.domElement.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener('mousemove', e => {
    if (document.pointerLockElement === renderer.domElement) {
        yaw -= e.movementX * 0.002;
    }
});

// Notifications
function say(t) {
    let el = document.getElementById('msg');
    el.textContent = t;
    el.style.opacity = 1;

    clearTimeout(window.tm);

    window.tm = setTimeout(() => {
        el.style.opacity = 0;
    }, 1800);
}

// Enter / Exit car
function toggle() {
    if (vehicle) {
        player.visible = true;
        player.position.copy(vehicle.position);
        vehicle = null;
        velocity = 0;
        say('Exited vehicle');
        return;
    }

    let near = cars.sort(
        (a, b) =>
            a.position.distanceTo(player.position) -
            b.position.distanceTo(player.position)
    )[0];

    if (near && near.position.distanceTo(player.position) < 5) {
        vehicle = near;
        player.visible = false;
        say('Vehicle entered — drive!');
    } else {
        say('Get closer to a vehicle');
    }
}

// Minimap
function minimap() {
    let c = document.getElementById('map');
    let x = c.getContext('2d');

    x.fillStyle = '#253541';
    x.fillRect(0, 0, 160, 160);

    x.strokeStyle = '#9ba8ad';
    x.lineWidth = 5;

    for (let i = 0; i < 8; i++) {
        x.beginPath();
        x.moveTo(i * 23, 0);
        x.lineTo(i * 23, 160);
        x.stroke();

        x.beginPath();
        x.moveTo(0, i * 23);
        x.lineTo(160, i * 23);
        x.stroke();
    }

    x.fillStyle = '#ff6bc8';
    x.beginPath();
    x.arc(80, 80, 5, 0, 7);
    x.fill();
}

minimap();

// Game loop
let clock = new THREE.Clock();

function loop() {
    requestAnimationFrame(loop);

    let dt = Math.min(clock.getDelta(), 0.04);

    if (vehicle) {
        if (keys.w) velocity = Math.min(velocity + 20 * dt, 38);
        else if (keys.s) velocity = Math.max(velocity - 28 * dt, -12);
        else velocity *= 0.985;

        if (keys.a) vehicle.rotation.y += 2 * dt * (velocity >= 0 ? 1 : -1);
        if (keys.d) vehicle.rotation.y -= 2 * dt * (velocity >= 0 ? 1 : -1);
        if (keys[' ']) velocity *= 0.88;

        vehicle.position.x += Math.sin(vehicle.rotation.y) * velocity * dt;
        vehicle.position.z += Math.cos(vehicle.rotation.y) * velocity * dt;

        camera.position.lerp(
            new THREE.Vector3(
                vehicle.position.x - Math.sin(vehicle.rotation.y) * 9,
                5,
                vehicle.position.z - Math.cos(vehicle.rotation.y) * 9
            ),
            0.09
        );

        camera.lookAt(vehicle.position.x, 1, vehicle.position.z);

    } else {
        let v = new THREE.Vector3(
            (keys.d ? 1 : 0) - (keys.a ? 1 : 0),
            0,
            (keys.s ? 1 : 0) - (keys.w ? 1 : 0)
        );

        if (v.length()) {
            v.normalize().applyAxisAngle(
                new THREE.Vector3(0, 1, 0),
                yaw
            );

            player.position.addScaledVector(
                v,
                (keys.shift ? 12 : 6) * dt
            );

            player.rotation.y = Math.atan2(v.x, v.z);
        }

        camera.position.lerp(
            new THREE.Vector3(
                player.position.x + Math.sin(yaw) * 9,
                5,
                player.position.z + Math.cos(yaw) * 9
            ),
            0.09
        );

        camera.lookAt(player.position.x, 1.5, player.position.z);
    }

    renderer.render(scene, camera);
}

loop();

// Responsive screen
addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

// Loading screen
setTimeout(() => {
    let b = document.getElementById('boot');
    b.style.opacity = 0;

    setTimeout(() => b.remove(), 1000);
}, 1500);
