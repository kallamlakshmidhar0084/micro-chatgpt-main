# Micro-ChatGPT API
This is a Spring Boot project that implements a chat application with a PostgreSQL database backend. The application allows users to engage in real-time conversations and store chat data persistently.

# Technologies Used
Java 8+

Spring Boot

PostgreSQL

Hibernate

# Getting Started
# Prerequisites
Java Development Kit (JDK) 8 or higher

Maven (if you prefer building with Maven)

PostgreSQL database (installed and running)

# Setup
1. Clone the repository or download the source code:

       $ git clone https://github.com/griddynamics/micro-chatgpt.git

2. Open the project in your preferred IDE.

3. Configure the PostgreSQL database connection properties in the application.properties file located in the src/main/resources directory:

       $ spring.datasource.url=jdbc:postgresql://35.239.169.59:5432/micro_chatgpt?useSSL=false
       $ spring.datasource.username=postgres
       $ spring.datasource.password=`{#O#0I6u*L9[J*x

4. Configure the Firebase connection properties in the ServiceAccountKey.json file located in the src/main/resources directory:

       {
        "type": "service_account",
        "project_id": "gd-gcp-internship-ind",
        "private_key_id": "e40bd4903cc5dcfe2d4eebbea578bf2b5b649d85",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDCJWTs6MA7yRV5\nzUao898GLI2B9VMc62fQ8kH+wqrl+1sRpCVG8ZaUyvDgs3GlzaKCpTr1vckbFy9w\nz/iugcrGA9s9E7qzhvZskAjP0n1GiJuPg0ozxn8zeAn6HTXWRD1iUB46bBiZuGZO\n6Q4o0r7hqHfCBZUtDPSI00qjVhJO2w+aBGFvoD6SgwUQMwuINO/np6o9nr4QCCwT\nVscNiJenV7GyMPawBrgHUtNpDGfeLbp60II3mpqjB/LwI88HtwkjouKzyfREzTXP\nbmznQZGpuKJ51zl+MXmtPrYsXAaoMD5R0h2sxX9w3xttDX36eHnyLIO3sVNcF1pH\n+WQrq7aNAgMBAAECggEAC1z8m8CBuTNrSN5Cw6fGcXTmcWlQ9zEwudzmukkIOf7C\nFUsUuCLIFqcMKIgINP/6AjM2kLnjd+zy+g40zCNM9tW0nXi2pZmsJFgyfoDKPqMc\nlm6aR2PXqm+yXHZyN2YgwPeB1WyMl2QLb5SaH2SPseMrjepyu+4gBT7MsGOyHaBV\nj9oUj41Yzl/UoOGFqMFLDfnAuizXlNS6RIZJvHA40w3JN5xcOb/0/CueauaG77hJ\nXsjb0KdVcps/IhPMTTmh/OY+YSocHOrPZsWDaH+ujikhRm0TlsTp/ro0Qu8yjso3\n3XJlQ8TUVkbglsPk8ph666Qv9U7RRv8EIV43YNfsAQKBgQDvAz+kHmOMWuI93npW\nNGGo+7HHFuFjbKwln0/ZPxHHGPz/UIMmeA3n3sNkN8PNSvueiQVk9O8Dq6wE2KGL\nl6ovFsdY/CRu7LTjsMM8eyj6Oa9PqMosybhFVYrcseOi5wyRnKKWFLG7RZOM+iT8\nHHJMwiBa0kNs8tyR8dLJwUtaAQKBgQDP8dA5dyarrFh3U6jPg+FwPM41YPFQyFWl\nIX1F9v/yKbzc70LApmQDhyUXQzIUQdkg+oKEjKmxJ3nkGpVb36/TVGXE9FXZaUvs\nFNds17IZVWJQMBM41G4eiB6cTYNbjrjIGrCFrlbrxYxYx/fjN9C00M261SjxFzLm\nHvqbDoMkjQKBgHE5cr6GftYQf7ibWgzYR6NLiI4tspvs8SfpbmQV0pAksEUqmNZy\nbPP4vUsOd70a1lPlyR5oQYnVm2m4Td7Y/A/OlKT83S2HCLIMHJDcLy9KgFgWN6A7\n9wUxXtTpmFKlbXjVYNgD+aYjcaCJJ1gfCa5/D+C2VqaX7hFdI2PcI5wBAoGAKNn9\nqTxyOWm7W33w/QuQn2cir7Pi1Jb21GEW5kbXE3EFrHXIrGZD4bmMHNzTms0w5dyx\nBW9I6wexV5GtZAY22ZKMB7xknTildLTHeZeKYpW2ocBAFnsNQyxErzo/Ix6PyKgN\no8WTR/BgWRS360iM1OjscdbsmyiOlEzjuNCKDQUCgYEA7Y55Bgd8CvN7kMGWuj2h\nnxtpxFT3VDLWEzXTQl+U/nTQSj4Ag2FYGrr56JY0d9/4WsM9T7apo6ZNLlMtGWXQ\n5PvrEtLXy/pfuRrVVFpYLzGrOBS6PU7+Ix2AKJdnV/aVCIDbDkrnJmlEWP5UmU6m\ny9Ti9nM2leTSa6VN6lFN4s4=\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-n1786@gd-gcp-internship-ind.iam.gserviceaccount.com",
        "client_id": "117483922867998923211",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-n1786%40gd-gcp-internship-ind.iam.gserviceaccount.com"
       }

5. Build Spring Boot app using Maven

   As Maven is not installed any more by default on Mac OS X 10.9. You need to install it by yourself, for example using Homebrew.

   The command to install Maven using Homebrew is

       $ brew install maven

   Build Spring Boot Project using Maven

   first go to the java backend source root : /backend/java/micro-chatgpt

   Then execute following commands -

       $ mvn package / mvn clean package

   or

       $ mvn install / mvn clean install

6. Run Spring Boot app using Maven:

       $ mvn spring-boot:run

   or
   You can use a jar file generated after completion of build

       $ java -jar target/<your-file-name>.jar

7. The application should now be running on http://localhost:6060. You can test the API endpoints using a tool like Postman.

   To stop execution :

   Press Ctrl + C

# Features
1. User authentication: Users can create accounts, log in, and log out.
2. Chat history: All chat messages are stored in the PostgreSQL database for future reference.
3. User management: Users can view and manage their chat history, update their profiles.

# CORS Policy
The API is configured with a Cross-Origin Resource Sharing (CORS) middleware to allow requests from any origin.