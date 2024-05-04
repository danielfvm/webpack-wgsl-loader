import {basename} from "path";
import {readFile} from "fs/promises";
import {LoaderContext} from "webpack";
import {Program, Source, createSourceMapTree, programToShader} from "./sourcemap";

interface LoaderOptions {}

async function parse(
  loader: LoaderContext<LoaderOptions>,
  sourceCode: string,
  sourceName: string,
  context: string,
  importList: string[],
): Promise<Source> {

  const source = new Source(basename(sourceName), []);
  const importPattern = /\@import "([.\/\w_-]+)"/gi;
  const lines = sourceCode.split("\n");

  for (const line of lines) {
    let match = importPattern.exec(line);
    if (match != null) {
      const resolvedPath = await loader.getResolve()(context, match[1]);
      loader.addDependency(resolvedPath);

      // prevent double circular imports and importing same file multiple times
      if (importList.includes(resolvedPath)) {
        source.lines.push("\n"); // Insert empty line to preserve line number order
      } else {
        importList.push(resolvedPath);
        source.lines.push(await parse(
          loader,
          await readFile(resolvedPath, "utf-8"),
          basename(resolvedPath),
          context,
          importList,
        ));
      }
    } else {
      source.lines.push(line);
    }
  }

  return source;
}

export default function (this: LoaderContext<LoaderOptions>, source: string) {
  this.cacheable();
  const callback = this.async();
  const prog: Program = {
    sourceMap: {
      version: 3,
      mappings: [],
      sources: [],
      file: basename(this.resourcePath),
    },
    code: "",
  };

  parse(this, source, this.resourcePath, this.context, [ this.resourcePath ]).then(source => {
    createSourceMapTree(source, prog);
    callback(null, `export default ${JSON.stringify(programToShader(prog))}`);
  }).catch((err) => callback(err));

  return undefined;
}
