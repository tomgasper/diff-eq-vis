// Init scene objects
export function initCircles(state, style, Two)
{
    const screen = style.screen._ref;
    const window = style.win._ref;

    // init circle shape
    let pnt = new Two.Circle(screen.width/2,screen.height/2, 5);
    pnt.fill = "#2491ff";
    pnt.stroke = null;
    state.pnt_ref = pnt;
    screen.add(state.pnt_ref);

    // init circle shape for graph
    let pnt_g = new Two.Circle(screen.width/2,screen.height/2, 5);
    pnt_g.fill = "#2491ff";
    pnt_g.stroke = null;
    state.pnt_g_ref =  pnt_g;
    window.add(state.pnt_g_ref);
}

export function initGraphLine(state, style, Two)
{
    const window = style.win._ref;
    
    let line_g = new Two.Path(state.line_g_a, false);
    line_g.fill = "none";
    line_g.stroke = "blue";
    // offset the whole to fit the y_axis start position
    line_g.position.x = style.win.y_axis_offset;
    state.line_g_ref = line_g;
    window.add(state.line_g_ref);
}

export function initCirclesPaths(state, Two)
    {
    let indx = 0;
    const phase_arr_temp = new Array(state.end_t/state.dt);
    const line_g_a_temp = new Array(state.end_t/state.dt);

    for (let t = 0; t < state.end_t; t += state.dt)
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

// Style and UI handlers
export function stylizeWindow(window, state, style)
{
    // set init values
    window.renderer.domElement.id = style.win.id;
    window.renderer.domElement.style.background = style.win.bg;
    window.renderer.domElement.style.position = style.win.pos;
    window.renderer.domElement.style.zIndex = style.win.zIndex;

    style.win.y_axis_offset = window.width/16;

    // for (let i = 0; i <= Math.floor(state.end_t); i += Math.floor(state.end_t/10))
    // {
    //     const txt = window.makeText(i, i*20+style.win.y_axis_offset, window.height/2+10);
    //     console.log(i);
    //     txt.stroke = "black";
    // }

    const t_txt = window.makeText("t", 95*window.width/100, 12*window.height/20);
    const xt_txt = window.makeText("x(t)", window.width/10, 1*window.height/10);

    // save ref for later use
    style.win.x_axis = window.makeLine(0, window.height/2, window.width, window.height/2);
    style.win.y_axis = window.makeLine(style.win.y_axis_offset, 0, style.win.y_axis_offset, window.height);
}

export function stylizeScreen(screen, style)
{
    // set init values
    screen.renderer.domElement.style.background = style.screen.bg;

    // save ref for later use

    // horizontal and vertical axes
    style.screen.x_axis = screen.makeLine(0, screen.height/2, screen.width, screen.height/2);
    style.screen.y_axis = screen.makeLine(screen.width/2, 0, screen.width/2, screen.height);
    style.screen.txt_x_axis = screen.makeText("x(t)", 98*screen.width/100, 20+(screen.height/2));
    style.screen.txt_y_axis = screen.makeText("x'(t)", -20+screen.width/2, (2*screen.height/100));

    style.screen.x_axis.stroke = "white";
    style.screen.y_axis.stroke = "white";

    style.screen.txt_x_axis.stroke = "white";
    style.screen.txt_y_axis.stroke = "white";
}

export function setUIelements(state, style, v_field)
{
    // attach event handlers to the buttons
    const butt_play = document.getElementById("button_play");
    const butt_set = document.getElementById("button_set");

    butt_play.addEventListener("click", function (){ butt_play_handler(state) }, false );
    butt_set.addEventListener("click", function () { butt_set_handler(state, style, v_field); }, false );

    // handlers descriptions
    function butt_set_handler(state, style, v_field)
    {
        state.eval_x_dd = function(x,x_d) { return eval( style._document_ref.getElementById("text_input").value ); }
        state.isShouldPlayAnim = false;
        clearAnim(state);
        updateState(state, style, v_field);
    }

    function butt_play_handler(state)
    {
        state.isShouldStartAnim = true;
    }

    // set input text to the value that initial eval_x_dd accepts
    // this is mostly to just instruct the user what's being calculated in the sample initial example
    document.getElementById("text_input").value =  "(-x*0.1)-(x_d*0.1)-(Math.sin(x))";
}

export function clearAnim(state)
{
    state._t_start = state._t;
    if (state.line_g_ref.vertices.length > 0 ) { state.line_g_ref.vertices = []; }
}

export function play_animation( state, style, jmp )
{
    let t = state._t - state._t_start;

    const indx = Math.floor(jmp*t);
    if (state.phase_arr.length <= indx) { state.isShouldPlayAnim = false; return; }

    updatePntsPosition(state,style ,indx);
}

// State and animation handlers
function updateState(state, style,v_field)
{
    updateInitCond(state, style);
    v_field.drawVectorField();
    calcCirclesPaths(state,style);
}

function updatePntsPosition(state,style, indx)
{
    // animate point on the screen
    state.pnt_ref.position.x = state.phase_arr[indx].x;
    state.pnt_ref.position.y = state.phase_arr[indx].y;

    // animate graph point, (with offset)
    state.pnt_g_ref.position.x = state.line_g_a[indx].x+style.win.y_axis_offset;
    state.pnt_g_ref.position.y = state.line_g_a[indx].y;
    
    state.line_g_ref.vertices.push(state.line_g_a[indx]);
}

export function updateInitCond(state, style)
{
    const document = style._document_ref;
    const screen = style.screen._ref;
    const window = style.win._ref;

    state._x = parseInt(document.getElementById("x_0_input").value);
    state._x_d = parseInt(document.getElementById("x_d_0_input").value);

    // reset phase point position
    state.pnt_ref.position.x = screen.width/2+state._x*100;
    state.pnt_ref.position.y = screen.height/2+(-1)*state._x_d*100;
    // reset graph point position
    state.pnt_g_ref.position.x = style.win.y_axis_offset;
    state.pnt_g_ref.position.y = window.height/2;
}

// Calculate the solution
export function calcCirclesPaths(state, style)
    {
    let x =  state._x;
    let x_d = state._x_d;
    let x_dd = state.eval_x_dd(x,x_d);

    let end_t = state.end_t;
    let dt = state.dt;

    const window = style.win._ref;
    const screen = style.screen._ref;

    let indx = 0;
    // move circle around the vector field
    for (let t = 0; t < end_t; t += dt)
    {
    
    console.log("x(" + t + ")" + " =" + " " + x);
    // starting point x(0)= 3, x'(0) = 5
    x += x_d * dt;
    x_d += x_dd * dt;
    x_dd = state.eval_x_dd(x,x_d);

    // graph pnt
    let t_s = t*20;
    let x_s = window.height/2+x*20;

    // create array for phase plane
    let x_p_s =screen.width/2+x*100;
    let y_p_s =screen.height/2+(-1)*x_d*100;

    const phase_a = state.phase_arr[indx];

    phase_a.x = x_p_s;
    phase_a.y = y_p_s;
    state.phase_arr[indx] = phase_a;

    // graph of t versus x
    const x_a = state.line_g_a[indx];
    x_a.x = t_s;
    x_a.y = x_s;
    state.line_g_a[indx] = x_a;

    indx++;
    }
}