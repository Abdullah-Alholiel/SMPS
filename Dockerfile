# Stage 1: Build the React application
FROM node:21.1.0 as build

WORKDIR /app

COPY package*.json ./
COPY src/ ./src/
COPY public/ ./public/
COPY /build/ ./build/   

RUN npm install
RUN npm run build

# Stage 2: Serve the React application from Nginx server
FROM nginx:stable-alpine

COPY --from=build /app/build /app/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
