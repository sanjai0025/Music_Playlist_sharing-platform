package com.project.musicplaylistsharingplatform.musicplaylist.Service;


import com.project.musicplaylistsharingplatform.musicplaylist.Repository.MusicRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Music;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
// import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MusicService {

    @Autowired
    private MusicRepo musicRepo;

    public Music addSongs(MultipartFile imageFile, MultipartFile songFile, String description) throws IOException {

        Music music1 = new Music();
        music1.setImageName(imageFile.getOriginalFilename());
        music1.setImageData(imageFile.getBytes());
        music1.setSongName(songFile.getOriginalFilename());
        music1.setSongData(songFile.getBytes());
        music1.setDescription(description);
        return musicRepo.save(music1);
    }

    public List<Music> getAllSongs() {
       return musicRepo.findAll();
    }

    public Music getSongbyId(int id){
        return  musicRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Song not found with id: "+id));
        
    }

    public List<Music> getSongsByIds(List<Integer> ids) {
    return ids.stream()
              .map(id -> musicRepo.findById(id)
                                  .orElseThrow(() -> new RuntimeException("Song not found with id: " + id)))
              .collect(Collectors.toList());
    }

    public List<Music> fetchSongdata(String songName) {
        return musicRepo.findBysongNameContaining(songName);
    }



    

    
}