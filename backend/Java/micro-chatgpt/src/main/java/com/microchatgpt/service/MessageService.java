package com.microchatgpt.service;

import com.microchatgpt.exception.ResourceNotFoundException;
import com.microchatgpt.model.Message;
import com.microchatgpt.repository.ChatRepository;
import com.microchatgpt.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 *
 * Message Service
 *
 */
@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ChatRepository chatRepository;


    // Create a message
    public Message createMessage(Message message) {
        // Save message and return it
        return messageRepository.save(message);
    }


    // Retrieve a message by message ID
    public Message getMessageById(Long id) {
        // Find message or else throw a ResourceNotFoundException
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + id));
        // return message
        return message;
    }


    // Update a message by message ID
    public Message updateMessage(Long id, Message message) {
        // Find message or else throw a ResourceNotFoundException
        Message presentMessage = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + id));

        // Delete present message from history
        messageRepository.delete(presentMessage);
        // Save new message and return it
        return messageRepository.save(message);
    }


    // Delete a message by message ID
    public void deleteMessage(Long id) {
        // Find message or else throw a ResourceNotFoundException
        Message message = messageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + id));

        // Delete present message from history
        messageRepository.delete(message);
    }
}
