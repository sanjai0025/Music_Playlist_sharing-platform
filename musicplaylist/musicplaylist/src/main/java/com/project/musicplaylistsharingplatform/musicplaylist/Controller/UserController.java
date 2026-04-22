package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.musicplaylistsharingplatform.musicplaylist.Service.LoginService;
import com.project.musicplaylistsharingplatform.musicplaylist.Service.UserService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@CrossOrigin
@RequestMapping("/user")
public class UserController {
    
        @Autowired
        UserService service;

        @GetMapping("/get-userDetails/{id}")
        public UserInfo getUserDetails(@PathVariable int id)
        {
            return service.getUserDetails(id);
        }

        @Autowired
        LoginService loginservice;
        @PostMapping("/add-userDetails")
        public String addUserDetails(@RequestParam String userName,
                                    @RequestBody UserInfo info)
        {
            // Ensure userId is 0 for auto-generation
            UserInfo info1 = service.addUserDetails(info);
            loginservice.addUserDetails(userName,info1);
            if(info1!=null){
                return "Added successfull";
            }
            else{
                return "Failed to add";
            }
        }

        @PutMapping("/update-details/{id}")
         public ResponseEntity<String> updateaProduct(@RequestBody UserInfo newinfo){
             UserInfo details = service.updateDetails(newinfo);
             if(details != null){
                 return new ResponseEntity<>("details updated",HttpStatus.OK);
              }
             else{
                return new ResponseEntity<>("Update failed",HttpStatus.NOT_FOUND);
              }
         }

         @DeleteMapping("/delete-product/{Id}")
        public ResponseEntity<String> DeleteProduct(@PathVariable int Id)
        {
        UserInfo details = service.getUserDetails(Id);

        if(details != null){
            service.deleteProductbyId(Id);
            return new ResponseEntity<>("Deleted successfully",HttpStatus.OK);
        }
        else{
            return new ResponseEntity<>("Deletion failed",HttpStatus.NOT_FOUND);
        }

    }

    //now i'm doing for only presentation 
    //Pagination
    @GetMapping("/pagination")
    public List<UserInfo> fetchPageDetails(@RequestParam int pageno
                                            ,@RequestParam int pagesize 
                                            ,@RequestParam String empnamesort){
    	return service.fetchPage(pageno,pagesize,empnamesort);
    }
}