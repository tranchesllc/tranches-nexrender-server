# Use a Windows Server Core image as the base
FROM mcr.microsoft.com/windows/servercore:ltsc2022

# Set the environment variables for Node.js and Adobe After Effects
ENV NODE_VERSION=20
ENV AE_INSTALLER=installers/AfterEffects2024Installer.exe

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install Chocolatey to manage packages
RUN powershell -Command " \
    Set-ExecutionPolicy Bypass -Scope Process -Force; \
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12; \
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"

# Install Node.js using Chocolatey
RUN choco install nodejs --version=$NODE_VERSION -y

# Install Adobe After Effects
RUN Start-Process -FilePath .\${AE_INSTALLER} -ArgumentList '/S' -Wait

# Copy the rest of the project files to the container
COPY . .

# Copy the .env file for AWS credentials
COPY .env .env

# Install project dependencies
RUN npm install

# Set AWS environment variables from .env
RUN powershell -Command " \
    $env:AWS_ACCESS_KEY_ID=(Get-Content .env | Select-String 'AWS_ACCESS_KEY_ID' | ForEach-Object { $_ -replace 'AWS_ACCESS_KEY_ID=', '' }).Trim(); \
    $env:AWS_SECRET_ACCESS_KEY=(Get-Content .env | Select-String 'AWS_SECRET_ACCESS_KEY' | ForEach-Object { $_ -replace 'AWS_SECRET_ACCESS_KEY=', '' }).Trim();"

# Expose only the Node API port externally
EXPOSE 3000

# Start the Node API server and Nexrender server
CMD Start-Process powershell -ArgumentList "node api.js" ; \
    Start-Process powershell -ArgumentList "node nexrender/server.js" ; \
    Start-Process powershell -ArgumentList "Start-Process node -ArgumentList 'nexrender/worker.js' -Verb RunAs" -Wait
