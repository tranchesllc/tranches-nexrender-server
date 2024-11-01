<img src="./docs/images/Logo.svg" alt="alt text" width="100%"/>

# Tranches nexrender server

-   [Tranches backend](https://github.com/tranchesllc/tranches-backend)
-   [Tranches frontend](https://github.com/tranchesllc/tranches-frontend)

## Setup Guide

### Make sure you have node 20 installed

-   [Install here](https://nodejs.org/en/download/package-manager)
-   run `node --version` to check if installed
-   it should show `v20....`

### You should have adobe after effects installed

-   only available on mac/windows
-   [Install here](https://www.adobe.com/ph_en/products/aftereffects/free-trial-download.html)
-   If windows, make sure to install it in the same disk as the windows operating system (else it won't work)

### Install dependecies

-   `npm install`

### Setup env variables

-   ask sheldon for env variables

### Setup AWS

Windows

-   your AWS credentials file (%USERPROFILE%\.aws\credentials)
-   ask sheldon for the credentials

### Install docker (optional)

-   https://www.docker.com/products/docker-desktop/

## Running the servers

-   if on windows. make sure to run everything as administrator (open cmd as an administrator, navigate to project directory, then run the commands bellow)
-   run nexrender server `node nexrender/server.js`
-   run api `node api.js`
-   run nexrender worker `node nexrender/worker.js`

### sample request post body for rendering a video

```
{
    "template_uri": "https://tranches.s3.amazonaws.com/templates/LI-coldOutreach+5.aep",
    "composition_name": "render",
    "fonts_url": ["https://tranches.s3.amazonaws.com/fonts/Manrope-Regular.ttf"],
    "assets": [
        {
            "type": "data",
            "layerName": "replace_Company_Name",
            "property": "Source Text",
            "value": "Wrytopia",
            "composition": "text variables"
        },
        {
            "type": "data",
            "layerName": "replace_Client_Last_Name",
            "property": "Source Text",
            "value": "Sagrado",
            "composition": "text variables"
        },
        {
            "type": "data",
            "layerName": "replace_Client_First_Name",
            "property": "Source Text",
            "value": "Sheldon",
            "composition": "text variables"
        },
        {
            "type": "image",
            "layerName": "replace_Video_Intro",
            "src": "https://tranches.s3.amazonaws.com/assets/sample-vid.mp4"
        },
        {
            "type": "image",
            "layerName": "replace_Video_Main",
            "src": "https://tranches.s3.amazonaws.com/assets/sample-vid.mp4"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Samples",
            "src": "https://tranches.s3.amazonaws.com/assets/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Intro",
            "src": "https://tranches.s3.amazonaws.com/assets/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Outro",
            "src": "https://tranches.s3.amazonaws.com/assets/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Sample_1",
            "src": "https://tranches.s3.amazonaws.com/assets/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_1",
            "src": "https://tranches.s3.amazonaws.com/assets/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_2",
            "src": "https://tranches.s3.amazonaws.com/assets/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_3",
            "src": "https://tranches.s3.amazonaws.com/assets/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "jamie dimon.jpg",
            "src": "https://tranches.s3.amazonaws.com/assets/jamie+dimon.jpg"
        },
        {
            "type": "image",
            "layerName": "warren buffett.jpg",
            "src": "https://tranches.s3.amazonaws.com/assets/warren+buffett.jpg"
        },
        {
            "type": "image",
            "layerName": "ray dalio.jpg",
            "src": "https://tranches.s3.amazonaws.com/assets/ray+dalio.jpg"
        }
    ]
}
```
