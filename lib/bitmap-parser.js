'use strict';

let bmParser = (bufferData, cb) =>{  

  if( !(bufferData instanceof Buffer)) return cb('A buffer was not passed in')

  let bitmap = {
    originalBuffer: bufferData,
    header: {},
    dibHeader: {},
    pixelArray: {},
    colorTable: {}
  }

  // Header Properties
  bitmap.header.type = bufferData.toString('utf-8', 0,2)
  bitmap.header.size = bufferData.readUInt32LE(2)
  bitmap.header.pixelArrOffset = bufferData.readUInt32LE(10)

  // DIB Header Properties
  bitmap.dibHeader.dibSize = bufferData.readUInt32LE(14)
  bitmap.dibHeader.width = bufferData.readUInt32LE(18)
  bitmap.dibHeader.height = bufferData.readUInt32LE(22)
  bitmap.dibHeader.bpp = bufferData.readUInt32LE(28)
  bitmap.dibHeader.imgSize = bufferData.readUInt32LE(34)
  bitmap.dibHeader.colorPallete = bufferData.readUInt32LE(46)

  // Pixel Array
  bitmap.pixelArray.raw = bufferData.slice(bitmap.header.pixelArrOffset, bitmap.dibHeader.imgSize)
  
  // Color table
  if(bitmap.dibHeader.colorPallete > 0){

    bitmap.colorTable.offset = bitmap.dibHeader.dibSize + 14
    bitmap.colorTable.end = bitmap.header.pixelArrOffset
    
    bitmap.colorTable.rawTable = bufferData.slice(bitmap.colorTable.offset, bitmap.colorTable.end)
    bitmap.colorTable.colors = []

    let raw =  bufferData.slice(bitmap.colorTable.offset, bitmap.colorTable.end)
    for(let i = 0; i < bitmap.colorTable.rawTable.length; i++){
     
      bitmap.colorTable.colors.push(new Pixel( (i / 4), {
        green: raw[i++],
        blue: raw[i++],
        red: raw[i++],
        alpha: raw[i]
      }))

    }
  }
  console.log(bitmap.colorTable.colors[28])
  return bitmap
  
}

function Pixel(id , data){
  this.id = id
  this.red = data['red']
  this.green = data['blue']
  this.blue = data['green']
  this.alpha = data['alpha']
  return this
}

module.exports.bmParser = bmParser  