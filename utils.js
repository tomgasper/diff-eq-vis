export function addGraphInfo(graph, screen_size){
    const scale = screen_size.x/(graph.x_range*2);
    const y_axis_offset = 15;
    const x_axis_offset = 15;
    for (let i = -graph.x_range; i <= graph.x_range; i += graph.x_range/6){
                const x = ( i * scale );
                
                const txt_x_axis = two.makeText(i.toFixed(1), x+screen_size.x/2, y_axis_offset+screen_size.y/2);

                let y = i * scale;
                const txt_y_axis = two.makeText(i.toFixed(1), x_axis_offset+screen_size.x/2, -y+(screen_size.y/2));
    }
}