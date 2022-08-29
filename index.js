import Two from 'https://cdn.skypack.dev/two.js@latest';

// init Two js
var two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  });

var window = new Two({
    type: Two.Types.svg,
    fullscreen: false,
    width: two.width/3,
    height: two.height/4,
    autostart: true
});

const state = {
    _x : 2,
    _x_d : 1,
    eval_x_dd: function eval_x_dd(x, x_d)
    {
        return (-x*0.1-x_d*0.1-Math.sin(x));
    },
    _v_field_config:
    {
        size : 20,
        step : 0.5,
        scale : 100
    },
    v_field_arr: [],
    v_field_arr_top: [],
    phase_arr: [],
    line_g_a: [],
}

window.appendTo(document.body);
two.appendTo(document.body);

window.renderer.domElement.id = "test_id";
window.renderer.domElement.style.background = 'rgb(255, 255, 255)';
window.renderer.domElement.style.position = "fixed";
window.renderer.domElement.style.zIndex = "1";

two.renderer.domElement.style.background = 'rgb(0, 0, 0)';

// configure UI elements
const butt_play = document.getElementById("button_play");
butt_play.addEventListener("click", function (){ isShouldStartAnim = true; }, false );
let isShouldStartAnim = false;
let isShouldPlayAnim = false;

document.getElementById("text_input").value =  "(-x*0.1)-(x_d*0.1)-(Math.sin(x))";
const butt_set = document.getElementById("button_set");
butt_set.addEventListener("click", function (){
    state.eval_x_dd = function(x,x_d) { return eval( document.getElementById("text_input").value ); }
    isShouldPlayAnim = false;
    clearAnim();
    updateState();
}, false );

// render horizontal and vertical axes
const x_axis = two.makeLine(0, two.height/2, two.width, two.height/2);
const y_axis = two.makeLine(two.width/2, 0, two.width/2, two.height);
const x_axis_wind =window.makeLine(0, window.height/2, window.width, window.height/2);
const y_axis_wind = window.makeLine(window.width/2, 0, window.width/2, window.height);
const txt_x_axis = two.makeText("x(t)", 9*two.width/10, 50+(two.height/2));
const txt_y_axis = two.makeText("x'(t)", -50+two.width/2, (two.height/10));
x_axis.stroke = "white";
y_axis.stroke = "white";

const w_c = two.width/2;
const h_c = two.height/2;

function updateState()
{
    updateInitCond();
    drawVectorField();
    calcCirclePath();
}

// init v_field
function initVectorField()
{
    const size = state._v_field_config.size;
    const step = state._v_field_config.step;
    const scale = state._v_field_config.scale;
    
    const row_size = size/step;
    const column_size = row_size;

    let indx = 0;

    const v_field_arr_temp = new Array( row_size * column_size );
    const v_field_arr_top_temp = new Array( row_size * column_size );

    // draw the vector field
    for (let x = -size/2; x < size/2; x += step)
    {
    // just helpers to make the code more readable
    for (let x_d = -size/2; x_d < size/2; x_d+= step)
    {
        // const indx = row_size*(x_d+size/2) + (x+size/2);
        let vec = two.makePath(0,0,0,0);
        vec.stroke = "#22FD9D";

        v_field_arr_temp[indx] = vec;
        
        let vec_top = two.makePolygon(0, 0, 3, 3);
        // vec_top.rotation = Math.asin(-y_d_norm/mag);
        vec_top.stroke = null;
        vec_top.fill = "#22FD9D";
        v_field_arr_top_temp[indx] = vec_top;
        indx++;
    }
    }
    state.v_field_arr = v_field_arr_temp;
    state.v_field_arr_top = v_field_arr_top_temp;
}

function drawVectorField()
{
    const size = state._v_field_config.size;
    const step = state._v_field_config.step;
    const scale = state._v_field_config.scale;

    const row_size = size/step;
    const column_size = row_size;
    const v_field_arr_temp = new Array( row_size * column_size );
    const v_field_arr_top_temp = new Array( row_size * column_size );

    let indx = 0;

    // draw the vector field
    for (let x = -size/2; x < size/2; x += step)
    {
    // just helpers to make the code more readable
    for (let x_d = -size/2; x_d < size/2; x_d+= step)
    {
        // x = x, y = x_d (state vector)
        // x =  x_d, y = x_dd (derivative of state vector)
        // const indx = row_size*(x_d+size/2) + (x+size/2);
        const x_dd = state.eval_x_dd(x,x_d);

        // normalize vectors
        const mag = Math.sqrt(Math.pow(x_d,2)+Math.pow(x_dd,2));

        let x_d_norm = x_d;
        let y_d_norm = x_dd;

        // scale
        // 100 pixels = 1 unit of x and y
        const extend = 10;

        const vec = state.v_field_arr[indx];
        //let vec = two.makePath(scale*x+w_c, scale*-x_d+h_c, scale*x+w_c+x_d_norm*10,  scale*-x_d+h_c-y_d_norm*10);
        vec.vertices[0].x = scale*x+w_c;
        vec.vertices[0].y =scale*-x_d+h_c;
        vec.vertices[1].x =scale*x+w_c+x_d_norm*extend;
        vec.vertices[1].y = scale*-x_d+h_c-y_d_norm*extend;
        vec.stroke = "#22FD9D";
        v_field_arr_temp[indx] = vec;

        // let vec_top = two.makePolygon(scale*x+w_c+x_d_norm*10,  scale*-x_d+h_c-y_d_norm*10, 3, 3);
        const vec_top = state.v_field_arr_top[indx];
        vec_top.position.x = scale*x+w_c+x_d_norm*extend;
        vec_top.position.y = scale*-x_d+h_c-y_d_norm*extend;
        vec_top.rotation = Math.asin(-y_d_norm/mag);
        vec_top.stroke = null;
        vec_top.fill = "#22FD9D";

        v_field_arr_top_temp[indx] = vec_top;
        indx++;
    }
    }

    state.v_field_arr = v_field_arr_temp;
    state.v_field_arr_top = v_field_arr_top_temp;
}

