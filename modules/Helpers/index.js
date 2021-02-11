const fs = require('fs')
const path = require('path')

const describeArchive = (file) => {
  return new Promise((resolve, reject) => {
    const GLACIER_MAX_PARTS = 10000

    const archivePath = path.resolve(file.toString())
    const archiveSize = fs.statSync(archivePath).size

    let n = 20

    let archiveParts = 0
    let archivePartsSize = 1024 * 1024

    while (archiveSize / archivePartsSize > GLACIER_MAX_PARTS) {
      archivePartsSize = Math.pow(2, (n += 1))
    }

    archiveParts = Math.ceil(archiveSize / archivePartsSize)

    resolve({
      archivePath,
      archiveSize,

      archiveParts,
      archivePartsSize
    })
  })
}

const computeArchiveChecksum = (GLACIER, archiveChecksums) => {
  let prevLvlHashes = archiveChecksums

  while (prevLvlHashes.length > 1) {
    let len = Math.floor(prevLvlHashes.length / 2)

    if (prevLvlHashes.length % 2 !== 0) {
      len += 1
    }

    const currLvlHashes = new Array(len)
    let j = 0

    for (let i = 0; i < prevLvlHashes.length; i += 2, j += 1) {
      if (prevLvlHashes.length - i > 1) {
        const buf1 = Buffer.from(prevLvlHashes[i], 'hex')
        const buf2 = Buffer.from(prevLvlHashes[i + 1], 'hex')

        const { treeHash } = GLACIER.computeChecksums(
          Buffer.concat([buf1, buf2], buf1.length + buf2.length)
        )

        currLvlHashes[j] = treeHash
      } else {
        currLvlHashes[j] = prevLvlHashes[i]
      }
    }

    prevLvlHashes = currLvlHashes
  }

  return prevLvlHashes[0]
}

const log = (msg) => {
  console.log('\x1b[36m%s\x1b[0m','[AWS GLACIER CLI]: ', msg)
}

module.exports = {
  describeArchive,
  computeArchiveChecksum,

  log
}

