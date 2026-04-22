package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import java.util.List;
// import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.musicplaylistsharingplatform.musicplaylist.Service.PlaylistService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Playlist;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/music")
@CrossOrigin(origins = "*")
public class PlaylistController {
    

    @Autowired
    PlaylistService service;

    //add songs to the existing playlist
    @PostMapping("/add-songs-to-existing-playlist/{playlistId}")
    public ResponseEntity<String> addSongsToExistingPlaylist(
        @PathVariable int playlistId,
        @RequestBody List<Integer> songIds) {

        boolean success = service.addSongsToPlaylist(playlistId, songIds);
        if (success) {
            return ResponseEntity.ok("Songs added successfully");
        } else {
            return ResponseEntity.badRequest().body("Playlist not found");
        }
    }

   // just create a new playlist only playlist would be saved 
    @PostMapping("create-playlist-name")
    public ResponseEntity<String> createPlayListName(@RequestParam String name,
                                                      @RequestParam int userid,
                                                      @RequestParam String status){
        String stat = service.createPlaylistName(name,userid,status);
        return ResponseEntity.ok(stat);
    }

     @PostMapping("/create-update-songs")
    public ResponseEntity<Playlist> createOrUpdatePlaylist(@RequestBody Playlist playlist) {
        Playlist savedPlaylist = service.savePlaylist(playlist);
        return ResponseEntity.ok(savedPlaylist);
    }

    @PostMapping("/bot-playlist")
    public ResponseEntity<Playlist> createPlaylist(@RequestBody Playlist playlist) {
        Playlist savedPlaylist = service.botsavePlaylist(playlist);
        return ResponseEntity.ok(savedPlaylist);
    }
   
    @GetMapping("/get-details")
    public ResponseEntity<List<Playlist>> getAllPlaylists() {
        return ResponseEntity.ok(service.getAllPlaylists());
    }

 
    @GetMapping("/get-playlist/{id}")
    public ResponseEntity<List<Playlist>> getPlaylistById(@PathVariable int id) {
        List<Playlist> playlist = service.getPlaylistById(id);
        if (playlist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(playlist);
    }

    @DeleteMapping("/delete-playlist/{id}")
    public ResponseEntity<Void> deletePlaylist(@PathVariable int id) {
        service.deletePlaylistById(id);
        return ResponseEntity.noContent().build();
    }
    
}
