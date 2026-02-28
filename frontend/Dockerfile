# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Ensure all files have correct casing
RUN ls -R  # Optional: debug to check folder structure inside Docker

# Build the React app
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy the build output from previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose default nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]