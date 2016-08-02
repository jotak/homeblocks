#!/bin/bash

cp package.json ../homeblocks_openshift/
rm ../homeblocks_openshift/public/*.css
rm ../homeblocks_openshift/public/*.html
rm -r ../homeblocks_openshift/public/inc
mkdir ../homeblocks_openshift/public/inc
rm -r ../homeblocks_openshift/public/partials
mkdir ../homeblocks_openshift/public/partials
rm -r ../homeblocks_openshift/public/css
mkdir ../homeblocks_openshift/public/css
rm -r ../homeblocks_openshift/public/fonts
mkdir ../homeblocks_openshift/public/fonts
cp public/*.css ../homeblocks_openshift/public
cp public/*.html ../homeblocks_openshift/public
cp public/inc/* ../homeblocks_openshift/public/inc
cp public/partials/* ../homeblocks_openshift/public/partials
cp public/css/* ../homeblocks_openshift/public/css
cp public/fonts/* ../homeblocks_openshift/public/fonts
cp public/favicon.ico ../homeblocks_openshift/public
