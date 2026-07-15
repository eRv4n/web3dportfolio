import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// 1. Scene & Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Tambah warna latar belakang
let bedroomObject = null;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

// 2. Tambahkan Pencahayaan agar model GLB terlihat
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// 3. OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableZoom = false;
controls.enableRotate = false;

// 4. Posisi Kamera & Target Orbit (sangat penting!)
camera.position.set(5, 8, 5);
controls.target.set(0, 0, 0); // Pastikan OrbitControls menghadap ke tengah
controls.update();

// Fungsi render khusus untuk OrbitControls
controls.addEventListener("change", () => {
  renderer.render(scene, camera);
});

// 5. GLTFLoader (pastikan path model benar, misal: './models/Bedroom1.glb')
const loader = new GLTFLoader();
loader.load(
  "/models/Bedroom3.glb", // Gunakan ./ agar path relatif
  function (gltf) {
    bedroomObject = gltf.scene;
    scene.add(bedroomObject);
    renderer.render(scene, camera); // Render sekali setelah model dimuat
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

// 6. Animation Loop
function animate(time) {
  // controls.update() wajib dipanggil di setiap frame jika auto-rotate atau dampening aktif
  if (bedroomObject) {
    // time / 1000 mengubah milidetik menjadi detik.
    // Anda bisa mengalikan atau membaginya untuk mengatur kecepatan putaran.
    bedroomObject.rotation.y = time / 5000;
  }
  controls.update();
  renderer.render(scene, camera);
}
