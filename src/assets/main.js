import gsap from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let backgroundColor = 0xd4dafc;

// Materials Video
const video = document.createElement("video");
video.src = "/videos/programming.mp4";
video.loop = true;
video.muted = true;
video.play();

const videoTexture = new THREE.VideoTexture(video);
videoTexture.wrapS = THREE.RepeatWrapping;
videoTexture.wrapT = THREE.RepeatWrapping;
videoTexture.repeat.set(0.7, 0.5);
const videoMaterial = new THREE.MeshStandardMaterial({
  map: videoTexture,
  color: 0xbfbfbf,
  emissiveMap: videoTexture,
  emissive: new THREE.Color(0x444444),
  emissiveIntensity: 1.0,
  roughness: 0.15,
  metalness: 0.0,
});

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(backgroundColor);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(window.innerWidth, window.innerHeight); //set awal
// Optimation Colors
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

renderer.setClearColor(backgroundColor, 1.0); // background color, pengganti scene.background

document.body.appendChild(renderer.domElement);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 6, 4);

// Lightnings
const ambientLight = new THREE.AmbientLight(0xeceffe, 1);
scene.add(ambientLight);

// const dirLight = new THREE.DirectionalLight(0xffffff, 4);
const dirLight = new THREE.DirectionalLight(0xe7e7e7ff, 4);
dirLight.position.set(15, 20, 7);
dirLight.castShadow = true;
dirLight.shadow.bias = -0.0005;
dirLight.shadow.normalBias = 0.02;

dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;

dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

scene.add(dirLight);

// const helper = new THREE.CameraHelper(dirLight.shadow.camera);
// scene.add(helper);

// FOG
// scene.fog = new THREE.Fog(0xe5e7eb, 20, 30);
// scene.fog = new THREE.FogExp2(0xe5e7eb, 0.067);
scene.fog = new THREE.FogExp2(backgroundColor, 0.05);

renderer.setAnimationLoop(animate);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 2, 0);
// Max height
controls.minPolarAngle = Math.PI / 180;
controls.maxPolarAngle = Math.PI / 2;
// Max width
controls.minAzimuthAngle = Math.PI / 340;
controls.maxAzimuthAngle = Math.PI / 1.8;
// Max Zoom
controls.minDistance = 2;
controls.maxDistance = 15;
// Key
controls.mouseButtons = {
  LEFT: THREE.MOUSE.ROTATE,
  MIDDLE: THREE.MOUSE.DOLLY,
  // RIGHT: THREE.MOUSE.PAN,
  RIGHT: THREE.MOUSE.ROTATE,
};
controls.update();

// Loading screen
const loadingText = document.getElementById("loading-text");
const loadingScreen = document.getElementById("loading-screen");

// BLENDER OBJ

const interactiveObjects = {
  Computer: {
    object: null,
    scale: 1.1,
  },
  Books: {
    object: null,
    scale: 1.1,
  },
  Guitar: {
    object: null,
    scale: 1.2,
  },
  GithubLogo: {
    object: null,
    action: () => {
      window.open("https://github.com", "_blank");
    },
    scale: 1.3,
  },
  InstagramLogo: {
    object: null,
    action: () => {
      window.open("https://instagram.com/ervan.khalifa", "_blank");
    },
    scale: 1.3,
  },
  TiktokLogo: {
    object: null,
    action: () => {
      window.open("https://tiktok.com", "_blank");
    },
    scale: 1.3,
  },
  YoutubeLogo: {
    object: null,
    action: () => {
      window.open("https://youtube.com", "_blank");
    },
    scale: 1.3,
  },
  LinkInLogo: {
    object: null,
    action: () => {
      window.open("https://linkedin.com", "_blank");
    },
    scale: 1.3,
  },
  CameraModel: {
    object: null,
    scale: 1.25,
  },
  Telephone: {
    object: null,
    scale: 1.2,
  },
  Images: {
    object: null,
    scale: 1.2,
  },
};

const loader = new GLTFLoader();
loader.load(
  "/models/Bedroom.glb",
  (gltf) => {
    const bedroomObject = gltf.scene;
    interactiveObjects.Computer.object = bedroomObject.getObjectByName("Computer");
    interactiveObjects.Guitar.object = bedroomObject.getObjectByName("Guitar");
    interactiveObjects.Books.object = bedroomObject.getObjectByName("Books");
    interactiveObjects.GithubLogo.object = bedroomObject.getObjectByName("GithubLogo");
    interactiveObjects.InstagramLogo.object = bedroomObject.getObjectByName("InstagramLogo");
    interactiveObjects.TiktokLogo.object = bedroomObject.getObjectByName("TiktokLogo");
    interactiveObjects.YoutubeLogo.object = bedroomObject.getObjectByName("YoutubeLogo");
    interactiveObjects.LinkInLogo.object = bedroomObject.getObjectByName("LinkInLogo");
    interactiveObjects.CameraModel.object = bedroomObject.getObjectByName("CameraModel");
    interactiveObjects.Telephone.object = bedroomObject.getObjectByName("Telephone");
    interactiveObjects.Images.object = bedroomObject.getObjectByName("Images");

    bedroomObject.traverse((child) => {
      // console.log(child.name);
      if (child.isMesh) {
        child.receiveShadow = true;
        if (child.name === "Ground") {
          child.castShadow = false;
        } else {
          child.castShadow = true;
        }
        if (child.name === "GlassMonitor") {
          child.material = videoMaterial;
        }
      }
    });
    gsap.to("#loading-screen", {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        loadingScreen.remove();
      },
    });
    scene.add(bedroomObject);
  },
  (xhr) => {
    const percent = (xhr.loaded / xhr.total) * 100;

    loadingText.textContent = `Loading ${Math.round(percent)}%`;
  },
  (error) => {
    console.error(error);
  },
);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentHovered = false;

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
});

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (!intersects.length) return;

  const parentName = intersects[0].object.parent?.name;

  const item = interactiveObjects[parentName];

  if (item?.action) {
    item.action();
  }
});

function animate(time) {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  const hoveredParentName = intersects[0]?.object.parent?.name;

  if (hoveredParentName && interactiveObjects[hoveredParentName]) {
    const item = interactiveObjects[hoveredParentName];

    document.body.style.cursor = "pointer";

    if (currentHovered !== item.object) {
      if (currentHovered) {
        gsap.to(currentHovered.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.3,
        });
      }

      gsap.to(item.object.scale, {
        x: item.scale,
        y: item.scale,
        z: item.scale,
        duration: 0.3,
        ease: "power2.out",
      });

      currentHovered = item.object;
    }
  } else {
    document.body.style.cursor = "default";

    if (currentHovered) {
      gsap.to(currentHovered.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.3,
        ease: "power2.out",
      });

      currentHovered = null;
    }
  }

  if (intersects.length > 0) {
    const object = intersects[0].object;
  }

  renderer.render(scene, camera);
}

// Handling Resize Browser
window.addEventListener("resize", () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  // Sinkronisasikan Post Processing
});
