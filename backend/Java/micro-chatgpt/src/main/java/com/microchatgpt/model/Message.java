package com.microchatgpt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;
import java.util.ArrayList;

/*
 *
 * Message model to save messages of a chat in database
 *
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Message")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String text;

    private ArrayList<String> images;

    @Column(name = "is_sent")
    private boolean sent;

    @Column(name = "timestamp")
    private ZonedDateTime timeStamp;

    @Column(name = "role_name")
    @Enumerated(EnumType.STRING)
    private Role role;

    // chat_id as Foreign key
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "chat_id", referencedColumnName = "id")
    private Chat chat;

    // Add a new method to get the chat ID
    @JsonIgnore
    public Long getChatId() {
        return chat.getId();
    }

    // Add a new method to set the chat ID
    @JsonIgnore
    public void setChatId(Long id) {
        chat.setId(id);
    }

}
