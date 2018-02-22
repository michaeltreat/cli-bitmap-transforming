'use strict';

let bmParser = (bufferData, cb) =>{  

  if( !(bufferData instanceof Buffer)) return cb('A buffer was not passed in')

  let bitmap = {
    originalBuffer: bufferData,
    header: {
      type: null,
      size: null,
      reservedOne: null,
      reservedTwo: null,
      pixelArrOffset: null,
    },
    dibHeader: {
      dibSize: null,
      width: null,
      height: null,
      bpp: null,
      compression: null,
    },
    pixelArray: {
      rawData: [],
      parsedData: [],
      indexedData: []
    },
    colorTable: [],
  }

  // Header Properties
  bitmap.header.type = bufferData.toString('utf-8', 0,2)
  bitmap.header.size = bufferData.readUInt32LE(2)
  bitmap.reservedOne = bufferData.readUInt16LE(6)
  bitmap.reservedTwo = bufferData.readUInt16LE(8)
  bitmap.header.pixelArrOffset = bufferData.readUInt32LE(10)

  // DIB Header Properties
  bitmap.dibHeader.dibSize = bufferData.readUInt32LE(14)
  bitmap.dibHeader.width = bufferData.readInt32LE(18)
  bitmap.dibHeader.height = bufferData.readInt32LE(22)
  bitmap.dibHeader.bpp = bufferData.readUInt32LE(28)

  bitmap.dibHeader.compression = bufferData.readUInt32LE(30)
  bitmap.dibHeader.imgSize = Math.floor( (bitmap.dibHeader.bpp * bitmap.dibHeader.width + 31) / 32) * 4 * Math.abs(bitmap.dibHeader.height)
  bitmap.dibHeader.colorPallete = bufferData.readUInt32LE(46)

  // Pixel Array
  bitmap.pixelArray.rawData = bufferData.slice(bitmap.header.pixelArrOffset, bitmap.header.pixelArrOffset + bitmap.dibHeader.imgSize)
  

  // Edge cases
  if(bitmap.dibHeader.bpp <= 8){
    bitmap = buildIndexedPixelArray(bitmap)
    bitmap = buildColorTable(bitmap)
    return bitmap
  }

  if(bitmap.dibHeader.bpp === 24){
    bitmap = build24PixelArray(bitmap)
  }
  
  return bitmap
}

function buildIndexedPixelArray(bm) {
  for(let i = 0; i < bm.pixelArray.rawData.length; i++ ){
    bm.pixelArray.indexedData.push(bm.pixelArray.rawData.readUInt8(i))
  }
  return bm
}

function buildColorTable(bm){
  let raw = bm.originalBuffer.slice(bm.dibHeader.dibSize + 14, bm.header.pixelArrOffset)
  for(let i = 0; i < raw.length; i++){
     
    bm.colorTable.push(new Pixel( (i / 4), {
      green: raw.readUInt8(i++),
      blue: raw.readUInt8(i++),
      red: raw.readUInt8(i++),
      alpha: raw.readUInt8(i)
    }))

  }
  return bm
}

function build24PixelArray(bm){
  let raw = bm.pixelArray.rawData
  for(let i = 0; i < raw.length; i++){

    let pixel = new Pixel( (i / 3 ), {
      blue: raw.readUInt8(i++),
      green: raw.readUInt8(i++),
      red: raw.readUInt8(i)
    })
    bm.pixelArray.parsedData.push(pixel)
    
  }
  return bm

}


function Pixel(id , data){
  this.id = id
  this.red = data['red']
  this.green = data['green']
  this.blue = data['blue']
  this.alpha = data['alpha']
  return this
}

module.exports.bmParser = bmParser  