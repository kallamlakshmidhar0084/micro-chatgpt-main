package com.microchatgpt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

/*
 *
 * Chat model to save chats history in database
 *
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Chat")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "name")
    private String name;

    @Column(name = "timestamp")
    private ZonedDateTime lastMessageTimeStamp;

    // user_uid as Foreign key
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "user_uid", referencedColumnName = "uid")
    private User user;


    // Add a new method to get the user UID
    @JsonIgnore
    public String getUserUid() {
        return user.getUid();
    }

    // Add a new method to set the user UID
    @JsonIgnore
    public void setUserUid(String uid) {
        user.setUid(uid);
    }

}

