'use strict';

let bmParser = (bufferData, cb) =>{  

  if( !(bufferData instanceof Buffer)) return cb('A buffer was not passed in')

  let bitMap = {
    header: {},
    dibHeader: {},
    pixelArray: {},
  }
  return bitMap
  
}

module.exports.bmParser = bmParser