import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';


let mouse = new THREE.Vector2();

let scrollP = 0;
let prevScrollP = 0;
let dy = 0;

const clock = new THREE.Clock();

document.body.onscroll = ()=>{
    scrollP =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;
}

document.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerWidth);
},false);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 3;
const renderer = new THREE.WebGLRenderer();

renderer.setClearColor(0x0D1117,1);
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('canvas_container').appendChild(renderer.domElement);

const NUM_PARTICLES = 10000;
const vertices = new Float32Array(NUM_PARTICLES*3);
const copy_vertices = new Float32Array(NUM_PARTICLES*3);
const normals = new Float32Array(NUM_PARTICLES*3);
const geometry = new THREE.BufferGeometry();

let loaded = false;

const loader = new GLTFLoader();
loader.load("./scripts/scene.gltf",(gltf) =>{
    let brainMesh;
    gltf.scene.traverse((child) =>{
        if(child.isMesh){
            brainMesh = child;
        }
    });
    if(brainMesh){
        const sampler = new MeshSurfaceSampler(brainMesh).build();
        
        const pos = new THREE.Vector3();
        const norm = new THREE.Vector3();
        for(let i=0;i<NUM_PARTICLES;i++){
            sampler.sample(pos,norm);
            vertices[i*3] = pos.x;
            vertices[i*3 + 1] = pos.y;
            vertices[i*3 + 2] = pos.z;
            
            copy_vertices[i*3] = pos.x;
            copy_vertices[i*3 + 1] = pos.y;
            copy_vertices[i*3 + 2] = pos.z;

            normals[i*3] = norm.x;
            normals[i*3 + 1] = norm.y;
            normals[i*3 + 2] = norm.z;
        }

        
        geometry.setAttribute('position',new THREE.BufferAttribute(vertices,3));
        geometry.setAttribute('normal',new THREE.BufferAttribute(normals,3));
        const material = new THREE.PointsMaterial({color:0xffffff,size:0.001,transparent:false});
        const points = new THREE.Points(geometry,material);
        scene.add(points);

        loaded = true;
    }
},undefined,(err)=>{
    console.error('Impossibile caricare il modello: ${err}');
});

function animate() {
    requestAnimationFrame(animate);
    if(loaded){
        // Faccio ruotare la scena per vedere il 3D
        const pos = new THREE.Vector3();
        const positions = geometry.getAttribute('position');
        const normals = geometry.getAttribute('normal');
        scene.rotation.y += 0.005;
        
        const vector = new THREE.Vector3(mouse.x,mouse.y,0.5);

        dy = (scrollP - prevScrollP)*0.01;
        
        for(let i=0;i<NUM_PARTICLES;i++){
            const pulse = (clock.getDelta() + i)*0.01;
            const n = new THREE.Vector3(normals.getX(i),normals.getY(i),normals.getZ(i));
            var p = new THREE.Vector3(vertices[i*3],copy_vertices[i * 3 +1],vertices[i*3+2]);
            positions.setXYZ(i,p.x,p.y + dy*pulse,p.z);
        }

        prevScrollP = scrollP;
        
        positions.needsUpdate = true;
        console.log(dy);
        
    }
    renderer.render(scene, camera);
}

animate();