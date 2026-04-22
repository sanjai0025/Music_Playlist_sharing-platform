package com.project.musicplaylistsharingplatform.musicplaylist.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="playlist")
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int playlistId;

    private String playlistName;

    @ManyToOne
    @JoinColumn(name = "user_id" , nullable = false)//fok to ref users in the playlist
    private UserInfo user;


    private String status;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name="playlist_songs",
        joinColumns = @JoinColumn(name = "playlistId"),//fk from playlist
        inverseJoinColumns = @JoinColumn(name = "id") //fk from music
    )
    private List<Music> songs;
}
