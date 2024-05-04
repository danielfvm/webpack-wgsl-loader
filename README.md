# Webpack loader for WGSL shaders
[![NPM](https://nodei.co/npm/ts-shader-loader.png)](https://npmjs.org/package/ts-shader-loader)

A WGSL shader loader for webpack, includes support for nested imports, 
allowing for smart code reuse among more complex shader implementations. 
The shader is returned as a string. This project is a fork from the glsl 
shader loader [ts-shader-loader](https://github.com/mentos1386/ts-shader-loader).


## Quick Guide

#### 1. Install
```shell
npm install --save-dev webpack-wgsl-loader
```

#### 2. Add to webpack configuration

```javascript
{
    module: {
        rules: [
            {
                test: /\.(wgsl)$/,
                loader: 'webpack-wgsl-loader'
            }
        ]
    }
}
```
#### 3. Declare shared files as modules

Create a `wgsl.d.ts` file in your project and add the following in to it:

```ts
declare module "*.wgsl" {
  const value: string;
  export default value;
}
```

#### 4. Import shaders

```javascript
import myShader from './myShader.wgsl';

console.log(myShader);
```


## Importing

This loader supports `@import "path/to/shader.wgsl"` syntax, which you can
use inside your shaders.


### Example

Example project structure:
```
src/
---- ts/
---- ---- main.ts
---- shaders/
---- ---- includes/
---- ---- ---- perlin-noise.wgsl
---- ---- fragment.wgsl
```

If we `import` `fragment.wgsl` shader inside `main.ts`:

```javascript
import shader from '../shaders/fragment.wgsl';
```

We can have that shader include other `.wgsl` files inline, like so:

```sass
@import "./includes/perlin-noise.glsl";
```

> **N.B.** all includes within `.wgsl` are relative to the file doing the importing.

Imported files are parsed for `@import` statements as well, so you can nest
imports as deep as you'd like.

Imported files are inserted directly into the source file in place of the
`@import` statement and no special handling or error checking is provided. So,
if you get syntax errors, please first check that shader works as one 
contiguous file before raising an issue.

## TODO

+ Deduplicate imports, to prevent code clobbering and conflicts at runtime
