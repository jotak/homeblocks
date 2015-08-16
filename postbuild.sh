#!/bin/bash

cp package.json generated_js/
rm -rf generated_js/public
cp -rf public generated_js/
