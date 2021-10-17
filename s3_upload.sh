#!/bin/sh -
API_ENDPOINT=`cat .api_endpoint`
WEBSITE_BUCKET=`cat .website_bucket`
sed -i.bck "s!__API_ENDPOINT_MARKER__!$API_ENDPOINT!g" src/App.js && \
npm run build && \
mv src/App.js.bck src/App.js && \
aws s3 cp --recursive build s3://$WEBSITE_BUCKET/
