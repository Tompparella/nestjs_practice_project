
FROM node:14

WORKDIR /backend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

RUN bash -c 'mkdir -p ./content/{clip,image,institution,profile,tag}'

# Build for production
RUN npm run build:prod

# Expose the port your application runs on
EXPOSE 3000

# Command to start your application
CMD [ "npm", "run", "start:prod" ]

# TODO: Under construction!!