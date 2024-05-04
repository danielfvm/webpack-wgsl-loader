/* 
 * Following functions were created using the help of:
 *   https://stackoverflow.com/questions/19330344/how-to-read-base64-vlq-code
 */

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function base64VLQtoNumbers(vlq: string): number[] {
  const data = vlq.split("").map(letter => BASE64_ALPHABET.indexOf(letter));
  const numbers: number[] = [];

  let continuation, sign = null;
  let num = 0;
  let bitIdx = 0;

  for (const bits of data) {
    if (sign == null) {
      sign = bits & 0x1;
      num |= ((bits >> 1) & 0b1111) << bitIdx;
      bitIdx += 4;
    } else {
      num |= (bits & 0b11111) << bitIdx;
      bitIdx += 5;
    }

    continuation = bits >> 5;
    if (continuation == 0) {
      numbers.push(num * (sign == 0 ? 1 : -1));
      num = 0;
      bitIdx = 0;
      sign = null;
    }
  }

  return numbers;
}


export function numbersToBase64VLQ(values: number[]): string {
  let data = "";

  for (let value of values) {

    // extract sign, only necessary in first step
    const sign = value < 0 ? 1 : 0;
    value = Math.abs(value);

    let num = value & 0b1111;
    let cont = (value >> 4) != 0 ? 1 : 0;
    let bits = (cont << 5) | (num << 1) | sign;

    data += BASE64_ALPHABET[bits];
    value >>= 4;

    while (value != 0) {
      num = value & 0b111111;
      cont = (value >> 5) != 0 ? 1 : 0;
      bits = (cont << 5) | num;

      data += BASE64_ALPHABET[bits];
      value >>= 5;
    }
  }

  return data;
}

type Line = string;
type SourceName = string;

export class Source {
  constructor(
    public name: SourceName,
    public lines: Array<Source | Line>
  ) {}
}

export interface Mapping {
  generatedColumn: number,
  originalSourceName: string,
  originalLine: number,
  originalColumn: number,
}

export interface SourceMap {
  version: number,
  mappings: Mapping[], // We only have per line maps -> join array with `;`
  sources: SourceName[],
  file: string,
}

export interface Program {
  sourceMap: SourceMap,
  code: string,
}

export function createSourceMapTree(source: Source, prog: Program) {

  // Source was already imported, therefore we can skip - Prevents dependency cycles and multiple imports
  if (prog.sourceMap.sources.includes(source.name))
    return;

  prog.sourceMap.sources.push(source.name);

  for (let lineNumber = 0; lineNumber < source.lines.length; lineNumber++) {
    const line = source.lines[lineNumber];

    if (line instanceof Source) {
      createSourceMapTree(line, prog);
    } else {
      prog.sourceMap.mappings.push({
        generatedColumn: prog.code.length,
        originalSourceName: source.name,
        originalLine: lineNumber + 1,
        originalColumn: 0
      });

      prog.code += line + '\n';
    }
  }

  // Remove trailing newline
  prog.code = prog.code.substring(0, prog.code.length - 1);
}

export function programToShader(prog: Program): GPUShaderModuleDescriptor {

  /*
  let prevMap = [0, 0, 0, 0];
  const mappings = prog.sourceMap.mappings.map(m => {
    const sourceIdx = prog.sourceMap.sources.indexOf(m.originalSourceName);
    const newMap = [
      m.generatedColumn - prevMap[0],
      sourceIdx - prevMap[1],
      m.originalLine - prevMap[2],
      m.originalColumn - prevMap[3]
    ];

    prevMap = [
      m.generatedColumn,
      sourceIdx,
      m.originalLine,
      m.originalColumn
    ];

    return numbersToBase64VLQ(newMap);
  });*/

  return {
    code: prog.code,

    // TODO: Figure out why sourceMap doesn't work.
    // Resources:
    //  https://web.dev/articles/source-maps
    //  https://developer.mozilla.org/en-US/docs/Web/API/GPUDevice/createShaderModule
    //  https://gpuweb.github.io/gpuweb/wgsl/#identifier-comparison
    //  https://sourcemaps.info/spec.html
    /*sourceMap: {
      version: prog.sourceMap.version,
      file: prog.sourceMap.file,
      sourceRoot: "",
      sources: prog.sourceMap.sources,
      sourcesContent: prog.sourceMap.sources.map(_ => null),
      names: [],
      mappings: mappings.join(";")+";",
    },*/
  };
}
