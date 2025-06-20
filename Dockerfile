FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM maven:3.9.4-eclipse-temurin-17-alpine AS backend-build

WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:resolve

COPY src ./src
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app
COPY --from=backend-build /app/target/modern-product-search-1.0.0.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=render
ENV JAVA_OPTS="-Xmx512m -Xms256m"

CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar app.jar"]
