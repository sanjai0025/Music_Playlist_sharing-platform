package com.project.musicplaylistsharingplatform.musicplaylist.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.musicplaylistsharingplatform.musicplaylist.model.Playlist;

import jakarta.validation.constraints.AssertFalse;

@Repository
public interface PlaylistRepo extends JpaRepository<Playlist,Integer> {
    List<Playlist> findByStatus(String status);
    List<Playlist> findByUserUserId(int userId);
    List<Playlist> findByPlaylistName(String playlistName);
}
