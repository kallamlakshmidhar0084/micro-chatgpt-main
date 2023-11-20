package com.microchatgpt.repository;

import com.microchatgpt.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 *
 * Message Repository
 *
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // Query for retrieving all the messages of a chat by chat ID
    @Query("SELECT m FROM Message m WHERE m.chat.id = :chatId ORDER BY m.id")
    List<Message> findBYChatId(@Param("chatId") Long chatId);

}
