package com.microchatgpt.service;

import com.microchatgpt.exception.ResourceNotFoundException;
import com.microchatgpt.model.User;
import com.microchatgpt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

/*
 *
 * User Service
 *
 */
@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    // Create a user
    public User createUser(User user) {
        // Save a user and return it
        return userRepository.save(user);
    }


    // Retrieve a user by user UID
    public ResponseEntity<User> getUser(String uid) {
        // Find user or else throw a ResourceNotFoundException
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + uid));

        // Return user
        return ResponseEntity.ok(user);
    }


    // Update a user by user UID
    public ResponseEntity<User> updateUser(User user, String uid) {
        // Find user or else throw a ResourceNotFoundException
        User presentUser = userRepository.findById(uid)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + uid));

        // delete present user from history
        userRepository.delete(presentUser);
        // Save a user
        userRepository.save(user);

        // Return a user
        return ResponseEntity.ok(user);
    }


    // Delete a user by its UID
    public ResponseEntity<HttpStatus> deleteUser(String uid) {
        // Find user or else throw a ResourceNotFoundException
        User user = userRepository.findById(uid)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + uid));

        // Delete present user from history
        userRepository.delete(user);
        // Return http OK status
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
