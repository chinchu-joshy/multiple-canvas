let line;
let mouseDown = false;
let canvas = new fabric.Canvas("canvas", {
  width: window.innerWidth,
  height: window.innerHeight,
});
let newLineCoords={}
let addingLineBtn = document.getElementById("adding-line");
let deactivate = document.getElementById("deactivate");
deactivate.addEventListener("click", deactivateAddingLine);
addingLineBtn.addEventListener("click", activateAddingLine);
let addingLineBtnClicked = false;
function activateAddingLine() {
  if (addingLineBtnClicked === false) {
    objectSelectivity("added-line", false);
    addingLineBtnClicked = true;
    canvas.on({
      "mouse:down": startAddingLine,
      "mouse:move": startDrawingLine,
      "mouse:up": stopDrawingLine,
    });

    canvas.selection = false;
    canvas.hoverCursor = "auto";
  }
}

function startAddingLine(o) {
  mouseDown = true;
  const pointer = canvas.getPointer(o.e);
  line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
    id: "added-line",
    stroke: "red",
    strokeWidth: 3,
    selectable: false,
  });
  canvas.add(line);
  canvas.requestRenderAll();
}
function startDrawingLine(o) {
  if (mouseDown) {
    const pointer = canvas.getPointer(o.e);
    line.set({ x2: pointer.x, y2: pointer.y });
    canvas.requestRenderAll();
  }
}
function stopDrawingLine() {
  line.setCoords();
  mouseDown = false;
}
function deactivateAddingLine() {
  canvas.off({
    "mouse:down": startAddingLine,
    "mouse:move": startDrawingLine,
    "mouse:up": stopDrawingLine,
  });

  objectSelectivity("added-line", true);
  canvas.hoverCursor = "all-scroll";
  addingLineBtnClicked = false;
}
function objectSelectivity(id, varient) {
  canvas.getObjects().forEach((o) => {
    if (o.id === id) {
      o.set({
        selectable: varient,
      });
    }
  });
}
canvas.on({
  "object:moving":updateNewLineCoordinates,
  "selection:created":updateNewLineCoordinates,
  "selection:updated":updateNewLineCoordinates,
  "mouse:dblclick":addingControlPoints,
});

function updateNewLineCoordinates(o) {
  newLineCoords={}
  const obj=o.target;
  if(obj?.id==='added-line'){
    const centerX=obj.getCenterPoint().x
    const centerY=obj.getCenterPoint().y
   const x1offset=obj.calcLinePoints().x1
   const y1offset=obj.calcLinePoints().y1
   
   const x2offset=obj.calcLinePoints().x2
   const y2offset=obj.calcLinePoints().y2
   console.log("center points",centerX,centerY)
   console.log(x1offset,y1offset,x2offset,y2offset)
   newLineCoords={
    x1:centerX+x1offset,
    y1:centerY+y1offset,
    x2:centerX+x2offset,
    y2:centerY+y2offset
   }
  }
}
function addingControlPoints(o) {
  const obj = o.target;
  if (!obj) {
    return;
  } else {
    if (obj.id === "added-line") {
      const pointer1 = new fabric.Circle({
        radius: obj.strokeWidth * 3,
        fill: "blue",
        opacity: 0.5,
        top: newLineCoords.y1,
        left: newLineCoords.x1,
        originX: "center",
        originY: "center",
      });
      const pointer2 = new fabric.Circle({
        radius: obj.strokeWidth * 3,
        fill: "blue",
        opacity: 0.5,
        top: newLineCoords.y2,
        left: newLineCoords.x2,
        originX: "center",
        originY: "center",
        
      });
      canvas.add(pointer1, pointer2);
      canvas.requestRenderAll();
    }
  }
}


