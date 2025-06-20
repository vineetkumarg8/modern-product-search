FROM node:18-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM openjdk:17-jdk-slim AS backend-build

WORKDIR /app
COPY mvnw.cmd mvnw ./
COPY .mvn .mvn
COPY pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src ./src
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static
RUN ./mvnw clean package -DskipTests

FROM openjdk:17-jre-slim

WORKDIR /app
COPY --from=backend-build /app/target/modern-product-search-1.0.0.jar app.jar

EXPOSE 8080

ENV SPRING_PROFILES_ACTIVE=render
ENV JAVA_OPTS="-Xmx512m -Xms256m"

CMD ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$PORT -jar app.jar"]
