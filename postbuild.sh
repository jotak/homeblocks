#!/bin/bash

cp package.json ../linkage_js/
rm ../linkage_js/public/*.css
rm ../linkage_js/public/*.html
rm -r ../linkage_js/public/inc
mkdir ../linkage_js/public/inc
rm -r ../linkage_js/public/partials
mkdir ../linkage_js/public/partials
rm -r ../linkage_js/public/css
mkdir ../linkage_js/public/css
rm -r ../linkage_js/public/fonts
mkdir ../linkage_js/public/fonts
cp public/*.css ../linkage_js/public
cp public/*.html ../linkage_js/public
cp public/inc/* ../linkage_js/public/inc
cp public/partials/* ../linkage_js/public/partials
cp public/css/* ../linkage_js/public/css
cp public/fonts/* ../linkage_js/public/fonts
cp public/favicon.ico ../linkage_js/public
