const particles = `# --- particles example -----------------

varset screen_size 200

# --- particle data -----------------
varset particle_amount 100
list particle_xs
list particle_ys
list particle_dxs
list particle_dys

# --- initializing particles --------
varset i 0
# initialize random start x, start y, speed x, and speed y for each particle)
@ INIT_PARTICLE
  rand rand_val 0 200
  push particle_xs rand_val

  rand rand_val 0 200
  push particle_ys rand_val

  rand rand_val -1 1
  push particle_dxs rand_val

  rand rand_val -1 1
  push particle_dys rand_val

  add i 1
  jumpif i < particle_amount INIT_PARTICLE

# --- animation loop ----------------
@ ANIMATION_LOOP
  clrsc 0
  varset i 0

  # -- move each particle
  @ UPDATE_PARTICLE
    l2v particle_xs i cur_x 
    l2v particle_dxs i cur_dx
    l2v particle_ys i cur_y
    l2v particle_dys i cur_dy

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

    v2l cur_x particle_xs i
    v2l cur_y particle_ys i

    add i 1
    jumpif i < particle_amount UPDATE_PARTICLE

    varset i 0

  # -- draw each particle
  @ DRAW_PARTICLE
    l2v particle_xs i drawable_x
    l2v particle_ys i drawable_y

    round drawable_x
    round drawable_y

    mod drawable_x screen_size
    mod drawable_y screen_size

    pixel drawable_x drawable_y

    add i 1
    jumpif i < particle_amount DRAW_PARTICLE`;

const snow = `# --- snow example -----------------

varset screen_size 200

# --- particle data -----------------
varset particle_amount 100
list particle_xs
list particle_ys
list particle_dxs
list particle_dys

# --- initializing particles --------
varset i 0
# initialize random start x, start y, speed x, and speed y for each particle)
@ INIT_PARTICLE
  rand rand_val 0 200
  push particle_xs rand_val

  rand rand_val 0 200
  push particle_ys rand_val

  rand rand_val -.25 .25
  push particle_dxs rand_val

  rand rand_val .5 1
  push particle_dys rand_val

  add i 1
  jumpif i < particle_amount INIT_PARTICLE

# --- animation loop ----------------
@ ANIMATION_LOOP
  clrsc 0
  varset i 0

  # -- move each particle
  @ UPDATE_PARTICLE
    l2v particle_xs i cur_x 
    l2v particle_dxs i cur_dx
    l2v particle_ys i cur_y
    l2v particle_dys i cur_dy

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

    v2l cur_x particle_xs i
    v2l cur_y particle_ys i

    add i 1
    jumpif i < particle_amount UPDATE_PARTICLE

    varset i 0

  # -- draw each particle
  @ DRAW_PARTICLE
    l2v particle_xs i drawable_x
    l2v particle_ys i drawable_y

    round drawable_x
    round drawable_y

    mod drawable_x screen_size
    mod drawable_y screen_size

    pixel drawable_x drawable_y

    add i 1
    jumpif i < particle_amount DRAW_PARTICLE`;


const lines = `# --- lines example -----------------

varset screen_size 200

# --- particle data -----------------
varset particle_amount 10
list particle_xs
list particle_ys
list particle_dxs
list particle_dys

# --- initializing particles --------
varset i 0
# initialize random start x, start y, speed x, and speed y for each particle)
@ INIT_PARTICLE
  rand rand_val 0 200
  push particle_xs rand_val

  rand rand_val 0 200
  push particle_ys rand_val

  rand rand_val -1 1
  push particle_dxs rand_val

  rand rand_val -1 1
  push particle_dys rand_val

  add i 1
  jumpif i < particle_amount INIT_PARTICLE
  clrsc 0

# --- animation loop ----------------
@ ANIMATION_LOOP
  
  varset i 0

  # -- move each particle
  @ UPDATE_PARTICLE
    l2v particle_xs i cur_x 
    l2v particle_dxs i cur_dx
    l2v particle_ys i cur_y
    l2v particle_dys i cur_dy

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

    v2l cur_x particle_xs i
    v2l cur_y particle_ys i

    add i 1
    jumpif i < particle_amount UPDATE_PARTICLE

    varset i 0

  # -- draw each particle
  @ DRAW_PARTICLE
    l2v particle_xs i drawable_x
    l2v particle_ys i drawable_y

    round drawable_x
    round drawable_y

    mod drawable_x screen_size
    mod drawable_y screen_size

    pixel drawable_x drawable_y

    add i 1
    jumpif i < particle_amount DRAW_PARTICLE`;    

let examples = {};
examples["particles"] = particles;
examples["snow"] = snow;
examples["lines"] = lines;
