# Step 1: Build the React app using Node
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve the build using Nginx
FROM nginx:alpine

# Clean existing default Nginx HTML files
RUN rm -rf /usr/share/nginx/html/*

# Copy the React build output to the Nginx root directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
