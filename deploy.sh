#!/bin/bash

git add .
git commit -m "Deploying to GCP"

docker build -t vagabond-331916 . --platform=linux/amd64
echo "Docker image built"

gcloud builds submit --tag gcr.io/vagabond-331916/vagabond_prod --project vagabond-331916 --timeout=3600
echo "Submitted build to GCP - Continue?"

gcloud app deploy --image-url=gcr.io/vagabond-331916/vagabond_prod:latest
echo "App deployed"

