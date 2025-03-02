import { fetch_shader } from './utils.js'; //always add .js to imports

async function main() {
    const adapter = await navigator.gpu?.requestAdapter();
    const device = await adapter?.requestDevice();
    if (!device) {
        throw new Error('Unable to request WebGPU device');
    }

    //shader module
    const calc_shader = await fetch_shader('calc_shader.wgsl');
    const module = device.createShaderModule({
        label: 'doubling compute module',
        code: calc_shader,
    });

    const pipeline = device.createComputePipeline({
        label: 'doubling compute pipeline',
        layout: 'auto',
        compute: {
            module,
        },
    });

    //test module
    const input = new Float32Array([1, 3, 5]);
    //for GPU calcs need to create a buffer
    const work_buffer = device.createBuffer({
        label: 'work buffer',
        size: input.byteLength,
        usage:
            GPUBufferUsage.STORAGE |
            GPUBufferUsage.COPY_SRC |
            GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(work_buffer, 0, input);

    //read the result that has been output
    const result_buffer = device.createBuffer({
        label: 'result buffer',
        size: input.byteLength,
        usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    });

    //bindgroup to bind the buffer
    const bind_group = device.createBindGroup({
        label: 'bindgroup for work buffer',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: work_buffer,
                },
            },
        ],
    });

    //encodings
    const encoder = device.createCommandEncoder({
        label: 'doubling encoder',
    });
    const pass = encoder.beginComputePass({
        label: 'doubling compute pass',
    });
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, bind_group);
    pass.dispatchWorkgroups(input.length);
    pass.end();

    encoder.copyBufferToBuffer(
        work_buffer,
        0,
        result_buffer,
        0,
        result_buffer.size
    );

    //finsih encoding and submit the commands
    const commandBuffer = encoder.finish();
    device.queue.submit([commandBuffer]);

    //read results
    await result_buffer.mapAsync(GPUMapMode.READ);
    const result = new Float32Array(result_buffer.getMappedRange());
    console.log('Input', input);
    console.log('result', result);
    result_buffer.unmap();
}

main();
