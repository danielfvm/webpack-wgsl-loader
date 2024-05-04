import * as path from "path";
import { webpack, Stats } from "webpack";
import memoryfs from "memory-fs";

export const testCompiler = (
  fixture: string
): Promise<{ stats: Stats; bundleJs: string }> => {
  const compiler = webpack({
    mode: "development",
    context: __dirname,
    entry: fixture,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.(wgsl)$/,
          use: {
            loader: path.resolve(__dirname, "../lib/index.ts"),
          },
        },
      ],
    },
  });

  const fileSystem = new memoryfs();
  compiler.outputFileSystem = fileSystem as any;

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats === undefined) reject(err);
      else
        resolve({
          stats,
          bundleJs: fileSystem.readFileSync(
            path.resolve(__dirname, "bundle.js"),
            "utf-8"
          ),
        });
    });
  });
};
