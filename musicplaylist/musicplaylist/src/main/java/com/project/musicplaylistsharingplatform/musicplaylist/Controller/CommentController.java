package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.musicplaylistsharingplatform.musicplaylist.Service.CommentService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Comment;

@RestController
@RequestMapping("/music")
@CrossOrigin
public class CommentController {

        @Autowired
        CommentService service;
    
        @GetMapping("/get-comments")
        public List<Comment> getAllComments(){
            return service.getAllComments();
        }
        @PostMapping("/comment")
        public ResponseEntity<Comment> addcomment(@RequestBody Comment comment)
        {
            Comment comment1 = service.addcomment(comment);
            if(comment1!=null){
                return new ResponseEntity<>(comment1,HttpStatus.CREATED);
             }
            else{
                return new ResponseEntity<>(comment1,HttpStatus.INTERNAL_SERVER_ERROR);
            }
        
        }

        @PutMapping("/edit-comment")
        public ResponseEntity<Comment> updateComment(@RequestBody Comment comment)
        {
            Comment comment2 = service.updateComment(comment);
            if(comment2!=null){
                return new ResponseEntity<>(comment2,HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>(comment2,HttpStatus.BAD_REQUEST);
            }
        }

        @DeleteMapping("/delete-comment/{id}")
        public ResponseEntity<String> deleteComment(@PathVariable int id)
        {
            Comment comment1 = service.getCommentbyId(id);
            if(comment1!=null){
                return new ResponseEntity<>("successfully deleted",HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("failed to delete",HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        

        //bot codes
        @GetMapping("/song-comments/{songId}")
         public List<Comment> getCommentsBySongId(@PathVariable long songId) {
            return service.getCommentsBySongId(songId);
        }

    
}

