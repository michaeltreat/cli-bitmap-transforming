'use strict'

const fs = require('fs')
const cliArgs = require('./cli-interpreter').readCLI()
const readBitmapFile = require('./read-bitmap-file').readBitmapFile

// If cliArgs is not an array, then it's an error. 
if(typeof(cliArgs) === 'string') throw Error(cliArgs)

let [input, output, transform] = [...cliArgs]
  
console.log(input, output, transform)