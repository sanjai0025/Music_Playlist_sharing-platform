package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.musicplaylistsharingplatform.musicplaylist.Repository.CommentRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Comment;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Music;
import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;


@Service
public class CommentService {
    @Autowired
    CommentRepo repo;

    @Autowired
    MusicService musicService;

    @Autowired
    UserService userService;
    public List<Comment> getAllComments(){
        return repo.findAll();
    }

    public Comment addcomment(Comment comment) {
        int userId = comment.getUser().getUserId();
        UserInfo info= userService.getUserDetails(userId);
        int musicId = (int)comment.getMusic().getId();
        Music music=musicService.getSongbyId(musicId);
        comment.setUser(info);
        comment.setMusic(music);
        return repo.save(comment);
    }

    public Comment getCommentbyId(int id){
        Optional<Comment> found = repo.findById(id);
        return found.orElse(null);
    }

    public Comment updateComment(Comment comment) {
        return repo.save(comment);
    }

    public List<Comment> getCommentsBySongId(long songId) {
        return repo.findByMusicId(songId);
    }
    
}
