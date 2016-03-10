#! /bin/bash

# Tell phonegap build to pull code and rebuild
curl -X PUT -d 'data={"pull":"true"}' https://build.phonegap.com/api/v1/apps/1625732?auth_token=$ACCESS_TOKEN
