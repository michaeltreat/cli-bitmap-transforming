'use strict'

const fs = require('fs')

const readBitmapFile = (filePath, cb) =>{

  fs.readFile(filePath, (err, data) => {
    if(err) return cb(err)
    return cb(null, data)
  })
}

module.exports.readBitmapFile = readBitmapFile