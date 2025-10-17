#!/bin/bash

echo "Starting YouTube Algorithm Analyzer..."
echo

echo "Installing server dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error installing server dependencies"
    exit 1
fi

echo "Installing client dependencies..."
cd client
npm install
if [ $? -ne 0 ]; then
    echo "Error installing client dependencies"
    exit 1
fi
cd ..

echo
echo "Starting the application..."
echo "Server will run on http://localhost:5000"
echo "Client will run on http://localhost:3000"
echo

npm run dev-all
