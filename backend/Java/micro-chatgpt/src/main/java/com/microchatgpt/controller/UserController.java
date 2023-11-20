package com.microchatgpt.controller;

import com.microchatgpt.model.User;
import com.microchatgpt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/*
 *
 * User controller for all the CRUD operations
 *
 */
@Slf4j
@RestController
@RequestMapping("v1/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;


    // Create a new user
    @PostMapping("/user")
    public User createUser(@RequestBody User user) {
        log.info("New user created");
        // Call the userService to create a user
        return userService.createUser(user);
    }


    // Retrieve a User
    @GetMapping("/user")
    public ResponseEntity<User> getUser(HttpServletRequest request) {
        // Extracting uid from request that contains Token
        String uid = (String) request.getAttribute("uid");
        // Call the userService to retrieve a user
        return userService.getUser(uid);
    }


    // Update a User
    @PutMapping("/user")
    public ResponseEntity<User> updateUser(@RequestBody User user, HttpServletRequest request) {
        // Extracting uid from request that contains Token
        String uid = (String) request.getAttribute("uid");
        // Call the userService to update a user
        return userService.updateUser(user, uid);
    }


    // Delete a User
    @DeleteMapping("/user")
    public ResponseEntity<HttpStatus> deleteUser(HttpServletRequest request) {
        // Extracting uid from request that contains Token
        String uid = (String) request.getAttribute("uid");
        // Call the userService to delete a user
        return userService.deleteUser(uid);
    }
}
