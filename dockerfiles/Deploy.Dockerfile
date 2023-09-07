FROM node:18-alpine3.17

WORKDIR /backend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Creates the required folders for media
RUN bash -c 'mkdir -p ./content/{clip,image,institution,profile,tag}'

# Build for production
RUN npm run build:prod

# Expose the port your application runs on. Not needed when running composition and using network
# EXPOSE 3000

# Command to start your application
CMD [ "npm", "run", "start:prod" ]

