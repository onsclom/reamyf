// @ts-check

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx = canvas.getContext('2d');
const exampleScript = document.getElementById('code').textContent


//run script "exampleScript" with ctx
EasyLang.run(exampleScript, ctx);

function step() {
  // UpdateUI();
  //console.log("nice")
  EasyLang.runAnimationFrame()
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);