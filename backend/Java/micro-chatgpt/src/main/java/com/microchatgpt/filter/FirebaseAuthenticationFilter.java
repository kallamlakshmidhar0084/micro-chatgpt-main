package com.microchatgpt.filter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/*
 *
 * Authentication Filter to check Tokens for all incoming request
 *
 */
@Component
@Slf4j
@WebFilter(urlPatterns = "v1/api/*") // URL mapping for All Controllers
public class FirebaseAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private FirebaseAuth firebaseAuth;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Retrieve uri from request
        String requestURI = request.getRequestURI();
        // Retrieve http method from request
        String requestMethod = request.getMethod();

        // Exclude POST method for user controller to create new user
        // Do not need Token to create a user
        if ("POST".equals(requestMethod) && "/v1/api/users/user".equals(requestURI)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Checking the authorization header
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            // Return the 401 SC_UNAUTHORIZED status
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized");
            log.info(String.valueOf(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));

        } else {

            // Remove the bearer suffix from header
            String token = authorizationHeader.substring(7);

            //logic to validate the authorization header (Bearer Token) using Firebase
            FirebaseToken decodedToken;
            try {
                // Retrieve decoded Token from firebase
                decodedToken = firebaseAuth.verifyIdToken(token);

                // Retrieve uid from decoded Token
                String uid = decodedToken.getUid();

                // Set the authenticated user in the request
                request.setAttribute("uid", uid);

                // If the authorization is valid
                filterChain.doFilter(request, response);
            } catch (FirebaseAuthException e) {
                // Return the 401 SC_UNAUTHORIZED status
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized");
                log.info(String.valueOf(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()));
            }
        }

    }
}

