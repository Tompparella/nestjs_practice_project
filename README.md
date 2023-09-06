<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Name](https://github.com/Tompparella/nestjs_practice_project) NestJs project

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

1. Prepare your server:

Make sure your server is up-to-date by running:

sudo apt update
sudo apt upgrade

2. Install Docker:

curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

3. Install Docker Compose:

sudo apt install docker-compose

4. Move docker-compose file to a location which contains both the vue- and nestjs projects. Also load docker environment files with 'docker config'

4. Build your Docker image:

Copy code
docker build -t nestjs-app .

5. Create Nginx Configuration Files:

Create an nginx.conf file and an nginx-site.conf file in the same directory as your NestJS project with your Nginx configuration. Customize these files as needed for your specific application.

6. Start application:

Run the following command to start your NestJS application and Nginx reverse proxy:

docker-compose up -d

7. Access application:
- You can now access the application through your server's IP address or hostname on port 80 (the default HTTP port). For example, if your server's IP address is 192.168.1.100, you can access your application by opening a web browser and navigating to http://192.168.1.100.

## Credits

- Author - [Tommi Kunnari](https://tompparella.github.io/my-portfolio/)
- LinkedIn - [@tommikunnari](https://www.linkedin.com/in/tommi-kristian-kunnari-992101183/)

## License

### Environment file
DB_NAME=<Build environment>
COOKIE_KEY=<Secret cookie key>
CLIENT_URL=<Client server url>