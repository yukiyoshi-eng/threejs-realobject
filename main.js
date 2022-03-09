import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

//uidebug
const gui = new GUI();

const myCanvas = document.getElementById("myCanvas");

//scene
const scene = new THREE.Scene();

//sizes
const sizes = {
  width: innerWidth,
  height: innerHeight,
};

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  3000
);
camera.position.set(0, 500, 1000);
scene.add(camera);

//renderer
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create cube render target
const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(500);

//cubeCamera
const cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
scene.add(cubeCamera);

//object
const sphereMaterial = new THREE.MeshBasicMaterial({
  envMap: cubeRenderTarget.texture,
  refractionRatio: 1, //屈折率
  reflectivity: 1,
  // wireframe: true,
});
const sphereGeometry = new THREE.SphereGeometry(350, 50, 50);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0, 100, 0);
scene.add(sphere);

//uidebug
gui.add(sphereMaterial, "refractionRatio").min(0).max(1).step(0.01);
gui.add(sphereMaterial, "reflectivity").min(0).max(1).step(0.01);

//controls
const controls = new OrbitControls(camera, myCanvas);
controls.enableDamping = true;

const urls = [
  "./envImage/right.png",
  "./envImage/left.png",
  "./envImage/up.png",
  "./envImage/down.png",
  "./envImage/front.png",
  "./envImage/back.png",
];

const loader = new THREE.CubeTextureLoader();
scene.background = loader.load(urls);

function animate() {
  cubeCamera.update(renderer, scene);
  renderer.render(scene, camera);
  controls.update();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

animate();