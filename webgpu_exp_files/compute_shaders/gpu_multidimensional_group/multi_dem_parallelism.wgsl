@group(0) @binding(0) var<storage,read_write>workgroup_result:array<vec3u>;
@group(0) @binding(1) var<storage,read_write>local_result:array<vec3u>;
@group(0) @binding(2) var<storage,read_write>global_result:array<vec3u>;

//workgroup size array
@group(1) @binding(0) var<uniform>workgroup_size_ar: vec3<i32>;

@compute @workgroup_size(2,3,4) fn computeMultiDemParallel(
    @builtin(workgroup_id)workgroup_id: vec3<u32>,
    @builtin(local_invocation_id)local_invocation_id: vec3<u32>,
    @builtin(global_invocation_id)global_invocation_id: vec3<u32>,
    @builtin(local_invocation_index)local_invocation_index: u32,
    @builtin(num_workgroups)num_workgroups: vec3<u32>
){
    //calculate workgroup index
    let workgroup_index = workgroup_id.x + 
    workgroup_id.y * num_workgroups.x + 
    workgroup_id.z * num_workgroups.x * num_workgroups.y;

    //calculate global_invocation_index
    let global_invocation_index = workgroup_index * 24u + local_invocation_index;

    workgroup_result[global_invocation_index] = workgroup_id;
    local_result[global_invocation_index] = local_invocation_id;
    global_result[global_invocation_index] = global_invocation_id;
}