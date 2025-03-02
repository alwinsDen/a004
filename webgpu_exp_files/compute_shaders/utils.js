export async function fetch_shader(file_path) {
  let shader_txt = await fetch(file_path).then(resp => resp.text());
  return shader_txt;
}
