#!/bin/bash

# Start Next.js application
npm run start -- --experimental-https --https-cert=/etc/nginx/ssl/nginx.crt --https-key=/etc/nginx/ssl/nginx.key &

# Start Nginx
nginx -g "daemon off;"