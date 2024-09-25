# Webpack loader for WGSL shaders
![Repository size](https://img.shields.io/github/repo-size/danielfvm/webpack-wgsl-loader?color=39d45f) 
[![GitHub last commit](https://img.shields.io/github/last-commit/danielfvm/webpack-wgsl-loader?color=39d45f)](https://github.com/danielfvm/webpack-wgsl-loader/commits/master) 
![License](https://img.shields.io/badge/license-MIT-39d45f) 
[![Stargazers](https://img.shields.io/github/stars/danielfvm/webpack-wgsl-loader?color=39d45f&logo=github)](https://github.com/danielfvm/webpack-wgsl-loader/stargazers)

[![NPM](https://nodei.co/npm/webpack-wgsl-loader.png)](https://npmjs.org/package/webpack-wgsl-loader)

A WGSL shader loader for webpack. 
Supports nested imports, allowing for smart code reuse among more complex shader implementations. 

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
                test: /\.wgsl/,
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
  const value: GPUShaderModuleDescriptor;
  export default value;
}
```

#### 4. Import shaders

Shaders are imported as `GPUShaderModuleDescriptor`.
```javascript
import myShader from './myShader.wgsl';

const shaderModule = device.createShaderModule(myShader);
```
> **Note:** Currently only the `code` field is set by the loader, `sourceMap` field might be supported in the future.


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
---- ---- shader.wgsl
```

If we `import` `shader.wgsl` shader inside `main.ts`:

```javascript
import shader from '../shaders/fragment.wgsl';
```

We can have that shader include other `.wgsl` files inline, like so:

```sass
@import "./includes/perlin-noise.glsl"
```

> **N.B.** all includes within `.wgsl` are relative to the file doing the importing.

Imported files are parsed for `@import` statements as well, so you can nest
imports as deep as you'd like.

Imported files are inserted directly into the source file in place of the
`@import` statement and no special handling or error checking is provided. So,
if you get syntax errors, please first check that shader works as one 
contiguous file before raising an issue.

Files are only imported once, so if you have the same import in multiple
files, it will only be included once, preventing duplicate code and circular imports.


## Fork

This project is a fork of [ts-shader-loader](https://github.com/mentos1386/ts-shader-loader) which is a webgl glsl shader loader.
If you need a glsl webpack loader you should look at that project instead.


## TODO

+ Add support for source maps
