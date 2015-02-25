# auth-server

## Example

Run the following query:

    curl -X POST -H "Content-Type:application/x-www-form-urlencoded" -H "Authorization: Basic dGVzdDpzZWNyZXQ=" -d "grant_type=password&username=johndoe&password=A3ddj3w" localhost:3000/oauth/token

## Dockerfile

If you're not using docker-compose you can build and tag a new image like this:

    $ sudo docker build -t <your username>/auth-server .

Run the container in interactive mode:

    $ sudo docker run -p 3000:3000 <your username>/auth-server

Run the container in detached mode:

    $ sudo docker run -d -p 3000:3000 <your username>/auth-server

Now go to `http://localhost:3000` in your browser and you should see result!

## Tests

When contributing, please add tests! API tests using [supertest](https://github.com/visionmedia/supertest) are preferred.

## Directory structure

The project is organized as follows:

    /src - All files in here are copied to the Docker container.
    /src/api - Contains request handlers excluding those in  the `node-oauth2-server` library.
    /src/boot - Contains scripts run each time when starting the server.
    /src/config - Contains configuration files. You can overwrite most configuration variables with environment variables.
    /src/lib - Contains singletons and generic functions.
    /src/locales - Contains language files.
    /src/models - Contains `mongoose` models.
    /src/test - Contains API test files.
    /src/test/* - Mimics the directory structure of files being tested.
    /deploy - Contains files related to deployment and building the docker image.
