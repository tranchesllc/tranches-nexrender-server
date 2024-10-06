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

# Install project dependencies
RUN npm install

# Expose only the Node API port externally
EXPOSE 3000

# Start the Node API server and Nexrender server
CMD Start-Process powershell -ArgumentList "node api.js" ; \
    Start-Process powershell -ArgumentList "node nexrender/server.js" ; \
    Start-Process powershell -ArgumentList "Start-Process node -ArgumentList 'nexrender/worker.js' -Verb RunAs" -Wait
