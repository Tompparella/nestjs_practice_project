FROM debian:bookworm-slim
#-alpine:edge

WORKDIR /backend

# Alpine
#RUN apk add node --update --no-cache

# Debian
RUN apt update
RUN apt install nodejs npm libvips -y

# Copy package.json and package-lock.json to the container
COPY package*.json ./

#RUN apk add vips-dev fftw-dev build-base --update --no-cache \
#	--repository http://dl-3.alpinelinux.org/alpine/edge/community \
#       --repository http://dl-3.alpinelinux.org/alpine/edge/main

# Install application dependencies
RUN npm install -loglevel verbose --omit=dev --no-optional --ignore-script

# Install sharp. This can cause problems due to libvips on some images such as alpine
#RUN npm install --platform=linux --arch=armv6 --verbose sharp
#--build-from-source

# Copy the rest of your application code
COPY . .

# Creates the required folders for media
RUN bash -c 'mkdir -p ./content/{clip,image,institution,profile,tag}'

# Build for production
RUN npm run build:prod --verbose

# Expose the port your application runs on. Not needed when running composition and using network
# EXPOSE 3000

# Command to start your application
CMD [ "npm", "run", "start:prod" ]

