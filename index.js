// @ts-check
/// <reference path="lib/codemirror.js" />

document.getElementById('codeMirrorId').textContent=example1

const codeArea = /** @type {HTMLTextAreaElement} */ (document.getElementById('codeMirrorId'))
var editor = CodeMirror.fromTextArea( codeArea, {
  lineNumbers: true
});

//editor.setSize("50%", "100%")

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx = canvas.getContext('2d');
const exampleScript = document.getElementById('codeMirrorId').textContent

// TODO: abstractify this away in easyLang.js
let runNumber = 0
let curAnimationFrameId;

function step() {
  EasyLang.runAnimationFrame()
  curAnimationFrameId = window.requestAnimationFrame(step);
}


document.getElementById("runButton").onclick = () => {
  EasyLang.run(editor.getValue(), ctx);
  window.cancelAnimationFrame(curAnimationFrameId)
  window.requestAnimationFrame(step);
}

document.getElementById("stopButton").onclick = () => {
  window.cancelAnimationFrame(curAnimationFrameId)
}