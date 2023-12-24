#!/bin/bash

# Path to your AWS credentials on your host machine
# Replace this with the actual path
HOST_AWS_CREDENTIALS_PATH=C:\Users\MattG\.aws


# Starting the Docker container
echo "Starting the Docker container..."

docker run -v /c/Users/MattG/.aws:/root/.aws -p 3000:3000 -d node-test

echo "Container started."
