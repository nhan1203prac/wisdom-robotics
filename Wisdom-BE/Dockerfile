FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/wisdom_intro-0.0.1-SNAPSHOT.war app.war

EXPOSE 8080

ENTRYPOINT ["java","-jar","app.war"]