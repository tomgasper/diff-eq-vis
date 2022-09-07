import Two from "https://cdn.skypack.dev/two.js@latest";
import * as scene from "./scene.js";
import V_Field from "./v_field.js";

import config from "./config.js"

const state = config.state;
const style = config.style;

const screen = style.screen._ref;
const window = style.win._ref;

// stylize window and main scene
scene.stylizeWindow(window, state, style);
scene.stylizeScreen(screen, style);

// draw vector field
const v_field = new V_Field(state, style.screen._ref);
v_field.initVectorField();
v_field.drawVectorField();

// configure UI elements
scene.setUIelements(state, style, v_field);

// initialize graph line
scene.initGraphLine(state,style, Two);

// add circle indicators and calculate their paths
scene.initCircles(state, style, Two);
scene.initCirclesPaths(state, Two);
scene.calcCirclesPaths(state, style);

scene.updateInitCond(state, style);

function update()
{
    state._t += screen.timeDelta/1000;
    const jmp = state.phase_arr.length/(state.end_t);

    // wait for the play button to be pressed
    if (state.isShouldStartAnim) { state.isShouldStartAnim = false; state.isShouldPlayAnim = true; scene.clearAnim(state); };
    if (state.isShouldPlayAnim) { scene.play_animation( state, style, jmp ); }
}
screen.bind('update', update);