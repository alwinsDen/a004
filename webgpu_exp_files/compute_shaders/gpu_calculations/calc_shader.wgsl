@group(0) @binding(0) var<storage,read_write> data: array<f32>;

@compute @workgroup_size(1) fn compute_something(
    @builtin(global_invocation_id) id: vec3u //x,y,z
){
    let i=id.x;
    data[i]=data[i]*2.0;
}