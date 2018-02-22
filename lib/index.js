'use strict'

const readCLI = require('./cli-interpreter').readCLI
const readBitmapFile = require('./read-bitmap-file').readBitmapFile
const bitmapParser = require('./bitmap-parser').bmParser

// Calls readCLI, which takes a callback and passes either an error message or an array of cli args into the callback. 
// The callback then either throws the error, or returns the results. If it returns the array of results, it is  destructured into input, output, and transform using the spread operator.

let [input, output, transform] = [...readCLI( (err, results)=>{
  if(err) throw Error(err)
  return results
})]

new Promise( (resolve, reject) => {
  readBitmapFile(input, (err, data) => (err) ? reject(err) : resolve(data))
})
  .then(bufferData => bitmapParser(bufferData, (err, bitmapObject) => (err) ? reject(err) : resolve(bitmapObject)))
  .then(bitmap => console.log( bitmap))
  .catch(err => console.log('There was an error: ', err))



// let results = await readBitmap()
// console.log(results)


