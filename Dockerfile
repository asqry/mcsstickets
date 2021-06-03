FROM node:latest

# Create the directory
RUN mkdir -p /usr/src/mcsstickets
WORKDIR /usr/src/mcsstickets

# Copy and Install
COPY package.json /usr/src/mcsstickets
RUN npm install
COPY . /usr/src/mcsstickets

# Start
CMD ["node", "index.js"]