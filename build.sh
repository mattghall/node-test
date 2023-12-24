#!/bin/bash

# Define variables
IMAGE_NAME="node-test"
AWS_ACCOUNT_ID="062946332322"
AWS_REGION="us-west-2"
ECR_REPOSITORY_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME"
IMAGE_TAG="latest"

# Function to handle errors
error_exit()
{
    echo "Error: $1" 1>&2
    read -n 1 -s -r -p "Press any key to exit"
    exit 1
}

# Authenticate Docker with your ECR registry
echo "Authenticating with AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI || error_exit "Failed to authenticate with AWS ECR."

# Build the Docker image
echo "Building Docker image ($IMAGE_NAME)..."
docker build -t $IMAGE_NAME . || error_exit "Failed to build Docker image."

# Tag the Docker image for ECR
echo "Tagging the image for ECR..."
docker tag $IMAGE_NAME:latest $ECR_REPOSITORY_URI:$IMAGE_TAG || error_exit "Failed to tag Docker image."

# Push the image to ECR
echo "Pushing the image to ECR..."
docker push $ECR_REPOSITORY_URI:$IMAGE_TAG || error_exit "Failed to push image to ECR."

echo "Image successfully pushed to ECR."

# Wait for any key to be pressed before exiting
read -n 1 -s -r -p "Press any key to continue"
