package com.microchatgpt.controller;

import com.microchatgpt.dto.MessageRequestDto;
import com.microchatgpt.model.Chat;
import com.microchatgpt.model.Message;
import com.microchatgpt.model.User;
import com.microchatgpt.repository.ChatRepository;
import com.microchatgpt.repository.MessageRepository;
import com.microchatgpt.repository.UserRepository;
import com.microchatgpt.service.MessageService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.Map;

/*
 *
 * Message controller for all the CRUD operations
 *
 */
@Slf4j
@RestController
@RequestMapping("v1/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;


    // Create a new chat if it is the first message that do not contain chat ID
    // If the message dto body contains chat ID, it creates a new message in that chat
    @PostMapping("/message")
    public ResponseEntity<Message> createMessage(@RequestBody MessageRequestDto messageRequestDto, HttpServletRequest request) {

        // Extracting uid from request that contains Token
        String uid = (String) request.getAttribute("uid");

        Chat chat = null;
        User user = null;
        // Find the chat and user by their respective IDs
        // Using messageRequestDto body for all required fields
        try {
            chat = chatRepository.findById(messageRequestDto.getChatId()).orElse(null);
            user = userRepository.findById(uid).orElse(null);
        } catch (IllegalArgumentException exception) {

        } finally {

            // Check if the chat and user exist
            if (chat == null && user == null) {
                log.info("User Not Found");
                // Return the 404 NOT_FOUND status
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }

            // Create a new message
            Message message = new Message();
            message.setText(messageRequestDto.getText());
            message.setImages(messageRequestDto.getImages());
            message.setSent(messageRequestDto.isSent());
            message.setRole(messageRequestDto.getRole());
            message.setTimeStamp(ZonedDateTime.now());


            if (chat == null) {
                // Create a new chat
                Chat newChat = new Chat();
                newChat.setName(messageRequestDto.getChatName());
                newChat.setLastMessageTimeStamp(ZonedDateTime.now());
                newChat.setUser(user);
                chatRepository.save(newChat);
                message.setChat(newChat);
                log.info("New chat created");
            } else {
                chat.setLastMessageTimeStamp(ZonedDateTime.now());
                chatRepository.save(chat);
                message.setChat(chat);
            }


            // Save the new message
            Message createdMessage = messageRepository.save(message);
            log.info("New message created");
            // Return the created message with a 201 Created status
            return new ResponseEntity<>(createdMessage, HttpStatus.CREATED);
        }
    }


    // Retrieve a message by message ID
    @GetMapping("/message")
    public ResponseEntity<Map<String, Object>> getMessageById(@RequestParam Long id) {
        // Call the messageService to retrieve a message by its id
        Message message = messageService.getMessageById(id);

        // Formatting the required api response
        Map<String, Object> requiredMessage = new HashMap<>();
        requiredMessage.put("id", message.getId());
        requiredMessage.put("role", message.getRole());
        requiredMessage.put("text", message.getText());
        requiredMessage.put("images", message.getImages());
        requiredMessage.put("sent", message.isSent());
        requiredMessage.put("timeStamp", message.getTimeStamp());
        requiredMessage.put("chatId", message.getChatId());

        log.info("Get a message by Id");
        // Return all the fields of that messages with a 200 OK status
        return new ResponseEntity<>(requiredMessage, HttpStatus.OK);
    }


    // Update a message by message ID
    @PutMapping("/message")
    public ResponseEntity<Message> updateMessage(@RequestParam Long id, @RequestBody Message message) {
        // Call the messageService to update a message by its id
        Message updatedMessage = messageService.updateMessage(id, message);
        // Return the updated message with a 200 OK status
        return new ResponseEntity<>(updatedMessage, HttpStatus.OK);
    }


    // delete a message by message ID
    @DeleteMapping("/message")
    public ResponseEntity<Void> deleteMessage(@RequestParam Long id) {
        // Call the messageService to delete a message by its id
        messageService.deleteMessage(id);
        // Return 200 OK status
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}
