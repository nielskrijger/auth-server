FROM ubuntu:14.04
MAINTAINER Niels Krijger <niels@kryger.nl>

# Install Node.js
RUN apt-get update && apt-get install -y --force-yes curl
RUN apt-get install -y nodejs npm build-essential nodejs-legacy

# Bundle Node.js app source
ADD /src /app
WORKDIR /app

# Install app dependencies
RUN npm install && npm cache clear
RUN npm install -g forever

EXPOSE  3000

CMD forever -f app.js

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
