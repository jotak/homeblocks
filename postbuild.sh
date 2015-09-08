#!/bin/bash

cp package.json ../linkage_js/
rm ../linkage_js/public/*.css
rm ../linkage_js/public/*.html
cp public/*.css ../linkage_js/public
cp public/*.html ../linkage_js/public
cp public/favicon.ico ../linkage_js/public
