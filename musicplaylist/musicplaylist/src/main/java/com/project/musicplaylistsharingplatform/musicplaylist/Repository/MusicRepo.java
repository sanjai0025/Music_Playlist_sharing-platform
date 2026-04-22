package com.project.musicplaylistsharingplatform.musicplaylist.Repository;


import com.project.musicplaylistsharingplatform.musicplaylist.model.Music;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MusicRepo extends JpaRepository<Music,Integer> {

    List<Music> findBysongNameContaining(String songName);


}
