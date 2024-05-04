import { testCompiler } from "../test/compiler";
import * as fs from "fs";
import * as path from "path";

const shader = (filename: string) =>
  path.resolve(__dirname, `../test/${filename}`);
const shaderContents = (filename: string) =>
  JSON.stringify(fs.readFileSync(shader(filename)).toString());

test("extension", async () => {
  const { stats } = await testCompiler(shader("exampleShader.wgsl"));
  const data = stats.toJson({ source: true });

  expect(data.errors).toEqual([]);
  expect(data.modules).toBeDefined();

  // Just to satisfy typescript.
  if (data.modules === undefined) return;

  expect(data.modules[0].source).toBe(
    "export default {\"code\":" + shaderContents("exampleShader.wgsl") + "}"
  );
});

test("include", async () => {
  const { stats } = await testCompiler(shader("includer.wgsl"));
  const data = stats.toJson({ source: true });

  expect(data.errors).toEqual([]);
  expect(data.modules).toBeDefined();

  if (data.modules === undefined) return;
  expect(data.modules[0].source).toBe(
    "export default {\"code\":\"// included\\n\\n// nested included\\n\"}"
  );
});
