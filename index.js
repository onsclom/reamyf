// @ts-check

document.getElementById('codeMirrorId').textContent=`varset screen_size 200

# --- particle data -----------------
varset particle_amount 100
table particle_xs
table particle_ys
table particle_dxs
table particle_dys

# --- initializing particles --------
varset i 0
# initialize random start x, start y, speed x, and speed y for each particle)
@ INIT_PARTICLE
  rand rand_val 0 200
  tpush particle_xs rand_val

  rand rand_val 0 200
  tpush particle_ys rand_val

  rand rand_val -.25 .25
  tpush particle_dxs rand_val

  rand rand_val 1 1.5
  tpush particle_dys rand_val

  add i 1
  jumpif i < particle_amount INIT_PARTICLE

# --- animation loop ----------------
@ ANIMATION_LOOP
  clrsc 0
  varset i 0

  # -- move each particle
  @ UPDATE_PARTICLE
    t2v particle_xs i cur_x 
    t2v particle_dxs i cur_dx
    t2v particle_ys i cur_y
    t2v particle_dys i cur_dy

    add cur_x cur_dx
    add cur_y cur_dy

    # -- reset x if in negative
    jumpif curx > -1 PARTICLE_X_GOOD
    add cur_x 200
    @ PARTICLE_X_GOOD
    # -- reset y if in negative
    jumpif cury > -1 PARTICLE_Y_GOOD
    add cur_y 200
    @ PARTICLE_Y_GOOD

    v2t cur_x particle_xs i
    v2t cur_y particle_ys i

    add i 1
    jumpif i < particle_amount UPDATE_PARTICLE

    varset i 0

  # -- draw each particle
  @ DRAW_PARTICLE
    t2v particle_xs i drawable_x
    t2v particle_ys i drawable_y

    round drawable_x
    round drawable_y

    mod drawable_x screen_size
    mod drawable_y screen_size

    pixel drawable_x drawable_y

    add i 1
    jumpif i < particle_amount DRAW_PARTICLE`

const codeArea = /** @type {HTMLTextAreaElement} */ (document.getElementById('codeMirrorId'))
var editor = CodeMirror.fromTextArea( codeArea, {
  lineNumbers: true
});

editor.setSize("100%", "100%")

const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx = canvas.getContext('2d');
const exampleScript = document.getElementById('codeMirrorId').textContent

//run script "exampleScript" with ctx


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
  console.log(editor)
  window.cancelAnimationFrame(curAnimationFrameId)
}