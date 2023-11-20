package com.microchatgpt.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

/*
 *
 * Firebase configuration
 *
 */
@Configuration
public class FirebaseConfig {

    // Creating Firebase bean using serviceAccountKey.json file
    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        FileInputStream serviceAccount =
                new FileInputStream("micro-chatgpt-main/backend/Java/micro-chatgpt/src/main/resources/serviceAccountKey.json");
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);

        // Return Firebase Instance
        return FirebaseAuth.getInstance();
    }

}
