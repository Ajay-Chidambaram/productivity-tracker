# Use the official lightweight Nginx image from Docker Hub
FROM nginx:alpine

# Copy all the application files to the Nginx public directory
# This includes index.html, index.tsx, App.tsx, etc.
COPY . /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# The main command to run when the container starts.
# 1. It creates an `env.js` file in the web root. This file creates the process.env object
#    in the browser, making the API_KEY (passed as an environment variable) available to the frontend code.
# 2. It then starts the Nginx server in the foreground.
#    The API_KEY is expected to be provided by docker-compose from a .env file.
CMD ["/bin/sh", "-c", "echo \"window.process = { env: { API_KEY: '${API_KEY}' } };\" > /usr/share/nginx/html/env.js && nginx -g 'daemon off;'"]
