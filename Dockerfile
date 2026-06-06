FROM maven:3.8.6-openjdk-8-slim AS backend-builder
WORKDIR /backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

FROM node:18-alpine AS frontend-builder
WORKDIR /frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=frontend-builder /frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /app
COPY --from=backend-builder /backend/target/site-env-1.0.0.jar app.jar

EXPOSE 80 8080
