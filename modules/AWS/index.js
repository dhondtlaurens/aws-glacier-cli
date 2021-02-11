const fs = require('fs')
const HelpersModule = require('../Helpers')

const listJobs = (GLACIER, accountId, vaultName) => {
  return new Promise((resolve, reject) => {
    GLACIER.listJobs({
      accountId: accountId,
      vaultName: vaultName
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const deleteArchive = (GLACIER, accountId, vaultName, archiveId) => {
  return new Promise((resolve, reject) => {
    GLACIER.deleteArchive({
      accountId: accountId,
      vaultName: vaultName,

      archiveId: archiveId
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const listVaults = (GLACIER, accountId) => {
  return new Promise((resolve, reject) => {
    GLACIER.listVaults({
      accountId: accountId,
      limit: '9999'
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const describeVault = (GLACIER, accountId, vaultName) => {
  return new Promise((resolve, reject) => {
    GLACIER.describeVault({
      accountId: accountId,
      vaultName: vaultName
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const listMultipartUploads = (GLACIER, accountId, vaultName) => {
  return new Promise((resolve, reject) => {
    GLACIER.listMultipartUploads({
      accountId: accountId,
      vaultName: vaultName
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const initiateMultipartUpload = (GLACIER, accountId, vaultName, archiveDescription, archivePartsSize) => {
  return new Promise((resolve, reject) => {
    GLACIER.initiateMultipartUpload({
      accountId: accountId,
      vaultName: vaultName,

      archiveDescription: archiveDescription,
      partSize: archivePartsSize.toString()
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

const abortMultipartUpload = (GLACIER, accountId, vaultName, uploadId) => {
  return new Promise((resolve, reject) => {
    GLACIER.abortMultipartUpload({
      accountId: accountId,
      vaultName: vaultName,

      uploadId: uploadId
    }, (err, data) => {
      if (!err) {
        resolve()
      } else {
        reject(err)
      }
    })
  })
}

const uploadMultipartParts = (GLACIER, accountId, vaultName, uploadId, archiveSize, archivePath, archiveParts, archivePartsSize) => {
  return new Promise((resolve, reject) => {
    const checksums = []
    const archiveStream = fs.createReadStream(archivePath, { highWaterMark: archivePartsSize })

    let index = 0

    archiveStream.on('data', (body) => {
      archiveStream.pause()
      uploadMultipartPart(body)
    })

    function uploadMultipartPart (body) {
      const checksum = GLACIER.computeChecksums(body).treeHash
      checksums.push(checksum)

      const rangeStart = index * archivePartsSize
      const rangeEnd = rangeStart + (body.length - 1)

      GLACIER.uploadMultipartPart({
        accountId: accountId,
        vaultName: vaultName,

        body: body,
        checksum: checksum,
        range: `bytes ${rangeStart}-${rangeEnd}/*`,

        uploadId: uploadId
      }, (err, data) => {
        if (!err) {
          index ++
          HelpersModule.log(`👉 Upload (${index}/${archiveParts})`)

          if ((rangeEnd + 1) < archiveSize) {
            archiveStream.resume()
          } else {
            resolve(checksums)
          }
        } else {
          reject(err)
        }
      })
    }
  })
}

const completeMultipartUpload = (GLACIER, accountId, vaultName, uploadId, archiveSize, archiveChecksums) => {
  return new Promise((resolve, reject) => {
    GLACIER.completeMultipartUpload({
      accountId: accountId,
      vaultName: vaultName,

      archiveSize: archiveSize.toString(),
      checksum: HelpersModule.computeArchiveChecksum(GLACIER, archiveChecksums),

      uploadId: uploadId
    }, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

module.exports = {
  listJobs,

  deleteArchive,

  listVaults,
  describeVault,

  listMultipartUploads,
  initiateMultipartUpload,
  abortMultipartUpload,
  uploadMultipartParts,
  completeMultipartUpload
}