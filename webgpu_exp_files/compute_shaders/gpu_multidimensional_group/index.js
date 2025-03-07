import { fetch_shader } from '../utils.js';

async function main() {
    const dispatch_cnt = [4, 3, 2];
    const work_group_size = [2, 3, 4];

    //adapter setup
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        throw new Error('Unable to request WebGPU device');
    }

    const array_prod = arr => arr.reduce((a, b) => a * b);
    //threads/grp
    const num_threads_per_worker = array_prod(work_group_size);
    const multidem_wgsl = await fetch_shader('multi_dem_parallelism.wgsl');
    const numWorkGroups = array_prod(dispatch_cnt);
    const numResults = numWorkGroups * num_threads_per_worker;
    const size = numResults * 4 * 4;

    let usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC;
    const workgroupBuffer = device.createBuffer({ size, usage });
    const localBuffer = device.createBuffer({ size, usage });
    const globalBuffer = device.createBuffer({ size, usage });

    usage = GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST;
    const workgroupReadBuffer = device.createBuffer({ size, usage });
    const localReadBuffer = device.createBuffer({ size, usage });
    const globalReadBuffer = device.createBuffer({ size, usage });

    let shader_module = device.createShaderModule({
        code: multidem_wgsl,
    });

    const pipeline = device.createComputePipeline({
        label: 'compute pipeline',
        layout: 'auto',
        compute: {
            module: shader_module,
        },
    });

    //create bind group
    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: workgroupBuffer,
                },
            },
            {
                binding: 1,
                resource: {
                    buffer: localBuffer,
                },
            },
            {
                binding: 2,
                resource: {
                    buffer: globalBuffer,
                },
            },
        ],
    });

    const encoder = device.createCommandEncoder({
        label: 'compute builtin encoder',
    });
    const pass = encoder.beginComputePass({
        label: 'compute builtin pass',
    });

    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.dispatchWorkgroups(...dispatch_cnt);
    pass.end();

    encoder.copyBufferToBuffer(
        workgroupBuffer,
        0,
        workgroupReadBuffer,
        0,
        size
    );
    encoder.copyBufferToBuffer(localBuffer, 0, localReadBuffer, 0, size);
    encoder.copyBufferToBuffer(globalBuffer, 0, globalReadBuffer, 0, size);

    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    await Promise.all([
        workgroupReadBuffer.mapAsync(GPUMapMode.READ),
        localReadBuffer.mapAsync(GPUMapMode.READ),
        globalReadBuffer.mapAsync(GPUMapMode.READ),
    ]);

    const workgroup = new Uint32Array(workgroupReadBuffer.getMappedRange());
    const local = new Uint32Array(localReadBuffer.getMappedRange());
    const global = new Uint32Array(globalReadBuffer.getMappedRange());

    const get3 = (arr, i) => {
        const off = i * 4;
        return `${arr[off]}, ${arr[off + 1]}, ${arr[off + 2]}`;
    };

    for (let i = 0; i < numResults; ++i) {
        if (i % num_threads_per_worker === 0) {
            log(`\
     ---------------------------------------
     global                 local     global   dispatch: ${
         i / num_threads_per_worker
     }
     invoc.    workgroup    invoc.    invoc.
     index     id           id        id
     ---------------------------------------`);
        }
        log(
            ` ${i.toString().padStart(3)}:      ${get3(
                workgroup,
                i
            )}      ${get3(local, i)}   ${get3(global, i)}`
        );
    }
}

function log(...args) {
    const elem = document.createElement('pre');
    elem.textContent = args.join(' ');
    document.body.appendChild(elem);
}

main();
