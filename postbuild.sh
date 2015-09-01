#!/bin/bash

cp package.json generated_js/
rm generated_js/public/*.css
rm generated_js/public/*.html
cp public/*.css generated_js/public
cp public/*.html generated_js/public
