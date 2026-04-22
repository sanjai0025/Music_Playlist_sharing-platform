package com.project.musicplaylistsharingplatform.musicplaylist.model;


import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Songs")
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Music {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;
        private String imageName;
        @Lob
        private byte[] imageData;
        private String songName;
        @Lob
        private byte[] songData;
        private String description;

        @OneToMany(mappedBy = "music", cascade = CascadeType.ALL, orphanRemoval = true)
        @JsonIgnore
        private List<Comment> comments;

        @ManyToMany(mappedBy = "songs") // Refers to Playlist's "songs" field
        @JsonIgnore 
        private List<Playlist> playlists;
}
