package com.microchatgpt.service;

import com.microchatgpt.exception.ResourceNotFoundException;
import com.microchatgpt.model.Chat;
import com.microchatgpt.model.Message;
import com.microchatgpt.repository.ChatRepository;
import com.microchatgpt.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/*
 *
 * Chat Service
 *
 */
@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;


    // Retrieve all the chats of a user by user UID
    public List<Chat> getAllChats(String uid) {
        // Call chat repository to get list of all the chats
        List<Chat> chats = chatRepository.getAllChats(uid);
        // Return a list of all chats
        return chats;
    }


    // Create a chat
    public Chat createChat(Chat chat) {
        // Return created chat
        return chatRepository.save(chat);
    }


    // Retrieve a chat by chat ID
    public List<Message> getChatById(Long id) {
        // List of all the messages of a chat
        List<Message> chat = messageRepository.findBYChatId(id);
        // Return all the messages
        return chat;
    }


    // Update a chat by chat ID
    public Chat updateChat(Long id, Chat chat) {
        // Find chat or else throw a ResourceNotFoundException
        Chat presentChat = chatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + id));

        // Delete present chat from history
        chatRepository.delete(presentChat);
        // Save new chat and return it
        return chatRepository.save(chat);
    }


    // Delete a chat by chat ID
    public void deleteChat(Long id) {
        // Find chat or else throw a ResourceNotFoundException
        Chat presentChat = chatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not exit with id: " + id));

        // Delete present chat from history
        chatRepository.delete(presentChat);
    }
}
