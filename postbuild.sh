#!/bin/bash

cp package.json ../homeblocks_js/
rm ../homeblocks_js/public/*.css
rm ../homeblocks_js/public/*.html
rm -r ../homeblocks_js/public/inc
mkdir ../homeblocks_js/public/inc
rm -r ../homeblocks_js/public/partials
mkdir ../homeblocks_js/public/partials
rm -r ../homeblocks_js/public/css
mkdir ../homeblocks_js/public/css
rm -r ../homeblocks_js/public/fonts
mkdir ../homeblocks_js/public/fonts
cp public/*.css ../homeblocks_js/public
cp public/*.html ../homeblocks_js/public
cp public/inc/* ../homeblocks_js/public/inc
cp public/partials/* ../homeblocks_js/public/partials
cp public/css/* ../homeblocks_js/public/css
cp public/fonts/* ../homeblocks_js/public/fonts
cp public/favicon.ico ../homeblocks_js/public
