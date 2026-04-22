package com.project.musicplaylistsharingplatform.musicplaylist.model;

// import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private int commentId;

    private String comments;

    @ManyToOne
    @JoinColumn(name = "song_id" , nullable = false)
    private Music music;

    
    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = false)
    private UserInfo user;

    
}