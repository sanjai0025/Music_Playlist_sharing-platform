package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.musicplaylistsharingplatform.musicplaylist.Repository.MusicRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.Repository.PlaylistRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.Repository.UserRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Music;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Playlist;
import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;

@Service
public class PlaylistService {
    
    @Autowired
    PlaylistRepo repo;

    public Playlist findPlaylist(int playlistId){
        Optional<Playlist> present = repo.findById(playlistId);
        return present.orElse(null);
    }

    
    @Autowired
    MusicService service;
    public Playlist botsavePlaylist(Playlist playlist) {
        List<Integer> songIds = playlist.getSongs().stream()
                                    .map(m -> Math.toIntExact(m.getId())) // Convert Long to Integer safely
                                    .collect(Collectors.toList());

        List<Music> songs = service.getSongsByIds(songIds);
        playlist.setSongs(songs);
        return repo.save(playlist);
    }
    @Autowired
    MusicRepo mrepo;
    public Playlist createPlaylist(String playlistName, List<Integer> songIds) {
        Playlist playlist = new Playlist();
        playlist.setPlaylistName(playlistName);

        if (songIds != null && !songIds.isEmpty()) {
            List<Music> songs = mrepo.findAllById(songIds);
            playlist.setSongs(songs);
        }

        return repo.save(playlist);
    }
    public void addSongs(int songid){
        //repo.save(songid);
    }

    public Playlist savePlaylist(Playlist playlist) {
        return repo.save(playlist);
    }

    public List<Playlist> getAllPlaylists() {
        return repo.findByStatus("public");
    }

    
    public List<Playlist> getPlaylistById(int id) {
        return repo.findByUserUserId(id);
    }

    public void deletePlaylistById(int id) {
        repo.deleteById(id);
    }
    @Autowired
    private UserRepo userRepo;
    public String createPlaylistName(String name, int userId, String status) {
        List<Playlist> existing = repo.findByPlaylistName(name);
        if (!existing.isEmpty()) {  // check if list contains any playlist
            return "Playlist name already exists";
        }
    
        Playlist playlist = new Playlist();
        playlist.setPlaylistName(name);
    
        UserInfo user = userRepo.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
        playlist.setUser(user);
        playlist.setStatus(status);
    
        repo.save(playlist);
    
        return "Playlist name created successfully";
    }

    //add songs to the existing playlist
    public boolean addSongsToPlaylist(int playlistId, List<Integer> songIds) {
        Optional<Playlist> optionalPlaylist = repo.findById(playlistId);
        if (!optionalPlaylist.isPresent()) {
            return false;
        }
    
        Playlist playlist = optionalPlaylist.get();
    
        for (Integer songId : songIds) {
            Music song = mrepo.findById(songId)
                            .orElseThrow(() -> new RuntimeException("Song not found with id " + songId));
            if (!playlist.getSongs().contains(song)) {  // prevent duplicates
                playlist.getSongs().add(song);
            }
        }
    
        repo.save(playlist);
        return true;
    }
    
    
}
