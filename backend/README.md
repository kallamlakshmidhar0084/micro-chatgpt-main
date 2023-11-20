-->
Run Spring Boot app using Maven
Maven is not installed any more by default on Mac OS X 10.9. You need to install it by yourself, for example using Homebrew.

The command to install Maven using Homebrew is 
        $ brew install maven

-->  
Add Maven Plugin to POM.XML
    <build>
       <plugins>
         <plugin>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-maven-plugin</artifactId>
          </plugin>
        </plugins>
    </build>

-->
Build Spring Boot Project with Maven

        $ mvn package
or

        $ mvn install / mvn clean install


-->
Run Spring Boot app using Maven:

        $ mvn spring-boot:run