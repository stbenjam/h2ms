# Taken from https://spring.io/guides/gs/spring-boot-docker/
#FROM openjdk:8-jdk-alpine
FROM tomcat
#VOLUME /tmp
#ARG JAR_FILE
#ADD ${JAR_FILE} app.jar
#ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]


RUN apt-get update
RUN apt-get install -y openjdk-8-jdk maven
COPY . /app

#FIXME: this doesn't keep the downloaded dependency for some reason.
#RUN cd /app && mvn dependency:resolve

RUN cd /app && mvn install

CMD ["catalina.sh", "run"]