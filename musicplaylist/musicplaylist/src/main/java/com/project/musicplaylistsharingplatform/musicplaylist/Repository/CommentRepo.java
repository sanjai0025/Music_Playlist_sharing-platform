package com.project.musicplaylistsharingplatform.musicplaylist.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.musicplaylistsharingplatform.musicplaylist.model.Comment;


@Repository
public interface CommentRepo extends JpaRepository<Comment,Integer> {
        // Custom query method to find comments by songId
    List<Comment> findByMusicId(long songId);
}
