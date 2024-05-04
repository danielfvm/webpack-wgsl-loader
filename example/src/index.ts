import triangleShader from "./shaders/triangle.wgsl";

window.addEventListener("DOMContentLoaded", async () => {
  if (!navigator.gpu) {
    throw new Error("WebGPU not supported on this browser.");
  }

  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error("No appropriate GPUAdapter found.");
  }

  const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu");

  if (!context) {
    throw new Error("Failed to create WebGPU context.");
  }

  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device: device,
    format: canvasFormat,
  });

  console.log(triangleShader);

  // Load shader and create pipeline
  const shaderModule = device.createShaderModule(triangleShader);
  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({bindGroupLayouts: []}),
    vertex: {
      module: shaderModule,
      entryPoint: "vs_main",
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fs_main",
      targets: [
        {
          format: canvasFormat,
        },
      ],
    },
  });


  // Create pass and draw it
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      loadOp: "clear",
      storeOp: "store",
    }]
  });

  pass.setPipeline(pipeline);
  pass.draw(3, 1);
  pass.end();

  device.queue.submit([encoder.finish()]);
});
