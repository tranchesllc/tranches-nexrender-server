## Setup
### Make sure you have node 20 installed
- [Install here](https://nodejs.org/en/download/package-manager)
- run `node --version` to check if installed
- it should show `v20....`

### You should have adobe after effects installed
- only available on mac/windows
- [Install here](https://www.adobe.com/ph_en/products/aftereffects/free-trial-download.html)
- If windows, make sure to install it in the same disk as the windows operating system (else it won't work)

### Install dependecies
- `npm install`
### Setup env variables
- ask sheldon for env variables

### Install docker (optional)
- https://www.docker.com/products/docker-desktop/

## Running the servers
- run nexrender server `node nexrender/server.js`
- run api `node api.js`
- run nexrender worker `node nexrender/worker.js` (Note on windows: if it's your first time running this, open cmd as an administrator then run the nexrender worker command)

## Lacking
- after effects installer
- aws s3