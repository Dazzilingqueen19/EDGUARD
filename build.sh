#!/bin/bash

echo "Building frontendnew..."
cd frontendnew
npm install
npm run build
cd ..

echo "Building parent-web-app..."
cd parent-web-app
npm install
npm run build
cd ..

echo "All builds complete!"
