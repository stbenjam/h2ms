# Hand Hygiene Monitoring System (H2MS)

## Build


```
./mvnw install
```

## Run

And then launch the server:

```
java -jar target/pallmall-0.0.1-SNAPSHOT.jar
```

And visit http://localhost:8080/ in your browser.

To see an example End Point visit http://localhost:8080/managementDashboard/eventexample in your browser.

You can also build and run a docker container, see below.

## Docker

See [Spring Boot Docker](https://spring.io/guides/gs/spring-boot-docker/).  Basically:

```
./mvnw install dockerfile:build
```

And then:

```
docker run -d -p 8080:8080 cscie599/pallmall
```

Alternatively (to not keep the container running after ctrl-c):
```
docker run --rm -it -p 8080:8080 cscie599/pallmall
```

## Docker Compose

In the project root:

```
docker-compose up
```

## In Docker for Windows

1. Start Kitematic
1. Go into Docker CLI
1. If not done already, set user permissions  
``Set-ExecutionPolicy -Scope CurrentUser Unrestricted``
1. Then
``./buildrun.ps1``

