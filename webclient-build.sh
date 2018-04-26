#!/bin/bash

if [[ "$1" != "" || "$PUSH_BUILD" != "" ]]; then
     if [[ "$1" != "" ]]; then
        PUSH_BUILD="$1"
     fi
fi
if [[ "$2" == "true" || $GIT_BRANCH == *"master"* ]]; then
    IS_STABLE="true"
fi
if [[ "$3" != "" || "$BUILD_NUMBER" != "" ]] ; then
     if [[ "$3" != "" ]]; then
        BUILD_NUMBER="$3"
     fi
else
    echo "a build number is required."
    exit 1
fi

docker login --username "$dockerUser" --password "$dockerPw"

versionFile=./src/version.js
packageVersion=$(awk '/version/{gsub(/("|",)/,"",$2);print $2};' $versionFile)

baseTag="leoek/swt-webclient"
newTag="$baseTag:$packageVersion.$BUILD_NUMBER"

echo "Building $newTag"
docker build -t "$newTag" .

# Check the current exit code
if [[ $? > 0 ]]; then
    exit 1
fi

if [[ PUSH_BUILD == "true" ]]; then
    echo "Pushing $newTag to registry"
    docker push "$newTag"
fi

echo "Pushing $baseTag:next to registry"
docker tag $newTag "$baseTag:next"
docker push "$baseTag:next"

#push as new stable if IS_STABLE is set.
if [[ $IS_STABLE == "true" ]]; then

  echo "Pushing $baseTag:$packageVersion to registry"
  docker tag $newTag "$baseTag:$packageVersion"
  docker push "$baseTag:$packageVersion"
  
  echo "Pushing $baseTag:stable to registry"
  docker tag $newTag "$baseTag:stable"
  docker push "$baseTag:stable"

fi

docker logout