// draw Vector Field
initVectorField();
drawVectorField();

// init circle shape
let pnt = new Two.Circle(two.width/2,two.height/2, 5);
pnt.fill = "#2491ff";
pnt.stroke = null;
two.add(pnt);

// init circle shape for graph
let pnt_g = new Two.Circle(two.width/2,two.height/2, 5);
pnt_g.fill = "#2491ff";
pnt_g.stroke = null;
window.add(pnt_g);

let line_g_a = []; 
let line_g = new Two.Path(line_g_a, false);
line_g.fill = "none";
window.add(line_g);

// phase plane arr
const phase_arr = [];

const end_t = 35;
const dt = 0.01;

function initCirclePath()
{
    let indx = 0;
    const phase_arr_temp = new Array(end_t/dt);
    const line_g_a_temp = new Array(end_t/dt);

    for (let t = 0; t < end_t; t += dt)
    {

    const phase_a = new Two.Anchor( 0, 0,
                                    0, 0,
                                    0, 0);
    phase_arr_temp[indx] = phase_a;

    // graph of t versus x
    const x_a = new Two.Anchor( 0, 0,
                            0, 0,
                            0, 0);

    line_g_a_temp[indx] = (x_a);
    indx++;
    }
    state.phase_arr = phase_arr_temp;
    state.line_g_a = line_g_a_temp;
}

function updateInitCond()
{
    state._x = parseInt(document.getElementById("x_0_input").value);
    state._x_d = parseInt(document.getElementById("x_d_0_input").value);
    pnt.position.x = w_c+state._x*100;
    pnt.position.y = h_c+(-1)*state._x_d*100;
}

function calcCirclePath()
{
    let x =  state._x;
    let x_d = state._x_d;
    let x_dd = state.eval_x_dd(x,x_d);

    let indx = 0;
    // move circle around the vector field
    for (let t = 0; t < end_t; t += dt)
    {
    // const phase_arr_temp = new Array(end_t/dt);
    console.log("x(" + t + ")" + " =" + " " + x);
    // starting point x(0)= 3, x'(0) = 5
    x += x_d * dt;
    x_d += x_dd * dt;
    x_dd = state.eval_x_dd(x,x_d);

    // graph pnt
    let t_s = t*20;
    let x_s = window.height/2+x*20;

    // create array for phase plane
    let x_p_s =w_c+x*100;
    let y_p_s =h_c+(-1)*x_d*100;

    const phase_a = state.phase_arr[indx];

    phase_a.x = x_p_s;
    phase_a.y = y_p_s;
    state.phase_arr[indx] = phase_a;

    // const phase_a = new Two.Anchor( x_p_s, y_p_s,
                                    // x_p_s, y_p_s,
                                    // x_p_s, y_p_s);

    // graph of t versus x
    const x_a = state.line_g_a[indx];
    x_a.x = t_s;
    x_a.y = x_s;
    state.line_g_a[indx] = x_a;

    // const x_a = new Two.Anchor( t_s, x_s,
                            // t_s, x_s,
                            // t_s, x_s);

    indx++;
    }
}

initCirclePath();
calcCirclePath();

console.log(state.phase_arr);

let _t = 0
let _t_start = 0;
// jump

two.bind('update', update);

function update()
{
    _t += two.timeDelta/1000;
    const jmp = state.phase_arr.length/(end_t);

    // wait for the play button to be pressed until playing anim
    if (isShouldStartAnim) { isShouldStartAnim = false; isShouldPlayAnim = true; clearAnim(); };
    if (isShouldPlayAnim) { play_animation( jmp ); }
        
    // console.log("x(" + time_elapsed + ")" + " =" + " " + x);

    
}

function clearAnim()
{
    _t_start = _t;
    if (line_g.vertices.length > 0 ) line_g.vertices = [];
}

function play_animation( jmp )
{
    let t = _t - _t_start;
    const indx = Math.floor(jmp*t);
    if (state.phase_arr.length <= indx) { isShouldPlayAnim = false; return; }

    pnt.position.x = state.phase_arr[indx].x;
    pnt.position.y = state.phase_arr[indx].y;

    // graph line and point
    pnt_g.position.x = state.line_g_a[indx].x;
    pnt_g.position.y = state.line_g_a[indx].y;
    line_g.vertices.push(state.line_g_a[indx]);
}