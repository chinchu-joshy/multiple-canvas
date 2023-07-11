import * as THREE from "./modules/Three.module.js";
import { FBXLoader } from "./modules/jsm/fbxloader.js";
import { OrbitControls } from "./modules/OrbitControls.js";

console.clear();
let flag = true;

/**
 * Fabricjs
 * @type {fabric}
 */
/* ------------------------------ initial setup ----------------------------- */
var canvas = new fabric.Canvas(document.getElementById("canvas"));
fabric.Object.prototype.objectCaching = false;
fabric.devicePixelRatio = 2;
var maincanvas = new fabric.Canvas(document.getElementById("maincanvas"), {
  viewportTransform: [0.99, 0, 0, 0.99, 120, -80],
});
maincanvas.backgroundColor = "#f5f5f0";
maincanvas.selection = false;
maincanvas.setWidth(512);
maincanvas.setHeight(512);
maincanvas.renderAll();
let clickedValue = "front";
let shape;
canvas.backgroundColor = "#f5f5f5";
canvas.selection = false;
canvas.setWidth(512);
canvas.setHeight(512);

let image;
const svgs = [
  "front",
  "bottom",
  "front_pocket",
  "side1",
  "side2",
  "top_pocket",
  "safeZone_bottom",
  "safeZone_front",
  "safeZone_front_pocket",
  "safeZone_side1",
  "safeZone_side2",
];
// fabric.JS
window.canvas = canvas;
/* --------------------- creating canvas to load all svg -------------------- */
var group = [];
let shapePath;
svgs.forEach((data) => {
  fabric.loadSVGFromURL(
    `./Model/BagPack/${data}.svg`,
    function (objects, options) {
      shape = fabric.util.groupSVGElements(objects, options);

      if (shape?.id === "front" && !shape?.id?.includes("safeZone")) {
        shapePath = new fabric.Path(shape.d, { objectCaching: false });
        shapePath.absolutePositioned = true;
      }

      shape.setCoords();
      shape.selectable = false;

      if (shape?.id) {
        if (!shape?.id?.includes("safeZone")) {
          shape.fill = "#ffffff";
        }
      }
      group.push(shape);
      window.canvas = canvas;

      canvas.add(shape);

      canvas.renderAll();
    },
    function (item, object) { }
  );
});
/* ------------------ creating canvas to load selected svg ------------------ */
const newGroup = [];
svgs.forEach((data) => {
  fabric.loadSVGFromURL(
    `./Model/BagPack/${data}.svg`,
    function (objects, options) {
      shape = fabric.util.groupSVGElements(objects, options);
      shape.setCoords();
      shape.selectable = false;
      let leftOffest = canvas.width / 2 - shape.width / 2;

      if (shape?.id === "front" && !shape?.id?.includes("safeZone")) {
        shapePath = new fabric.Path(shape.d, { objectCaching: false });
        shapePath.absolutePositioned = true;
        shape.setCoords();
        shape.selectable = false;
        shape.fill = "#ffffff";

        newGroup.push(shape);
        maincanvas.add(shape);

        maincanvas.renderAll();
      }

      if (data === "safeZone_front") {
        newGroup.push(shape);

        maincanvas.add(shape);

        maincanvas.renderAll();
      }
      
      canvas.renderAll();
    },
    function (item, object) { }
  );
});

/* ------------------------- click to load the image ------------------------ */
canvas.on("mouse:dblclick", mouseClick);
function mouseClick(e) {
  const object = canvas.getObjects();
  object.forEach((child) => {
    if (child?.id) {
      if (child?.id === "front" && !child?.id?.includes("safeZone")) {
        fabric.Image.fromURL("./Model/test.jpg", function (img) {
          const left = child.getBoundingRect().left;
          const top = child.getBoundingRect().top;
          const width = child.getBoundingRect().width;
          const height = child.getBoundingRect().height;

          
          img.isImage = true;
          canvas.add(
            img.set({
              left: left,
              top: top + height / 4,
              dirty: true,
              objectCaching: false,
              statefullCache: true,
              clipPath: shapePath,
            })
          );
         
          image = img
          img.setCoords();
        });
      }
      canvas.renderAll();
    }
  });
}
/* -------------------------- zooming of the canvas ------------------------- */
maincanvas.on("mouse:wheel", function (opt) {
  var delta = opt.e.deltaY;
  var zoom = maincanvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  maincanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();

  maincanvas.requestRenderAll();
  maincanvas.calcOffset();
});


