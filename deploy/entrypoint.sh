#!/bin/bash

# Start Next.js application
npm run start &

# Start Nginx
nginx -g "daemon off;"