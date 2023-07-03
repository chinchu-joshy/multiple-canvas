var canvas = new fabric.StaticCanvas('c');
var image;
var imgEl = document.createElement('img');
imgEl.crossOrigin = 'anonymous';
imgEl.onload = function() {
  image = new fabric.Image(imgEl);
  image.filters = [new       fabric.Image.filters.HueRotation()];
  canvas.add(image);
}
imgEl.src = './Model/test.jpg';


document.getElementById('hue').onclick= function() {
    
   image.filters[0].rotation = 2 * Math.random() - 1;
   console.log(image.filters[0].rotation)
   image.applyFilters();
  canvas.requestRenderAll();
};