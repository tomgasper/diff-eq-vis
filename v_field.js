
export default class V_Field {
    constructor(state_ref, screen_ref)
    {
        this.state = state_ref;
        this.screen = screen_ref;
    }

    initVectorField()
    {
    const size = this.state._v_field_config.size;
    const step = this.state._v_field_config.step;
    const scale = this.state._v_field_config.scale;
    
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
        let vec = this.screen.makePath(0,0,0,0);
        vec.stroke = "#22FD9D";

        v_field_arr_temp[indx] = vec;
        
        let vec_top = this.screen.makePolygon(0, 0, 3, 3);
        // vec_top.rotation = Math.asin(-y_d_norm/mag);
        vec_top.stroke = null;
        vec_top.fill = "#22FD9D";
        v_field_arr_top_temp[indx] = vec_top;
        indx++;
    }
    }
    this.state.v_field_arr = v_field_arr_temp;
    this.state.v_field_arr_top = v_field_arr_top_temp;
    }

    drawVectorField()
    {
    // width and height centre
    const w_c = this.screen.width/2;
    const h_c = this.screen.height/2;

    const size = this.state._v_field_config.size;
    const step = this.state._v_field_config.step;
    const scale = this.state._v_field_config.scale;

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
        for (let t = 0; t < this.state.end_t; t += this.state.dt)
        {
        // x = x, y = x_d (state vector)
        // x =  x_d, y = x_dd (derivative of state vector)
        // const indx = row_size*(x_d+size/2) + (x+size/2);
        const x_dd = this.state.eval_x_dd(x,x_d,t);

        // normalize vectors
        const mag = Math.sqrt(Math.pow(x_d,2)+Math.pow(x_dd,2));

        let x_d_norm = x_d;
        let y_d_norm = x_dd;

        // scale
        // 100 pixels = 1 unit of x and y
        const extend = 10;

        const vec = this.state.v_field_arr[indx];
        //let vec = two.makePath(scale*x+w_c, scale*-x_d+h_c, scale*x+w_c+x_d_norm*10,  scale*-x_d+h_c-y_d_norm*10);
        vec.vertices[0].x = scale*x+w_c;
        vec.vertices[0].y =scale*-x_d+h_c;
        vec.vertices[1].x =scale*x+w_c+x_d_norm*extend;
        vec.vertices[1].y = scale*-x_d+h_c-y_d_norm*extend;
        vec.stroke = "#22FD9D";
        v_field_arr_temp[indx] = vec;

        // let vec_top = two.makePolygon(scale*x+w_c+x_d_norm*10,  scale*-x_d+h_c-y_d_norm*10, 3, 3);
        const vec_top = this.state.v_field_arr_top[indx];
        vec_top.position.x = scale*x+w_c+x_d_norm*extend;
        vec_top.position.y = scale*-x_d+h_c-y_d_norm*extend;
        vec_top.rotation = Math.asin(-y_d_norm/mag);
        vec_top.stroke = null;
        vec_top.fill = "#22FD9D";

        v_field_arr_top_temp[indx] = vec_top;
        indx++;
        }
    }
    }

    this.state.v_field_arr = v_field_arr_temp;
    this.state.v_field_arr_top = v_field_arr_top_temp;
    }
}   
