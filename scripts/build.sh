#! /bin/bash

PGB_APP_ID="1625732"
HOCKEY_APP_ID="e097d06d69104d3b866fe5cef3887a7a"

# Tell phonegap build to pull code and rebuild
curl -X PUT -d 'data={"pull":"true"}' https://build.phonegap.com/api/v1/apps/$PGB_APP_ID?auth_token=$ACCESS_TOKEN

function status() {
  local ios=$(curl https://build.phonegap.com/api/v1/apps/$PGB_APP_ID?auth_token=$ACCESS_TOKEN | jq .status.ios)
  if [ "$ios" == '"complete"' ]
  then
    return 0
  else
    return 1
  fi
}

function download() {
  local dest="$PGB_APP_ID.ipa"
  local link=$(curl https://build.phonegap.com/api/v1/apps/$PGB_APP_ID/ios?auth_token=$ACCESS_TOKEN | jq .location | sed s/\"//g)
  echo "Downloading from $link to $dest"

  curl -o $dest $link
}

function upload() {
  local src="$PGB_APP_ID.ipa"

  curl https://rink.hockeyapp.net/api/2/apps/$HOCKEY_APP_ID/app_versions \
    -F status="2" \
    -F notify="1" \
    -F notes="$RELEASE_NOTES" \
    -F commit_sha="$TRAVIS_COMMIT" \
    -F build_server_url="https://travis-ci.org/$TRAVIS_REPO_SLUG/builds/$TRAVIS_BUILD_ID" \
    -F notes_type="0" \
    -F ipa="@$src" \
    -H "X-HockeyAppToken: $HOCKEY_APP_TOKEN"
}

for (( ; ; ))
do
  status
  if [ $? == 0 ]
  then
    echo "Build is ready"
    echo $(download)
    echo $(upload)
    break
  else
    echo "Not ready yet..."
  fi

  sleep 10
done