/* -------------------------- switching the canvas -------------------------- */
$("#select").click(function () {
  canvas.clone(function(clonedCanvas) {
    
    let canvasJSON = clonedCanvas.toJSON();
    
    canvasJSON.objects.forEach((child)=>{
      if(child.isImage){
        
      }
    })
 });

  // flag = false;
   image && maincanvas.add(image);
  maincanvas.renderAll();
  $("#wrapper-main").css({
    "z-index": "0",
  });
  $("#wrapper").css({
    "z-index": "1",
  });
  canvas._objects.forEach((child) => {
    child.setCoords();
  });
  maincanvas._objects.forEach((child) => {
    child.setCoords();
  });
  canvas.requestRenderAll();
  maincanvas.requestRenderAll();
});
$("#deselect").click(function () {
  flag = true;
  image && canvas.add(image);
  canvas.renderAll();
  $("#wrapper").css({
    "z-index": "0",
  });
  $("#wrapper-main").css({
    "z-index": "1",
  });

  canvas._objects.forEach((child) => {
    console.log("inside canvas");
    child.setCoords();
  });
  maincanvas._objects.forEach((child) => {
    console.log("inside main canvas");
    child.setCoords();
  });
  canvas.requestRenderAll();
  maincanvas.requestRenderAll();
});
/* -------------------------- creating the 3d scene ------------------------- */
var containerHeight = "512";
var containerWidth = "512";
var camera,
  renderer,
  container,
  scene,
  texture,
  material,
  geometry,
  cube,
  texture2;

init();
animate();

/**
 * Configurator init function
 */

function init() {
  /**
   * Camera
   */

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.01,
    100
  );
  camera.position.set(0, 0, 3.5);

  /**
   * Renderer
   */

  container = document.getElementById("renderer");
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(containerWidth, containerHeight);
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.target.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  controls.minDistance = 2.0;
  controls.maxDistance = 10.0;
  controls.update();

  /**
   * Scene
   */

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  const light = new THREE.AmbientLight(0xffffff, 0.7); // soft white light
  scene.add(light);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
  scene.add(directionalLight);

  /**
   * Texture and material
   */
  console.log(flag);
  texture =
    flag === true
      ? new THREE.CanvasTexture(document.getElementById("canvas"))
      : new THREE.CanvasTexture(document.getElementById("maincanvas"));
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  material = new THREE.MeshBasicMaterial({ map: texture });

  /**
   * Model
   */

  const loader = new FBXLoader();
  loader.load("./Model/backpack.fbx", (obj) => {
    obj.traverse((child) => {
      if (
        child.name.includes("bottom") ||
        child.name.includes("front") ||
        child.name.includes("side1") ||
        child.name.includes("top")
      ) {
        child.material = new THREE.MeshStandardMaterial();
        child.material.map = texture;
        child.material.map.wrapS = THREE.RepeatWrapping;
        child.material.map.wrapT = THREE.RepeatWrapping;
        child.material.needsUpdate = true;
      }
    });
    obj.position.set(0, -0.5, 0);
    obj.scale.set(0.02, 0.02, 0.02);
    scene.add(obj);
  });

  geometry = new THREE.BoxGeometry(1, 1, 1);
  cube = new THREE.Mesh(geometry, material);
  //scene.add(cube);
}

/**
 * Configurator frame render function
 */

function animate() {
  requestAnimationFrame(animate);
  canvas.renderAll();
  maincanvas.renderAll();
  // cube.rotation.x += 0.004;
  // cube.rotation.y += 0.001;
  texture.needsUpdate = true;
  renderer.render(scene, camera);
}
/**
 * Listeners
 */

// adding pattern
window.check = function (currentSvg) {
  console.log(canvas.getActiveObject().getBoundingRect());
  console.log(canvas.getActiveObject());
  canvas.getActiveObject().clone((img) => {
    img.absolutePositioned = true;
    console.log(img);
    img.set({
      left: 40,
      top: 260,
    });
    canvas.add(img).renderAll();
    // img.set({
    //   left: activeObjectLeft + objectRotationLeftOffset,
    //   top: activeObjectTop + objectRotationTopOffset,
    //   clipPath: svgPath[activeObjectToRepeat.svgType],
    //   withoutTransform: true,
    // })
  });
};
