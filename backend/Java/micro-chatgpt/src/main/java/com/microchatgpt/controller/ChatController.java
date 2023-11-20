package com.microchatgpt.controller;

import com.microchatgpt.model.Chat;
import com.microchatgpt.model.Message;
import com.microchatgpt.service.ChatService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*
 *
 * Chat controller for all the CRUD operations
 *
 */
@Slf4j
@RestController
@RequestMapping("v1/api/chats")
@CrossOrigin(origins = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;


    // Retrieve all the chats of a user
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllChats(HttpServletRequest request) {

        // Extracting uid from request that contains Token
        String uid = (String) request.getAttribute("uid");

        // Call the chatService to get all the chats
        List<Chat> chats = chatService.getAllChats(uid);
        List<Map<String, Object>> chatList = new ArrayList<>();

        // Formatting required api response
        for (Chat chat : chats) {
            Map<String, Object> chatInfo = new HashMap<>();
            chatInfo.put("id", chat.getId());
            chatInfo.put("name", chat.getName());
            chatInfo.put("timeStamp", chat.getLastMessageTimeStamp());
            chatList.add(chatInfo);
        }

        if (chatList.size() == 0) {
            log.info("Chat not found");
            // Return the 404 NOT_FOUND status
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            // Return all the chats with a 200 OK status
            return new ResponseEntity<>(chatList, HttpStatus.OK);
        }
    }


    // Create a new chat
    // Currently not in use
    @PostMapping("/chat")
    public ResponseEntity<Chat> createChat(@RequestBody Chat chat) {
        // Call the chatService to create a chat
        Chat createdChat = chatService.createChat(chat);
        // Return the created chat with a 201 Created status
        return new ResponseEntity<>(createdChat, HttpStatus.CREATED);
    }


    // Retrieve a chat by ID
    // Return all the messages of a chat
    @GetMapping("/chat")
    public ResponseEntity<List<Map<String, Object>>> getChatById(@RequestParam Long id) {
        // Call the chatService to retrieve a chat by its id
        List<Message> messages = chatService.getChatById(id);
        List<Map<String, Object>> messageList = new ArrayList<>();

        // Formatting the required api response
        for (Message message : messages) {
            Map<String, Object> messageInfo = new HashMap<>();
            messageInfo.put("id", message.getId());
            messageInfo.put("text", message.getText());
            messageInfo.put("images", message.getImages());
            messageInfo.put("sent", message.isSent());
            messageInfo.put("timeStamp", message.getTimeStamp());
            messageInfo.put("role", message.getRole());
            messageList.add(messageInfo);
        }

        if (messageList.size() == 0) {
            log.info(String.valueOf(ResponseEntity.status(HttpStatus.NOT_FOUND).build()));
            // Return the 404 NOT_FOUND status
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } else {
            log.info(String.valueOf(ResponseEntity.status(HttpStatus.FOUND).build()));
            // Return all the messages of that chat with a 200 OK status
            return new ResponseEntity<>(messageList, HttpStatus.OK);
        }
    }


    // Update a chat by chat ID
    @PutMapping("/chat")
    public ResponseEntity<Chat> updateChat(@RequestParam Long id, @RequestBody Chat chat) {
        // Call the chatService to update a chat
        Chat updatedChat = chatService.updateChat(id, chat);
        // Return the updated chat with a 200 OK status
        return new ResponseEntity<>(updatedChat, HttpStatus.OK);
    }


    // Delete a chat by chat ID
    @DeleteMapping("/chat")
    public ResponseEntity<Void> deleteChat(@RequestParam Long id) {
        // Call the chatService to delete a chat by its id
        chatService.deleteChat(id);
        // Return 200 OK status
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
