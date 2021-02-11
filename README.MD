# AWS-GLACIER-CLI
CLI Tool to interact with AWS Glacier.

## Setup
* install AWS CLI & Configure IAM User
* https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html

```
aws configure
```

* install dependencies

```
yarn install
```

## Usage
* Run the help command to see all commands

```
node index.js --help
```

### Commands

#### listJobs

```
node index.js listJobs -a 548523034351 -r eu-central-1 -v myvault
```

#### deleteArchive

```
node index.js deleteArchive -a 548523034351 -r eu-central-1 -v myvault -i m80PEXsvkc87PWcCBaZBMwe42wS0k7paJ7ZXb-vIYONETxOuMXabukS9Kge_F8QK4di5h13-8iKLAjO4lPCF7WmK39TQpLnykoOCjVKAKkvyyKQMgTNKfohUusBMOwh5MERwtNMCKA
```

#### listVaults

```
node index.js listVaults -a 548523034351 -r eu-central-1
```

#### describeVault

```
node index.js describeVault -a 548523034351 -r eu-central-1 -v myvault
```

#### initiateMultipartUpload

```
node index.js initiateMultipartUpload -a 548523034351 -r eu-central-1 -v myvault -d "My archive description" -f /archive.zip
```

#### listMultipartUploads

```
node index.js listMultipartUploads -a 548523034351 -r eu-central-1 -v myvault
```

#### abortMultipartUpload

```
node index.js abortMultipartUpload -a 548523034351 -r eu-central-1 -i kCPK7v4u9qwTwJSnZ55zBzdTGvuT3-l_Qr72IWATs-QBbkU_q-4WZRp7pfE2eDWFNF4sJf0fYR61zMOBWtav13kCJbP-
```

### Helpfull Flows

#### Inventory retrieval
* Initiate a new inventory retrieval job

```
aws glacier initiate-job --account-id 548523034351 --vault-name myvault --job-parameters '{"Type": "inventory-retrieval"}'
```

* Wait for the job to be completed, this can take a while

```
node index.js listJobs -a 548523034351 -r eu-central-1 -v myvault
```

* Get the output when it's completed

```
aws glacier get-job-output --account-id 548523034351 --vault-name myvault --job-id qr0HcseAmauH58PMFQZixLJdJCzEOuOzMaieJXiMRS3It75QNKZt-mWiA1_84yE2JZvax4JdeVPhs4mGIZDjBbkzPEit output.json
```
## Notes

### Inspiration
[https://github.com/josser/node-glacier-uploader]: https://github.com/josser/node-glacier-uploader

### Support the development of this project
[Buy me a coffee]: https://www.buymeacoffee.com/laurensdhondt
