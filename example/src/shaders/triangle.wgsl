@import "./constants.wgsl"

@vertex
fn vs_main(@builtin(vertex_index) id: u32) -> @builtin(position) vec4f {
  return vec4f(vertices[id], 0, 1);
}

@fragment
fn fs_main() -> @location(0) vec4f {
  return vec4f(1, 0, 0, 1);
}
