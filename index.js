const AWS = require('aws-sdk')

const AWSModule = require('./modules/AWS')
const HelpersModule = require('./modules/Helpers')

// ARGUMENTS

const accountId = {
  nargs: 1,
  type: 'string',
  alias: 'accountId',
  describe: 'AWS IAM Account Id',
  demandOption: "⚠️  Missing required argument -a, --accountId",
}

const region = {
  nargs: 1,
  type: 'string',
  alias: 'region',
  describe: 'AWS IAM Account Region',
  demandOption: "⚠️  Missing required argument -r, --region",
}

const vaultName = {
  nargs: 1,
  type: 'string',
  alias: 'vaultName',
  describe: 'AWS Glacier Vault Name',
  demandOption: "⚠️  Missing required argument -v, --vaultName",
}

const uploadId = {
  nargs: 1,
  type: 'string',
  alias: 'uploadId',
  describe: 'AWS Glacier Multiplart Upload Id',
  demandOption: "⚠️  Missing required argument -i, --uploadId",
}

const archiveDescription = {
  nargs: 1,
  type: 'string',
  alias: 'archiveDescription',
  describe: 'Archive description',
  demandOption: "⚠️  Missing required argument -d, --archiveDescription",
}

const archiveFile = {
  nargs: 1,
  type: 'file',
  alias: 'archiveFile',
  describe: 'Archive file',
  demandOption: "⚠️  Missing required argument -f, --archiveFile",
}

const archiveId = {
  nargs: 1,
  type: 'file',
  alias: 'archiveId',
  describe: 'Archive file',
  demandOption: "⚠️  Missing required argument -i, --archiveId",
}

