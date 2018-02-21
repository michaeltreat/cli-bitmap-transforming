'use strict'

const fs = require('fs')
const readCLI = require('./cli-interpreter').readCLI
const readBitmapFile = require('./read-bitmap-file').readBitmapFile

// Calls readCLI, which takes a callback and passes either an error message or an array of cli args into the callback. 
// The callback then either throws the error, or returns the results. If it returns the array of results, it is  destructured into input, output, and transform using the spread operator.

let [input, output, transform] = [...readCLI( (err, results)=>{
  if(err) throw Error(err)
  return results
})]


  
