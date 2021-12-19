# Stage 1 - the build process
FROM node:9.8.0 as build-deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

# Stage 2 - the production environment
FROM zalari/nginx-html5
COPY --from=build-deps /usr/src/app/dist/cms-new /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
