var canvas = new fabric.Canvas('c');

function upload(e) {
   var fileType = e.target.files[0].type;
   var url = URL.createObjectURL(e.target.files[0]);

   if (fileType === 'image/png') { //check if png
      fabric.Image.fromURL(url, function(img) {
         img.set({
            width: 180,
            height: 180
         });
         canvas.add(img);
      });
   } else if (fileType === 'image/svg+xml') { //check if svg
      fabric.loadSVGFromURL(url, function(objects, options) {
         var svg = fabric.util.groupSVGElements(objects, options);
         svg.scaleToWidth(180);
         svg.scaleToHeight(180);
         canvas.add(svg);
      });
   }
}
// canvas {
//    margin-top: 5px;
//    border: 1px solid #ccc
// }
// <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.7.13/fabric.min.js"></script>
// <input type="file" onchange="upload(event)">
// <canvas id="c" width="180" height="180"></canvas>