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
    colors: []
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
  bitmap.pixelArray.rawData = bufferData.slice(bitmap.header.pixelArrOffset, bitmap.header.pixelArrOffset + bitmap.dibHeader.imgSize)

  if(bitmap.dibHeader.compression === 3){
    bitmap.dibHeader.redMask === bufferData.readUInt32LE(54)
    bitmap.dibHeader.greenMask === bufferData.readUInt32LE(58)
    bitmap.dibHeader.blueMask === bufferData.readUInt32LE(62)
    bitmap.dibHeader.alphaMask === bufferData.readUInt32LE(66)
  }
    
  if(bitmap.dibHeader.bpp <= 8){
    bitmap = buildIndexedPixelArray(bitmap)
    bitmap = buildColorTable(bitmap)
    let first = bitmap.pixelArray.indexedData[1]
    console.log(bitmap.colorTable[first])
  }
  
  return bitmap = buildPixelArray(bitmap)
}


function buildPixelArray(bm){
  let raw = bm.pixelArray.rawData
  for(let i = 0; i < raw.length; i++){
     
    let pixel = new Pixel( (i / 4), {
      green: raw[i++],
      blue: raw[i++],
      red: raw[i++],
      alpha: raw[i]
    })
    bm.pixelArray.parsedData.push(pixel)
    bm.colors.push(pixel)
  }
  return bm

}

function buildIndexedPixelArray(bm) {
  for(let i = 0; i < bm.pixelArray.rawData.length; i++ ){
    bm.pixelArray.indexedData.push(bm.pixelArray.rawData.readUInt8(i))
  }
  return bm
}
function buildColorTable(bm){
  let bitmaskOffset = 0
  if(bm.dibHeader.compression === 3) bitmaskOffset = 16

  let raw = bm.originalBuffer.slice(bm.dibHeader.dibSize + bitmaskOffset + 14, bm.header.pixelArrOffset)
  for(let i = 0; i < raw.length; i++){
     
    bm.colorTable.push(new Pixel( (i / 4), {
      green: raw[i++],
      blue: raw[i++],
      red: raw[i++],
      alpha: raw[i]
    }))

  }
  return bm
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