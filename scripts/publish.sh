#!/bin/bash

cp README.md README.md.backup
cp scripts/npm_README.md README.md
npm publish
mv README.md.backup README.md
