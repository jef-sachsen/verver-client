#!/bin/bash
docker run --rm -e CI=true -v "$PWD":/usr/src/app -w /usr/src/app node:9.3.0 /bin/bash -c "yarn install; yarn test"
