package com.project.musicplaylistsharingplatform.musicplaylist.Controller;


import com.project.musicplaylistsharingplatform.musicplaylist.Service.MusicService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Music;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin
@RequestMapping("/music")
public class MusicController {


        @Autowired
        private MusicService service;

        @PostMapping("/add-songs")
        public ResponseEntity<?>  addSongs(@RequestParam("image") MultipartFile imageFile,
                                            @RequestParam("song") MultipartFile songFile,
                                           @RequestParam("desc") String Desc){
        try {
            Music music1 = service.addSongs(imageFile,songFile,Desc);
            return new ResponseEntity <> (music1,HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
        }

        @GetMapping("/songs")
        public List<Music> getAllSongs() {
            return service.getAllSongs();
        }
        
        //for contains key
        @GetMapping("/containing")
        public List<Music> getMusicName(@RequestParam String songName){
            return service.fetchSongdata(songName);
        }


}
