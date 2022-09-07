import Two from "https://cdn.skypack.dev/two.js@latest";

// init Two js
let two = new Two({
    type: Two.Types.svg,
    fullscreen: true,
    autostart: true
  });

let window = new Two({
    type: Two.Types.svg,
    fullscreen: false,
    width: two.width/3,
    height: two.height/4,
    autostart: true
});

window.appendTo(document.body);
two.appendTo(document.body);

export default
{
    // create js object for scene objects references
    style: {
        win: {
            _ref: window,
            id:"graph_window",
            bg: "rgb(255, 255, 255)",
            pos: "fixed",
            zIndex: "1",
            x_axis : null,
            y_axis_offset : 0,
            y_axis : null
        },
        screen: {
            _ref: two,
            bg: "rgb(0, 0, 0)",
            x_axis: null,
            y_axis: null,
            txt_x_axis: null,
            txt_y_axis: null
        },
        _document_ref: document
    },
    // set initial state and use the object for current state
    state: {
        _x : 2,
        _x_d : 1,
        _t_start : 0,
        _t : 0,
        end_t : 35,
        dt : 0.01,
        pnt_g_ref : null,
        pnt_ref : null,
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
        line_g_ref : null,
        line_g_a: [],
        isShouldStartAnim: false,
        isShouldPlayAnim: false,
    }
}