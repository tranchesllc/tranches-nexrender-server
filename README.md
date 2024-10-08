## Setup

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

### sample request post body

```
{
    "template_uri": "https://tranches.s3.amazonaws.com/LI-coldOutreach+5.aep",
    "composition_name": "render",
    "fonts_url": ["https://tranches.s3.amazonaws.com/Manrope-Regular.ttf"],
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
            "src": "https://tranches.s3.amazonaws.com/sample-vid.mp4"
        },
        {
            "type": "image",
            "layerName": "replace_Video_Main",
            "src": "https://tranches.s3.amazonaws.com/sample-vid.mp4"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Samples",
            "src": "https://tranches.s3.amazonaws.com/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Intro",
            "src": "https://tranches.s3.amazonaws.com/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Outro",
            "src": "https://tranches.s3.amazonaws.com/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Sample_1",
            "src": "https://tranches.s3.amazonaws.com/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Logo_Company_Sample_1",
            "src": "https://tranches.s3.amazonaws.com/logo-sample.png"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_1",
            "src": "https://tranches.s3.amazonaws.com/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_2",
            "src": "https://tranches.s3.amazonaws.com/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "replace_Image_Sample_3",
            "src": "https://tranches.s3.amazonaws.com/grass.jpeg"
        },
        {
            "type": "image",
            "layerName": "jamie dimon.jpg",
            "src": "https://tranches.s3.amazonaws.com/jamie+dimon.jpg"
        },
        {
            "type": "image",
            "layerName": "warren buffett.jpg",
            "src": "https://tranches.s3.amazonaws.com/warren+buffett.jpg"
        },
        {
            "type": "image",
            "layerName": "ray dalio.jpg",
            "src": "https://tranches.s3.amazonaws.com/ray+dalio.jpg"
        }
    ]
}
```
