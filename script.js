const canvas = document.getElementById("drawCanvas");
const context = canvas.getContext("2d");

const width = window.innerWidth;
const height = window.innerHeight;

canvas.width = width;
canvas.height = height;
canvas.style.backgroundColor = "white";

let line_color = "black";
let line_width = 5;
let is_drawing = false;
let drawArray = [];
let index = -1;
let removedArray = [];
let removedArrayIndex = -1;

canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", end, false);
canvas.addEventListener("mouseup", end, false);
canvas.addEventListener("mouseout", end, false);

function start(event) {
  is_drawing = true;
  context.beginPath();
  context.moveTo(
    event.clientX - canvas.offsetLeft,
    event.clientY - canvas.offsetTop
  );
    event.preventDefault();
}
function selectColor(element) {
  line_color = element.style.backgroundColor;
}
function draw(event) {
  if (is_drawing) {
    removedArray = [];
    removedArrayIndex = -1;
    context.lineTo(
      event.clientX - canvas.offsetLeft,
      event.clientY - canvas.offsetTop
    );
    context.lineWidth = line_width;
    context.strokeStyle = line_color;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }
}
function end(event) {
  if (is_drawing) {
    is_drawing = false;
    context.closePath();
  }
  event.preventDefault();
  if (event.type != "mouseout") {
    drawArray.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
  }
}
function undoLast() {
  if (index <= 0) {
    clearCanvas();
  } else {
    removedArray.push(drawArray[index]);
    removedArrayIndex += 1;
    index -= 1;
    drawArray.pop();
    context.putImageData(drawArray[index], 0, 0);
  }
}
function redoLast() {
  if (removedArrayIndex > -1) {
    drawArray.push(removedArray[removedArrayIndex]);
    index += 1;
    removedArray.pop();
    removedArrayIndex -= 1;
    context.putImageData(drawArray[index], 0, 0);
  }
}
function clearCanvas(element) {
  context.clearRect(0, 0, width, height);
  drawArray = [];
  index = -1;
}
function showHide() {
  document.getElementById("widthRange").classList.toggle("show");
}
function changeColor(element) {
  line_color = element.value;
  document.querySelector(".fa-droplet").style.color = element.value;
}
window.addEventListener("resize", () => {
  location.reload();
});

function initDownload() {
  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = "canvas-drawing.png";
  link.click();
}
