# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:alpine as build-stage

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package*.json /app/
RUN npm install

# Copy all and generate schema 
COPY ./ /app/
RUN npm run graphql:gen_from_file

# Build frontend
RUN npm run build:prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf 