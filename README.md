# cli-bitmap-transforming
This is a Bitmap Transformer that uses a CLI to transform a specifc bitmap file.  ( Not totally functional yet.)

An example would be transforming a colored bitmap into a greyscaled one.

The CLI currently takes these arguments:

1. The input file ` -i  <file  path>`.
2. The output file ` -o <output path>`.
3. The type of transform to be executed on the file `-t invert`.

## Overview

There are many different ways that bitmaps are made, and they also differ in how they store their data. There are 7+ accepted types of bitmaps, and each type can have many different ways of storing it's pixel data, and then each also has a different BPP ( bit's per pixel) which allows for basic to advanced colorings. 

### Current State

The next step would be to get one type with one BPP working, and break it into it's own module, then repeat with the rest. Once they are working ( or possibly along the way) I can refactor to condense these where needed, if needed.

Right now the program is able to read in an entire file, and break the bitmap data apart into an object, and it can handle a couple different types, with different ranges in BPP. 

We can manually change it's colors if we write it into the code, but currently there are no transform functions written, nor is the writeFile function written yet. 

Part of the issue is that depending on the BPP and size of the image, padding sometimes gets added to the end of each pixel row to bring the number of bits up to a multiple of 4 for memory optimization purposes. This padding is basically a bit of dummy data of 00 hex, but it needs to be maintained and kept in it's current position or the sequence gets thrown off. 

I was working on factoring that in when I had to put the project on hold as contracted projects took priority. The data is there, I just have to write the functions to alter each 'Pixel' and write the file to the output path. 



To see a sample of how this works:

1. Clone down this repo and move into it's top level.
2. Type `npm i` to install node dependencies.
3. Make a new output directory with `mkdir output`.
4. Type `node ./lib/index.js -i ./test/assets/blob.bmp -o ./output/ -t invert`.
  - `node ./lib/index.js` Tells node to run the index.js file.
  - `-i ./test/assets/blob.bmp` is a CLI argument that tells index.js which bitmap file you want to transform.
  - `-o ./output/ ` is another argument that says where to put the file when it's done.
  - `-t invert` is the type of transformation you want the program to run on your bitmap file.
  
  
Currently you will see your bitmap file logged to the terminal with all of it's data now readable and broken apart into meaningful sections.
