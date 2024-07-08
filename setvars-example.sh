#!/bin/bash

PROFILE="default"

# change to your username
STAGE="[username]"

sst secret set --stage $STAGE AppKey ""
sst secret set --stage $STAGE DatabaseDSN ""
sst secret set --stage $STAGE AwsSecretAccessKey ""
sst secret set --stage $STAGE AwsKeyId ""
sst secret set --stage $STAGE AwsRegion ""
sst secret set --stage $STAGE ResendApiKey ""
sst secret set --stage $STAGE GithubClientId ""
sst secret set --stage $STAGE GithubClientSecret ""