// COMMAND: listJobs
const listJobs = {
  command: 'listJobs',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#listJobs-property',

  builder: (yargs) => yargs
    .option('a', accountId)
    .option('r', region)
    .option('v', vaultName),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.listJobs(GLACIER, argv.accountId, argv.vaultName)
      .then((data) => {
        if (data.JobList.length) {
          data.JobList.map((job, index) => {
            HelpersModule.log(`${job.Completed ? '✅' : '⏳'} ${job.Action} (${index + 1}/${data.JobList.length})`)
            HelpersModule.log(`👉 Job status code: ${job.StatusCode}`)
            HelpersModule.log(`👉 Job status message: ${job.StatusMessage}`)
            HelpersModule.log(`👉 Job Id: ${job.JobId}`)
          })
        } else {
          HelpersModule.log(`❌ No items in JobList`)
        }

        process.exit()
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: deleteArchive
const deleteArchive = {
  command: 'deleteArchive',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#deleteArchive-property',

  builder: (yargs) => yargs
    .option('a', accountId)
    .option('r', region)
    .option('v', vaultName)
    .option('i', archiveId),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.deleteArchive(GLACIER, argv.accountId, argv.vaultName, argv.archiveId)
      .then((data) => {
        HelpersModule.log(`✅ Archive delete`)

        process.exit()
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: listVaults
const listVaults = {
  command: 'listVaults',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#listVaults-property',

  builder: (yargs) => yargs
  .option('a', accountId)
  .option('r', region),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.listVaults(GLACIER, argv.accountId)
      .then((data) => {
        if (data.VaultList.length) {
          data.VaultList.map((vault, index) => {
            HelpersModule.log(`✅ ${vault.VaultName} (${index + 1}/${data.VaultList.length})`)
            HelpersModule.log(`👉 Vault archives: ${vault.NumberOfArchives}`)
            HelpersModule.log(`👉 Vault size: ${vault.SizeInBytes}`)
          })
        } else {
          HelpersModule.log(`❌ No items in VaultList`)
        }

        process.exit()
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: describeVault
const describeVault = {
  command: 'describeVault',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#describeVault-property',

  builder: (yargs) => yargs
    .option('a', accountId)
    .option('r', region)
    .option('v', vaultName),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.describeVault(GLACIER, argv.accountId, argv.vaultName)
      .then((data) => {
        HelpersModule.log(`✅ Vault init`)
        HelpersModule.log(`👉 Vault creation date: ${data.CreationDate}`)
        HelpersModule.log(`👉 Vault number of archives: ${data.NumberOfArchives}`)
        HelpersModule.log(`👉 Vault size in bytes: ${data.SizeInBytes}`)

        process.exit()
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: listMultipartUploads
const listMultipartUploads = {
  command: 'listMultipartUploads',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#listMultipartUploads-property',

  builder: (yargs) => yargs
    .option('a', accountId)
    .option('r', region)
    .option('v', vaultName),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.listMultipartUploads(GLACIER, argv.accountId, argv.vaultName)
      .then((data) => {
        if (data.UploadsList.length) {
          data.UploadsList.map((upload, index) => {
            HelpersModule.log(`✅ ${upload.ArchiveDescription} (${index + 1}/${data.UploadsList.length})`)
            HelpersModule.log(`👉 Upload part size: ${upload.PartSizeInBytes}`)
            HelpersModule.log(`👉 Upload id: ${upload.MultipartUploadId}`)
          })
        } else {
          HelpersModule.log(`❌ No items in UploadsList`)
        }

        process.exit()
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: abortMultipartUpload
const abortMultipartUpload = {
  command: 'abortMultipartUpload',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#abortMultipartUpload-property',

  builder: (yargs) => yargs
  .option('a', accountId)
  .option('r', region)
  .option('v', vaultName)
  .option('i', uploadId),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.abortMultipartUpload(GLACIER, argv.accountId, argv.vaultName, argv.uploadId)
      .then(() => {
        HelpersModule.log(`✅ Upload abort`)
        process.exit()
      })
      .catch((err) => {
        log(`❌ ${err}`)
        process.exit()
      })
  }
}

// COMMAND: initiateMultipartUpload
const initiateMultipartUpload = {
  command: 'initiateMultipartUpload',
  desc: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glacier.html#initiateMultipartUpload-property',

  builder: (yargs) => yargs
  .option('a', accountId)
  .option('r', region)
  .option('v', vaultName)
  .option('d', archiveDescription)
  .option('f', archiveFile),

  handler: (argv) => {
    const GLACIER = new AWS.Glacier({
      apiVersion: '2012-06-01',
      region: argv.region
    })

    HelpersModule.log(`✅ Glacier init`)

    AWSModule.describeVault(GLACIER, argv.accountId, argv.vaultName)
      .then((data) => {
        HelpersModule.log(`✅ Vault init`)
        HelpersModule.log(`👉 Vault creation date: ${data.CreationDate}`)
        HelpersModule.log(`👉 Vault number of archives: ${data.NumberOfArchives}`)
        HelpersModule.log(`👉 Vault size in bytes: ${data.SizeInBytes}`)

        HelpersModule.describeArchive(argv.archiveFile)
          .then((data) => {
            const archivePath = data.archivePath
            const archiveSize = data.archiveSize

            const archiveParts = data.archiveParts
            const archivePartsSize = data.archivePartsSize

            HelpersModule.log(`✅ Archive init`)
            HelpersModule.log(`👉 Archive size: ${archiveSize}`)
            HelpersModule.log(`👉 Archive parts: ${archiveParts}`)
            HelpersModule.log(`👉 Archive parts size: ${archivePartsSize}`)

            AWSModule.initiateMultipartUpload(GLACIER, argv.accountId, argv.vaultName, argv.archiveDescription, archivePartsSize)
              .then((data) => {
                const uploadId = data.uploadId
                HelpersModule.log(`✅ Upload init`)

                process.on('SIGINT', () => {
                  AWSModule.abortMultipartUpload(GLACIER, argv.accountId, argv.vaultName, uploadId)
                    .then(() => {
                      HelpersModule.log(`✅ Upload abort`)
                      process.exit()
                    })
                    .catch((err) => {
                      log(`❌ ${err}`)
                      process.exit()
                    })
                })

                AWSModule.uploadMultipartParts(GLACIER, argv.accountId, argv.vaultName, uploadId, archiveSize, archivePath, archiveParts, archivePartsSize)
                  .then((data) => {
                    const archiveChecksums = data

                    AWSModule.completeMultipartUpload(GLACIER, argv.accountId, argv.vaultName, uploadId, archiveSize, archiveChecksums)
                      .then((data) => {
                        HelpersModule.log(`✅ Upload complete`)
                        HelpersModule.log(`👉 Upload location: ${data.location}`)
                        HelpersModule.log(`👉 Upload checksum: ${data.checksum}`)
                        HelpersModule.log(`👉 Upload archiveId: ${data.archiveId}`)

                        process.exit()
                      })
                      .catch((err) => {
                        HelpersModule.log(`❌ ${err}`)
                        process.exit()
                      })
                  })
                  .catch((err) => {
                    HelpersModule.log(`❌ ${err}`)

                    AWSModule.abortMultipartUpload(GLACIER, argv.accountId, argv.vaultName, uploadId)
                    .then(() => {
                      HelpersModule.log(`✅ Upload abort`)
                      process.exit()
                    })
                    .catch((err) => {
                      log(`❌ ${err}`)
                      process.exit()
                    })
                  })
              })
              .catch((err) => {
                HelpersModule.log(`❌ ${err}`)
                process.exit()
              })
          })
          .catch((err) => {
            HelpersModule.log(`❌ ${err}`)
            process.exit()
          })
      })
      .catch((err) => {
        HelpersModule.log(`❌ ${err}`)
        process.exit()
      })
  }
}

require('yargs/yargs')(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')

  // JOBS

  .command(listJobs)
  .example('$0 listJobs -a 548523034351 -r eu-central-1 -v myvault')

  // ARCHIVE

  .command(deleteArchive)
  .example('$0 deleteArchive -a 548523034351 -r eu-central-1 -v myvault -i m80PEXsvkc87PWcCBaZBMwe42wS0k7paJ7ZXb-vIYONETxOuMXabukS9Kge_F8QK4di5h13-8iKLAjO4lPCF7WmK39TQpLnykoOCjVKAKkvyyKQMgTNKfohUusBMOwh5MERwtNMCKA')

  // VAULTS

  .command(listVaults)
  .example('$0 listVaults -a 548523034351 -r eu-central-1')

  .command(describeVault)
  .example('$0 describeVault -a 548523034351 -r eu-central-1 -v myvault')

  // UPLOAD

  .command(initiateMultipartUpload)
  .example('$0 initiateMultipartUpload -a 548523034351 -r eu-central-1 -v myvault -d "My archive description" -f /archive.zip')

  .command(listMultipartUploads)
  .example('$0 listMultipartUploads -a 548523034351 -r eu-central-1 -v myvault')

  .command(abortMultipartUpload)
  .example('$0 abortMultipartUpload -a 548523034351 -r eu-central-1 -i kCPK7v4u9qwTwJSnZ55zBzdTGvuT3-l_Qr72IWATs-QBbkU_q-4WZRp7pfE2eDWFNF4sJf0fYR61zMOBWtav13kCJbP-')

  .help('h')
  .alias('h', 'help')

  .epilogue('Buy me a coffee: https://www.buymeacoffee.com/laurensdhondt')
  .argv
