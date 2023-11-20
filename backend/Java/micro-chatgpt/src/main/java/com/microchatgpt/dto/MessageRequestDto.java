package com.microchatgpt.dto;

import com.microchatgpt.model.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

/*
 *
 * Message dto for request message body
 *
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequestDto {

    // Required fields
    private String text;
    private ArrayList<String> images;
    private boolean sent;
    private Role role;

    private long chatId;
    private String chatName;

}
