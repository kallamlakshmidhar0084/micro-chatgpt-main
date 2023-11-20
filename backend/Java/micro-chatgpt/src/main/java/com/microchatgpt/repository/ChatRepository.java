package com.microchatgpt.repository;

import com.microchatgpt.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 *
 * Chat Repository
 *
 */
@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Query for retrieving all the chats of a user using user UID in descending order by lastMessageTimeStamp
    @Query("SELECT c FROM Chat c WHERE c.user.uid = :userUid ORDER BY c.lastMessageTimeStamp DESC")
    List<Chat> getAllChats(@Param("userUid") String userUid);

}
