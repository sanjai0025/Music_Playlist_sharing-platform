package com.project.musicplaylistsharingplatform.musicplaylist.Controller;


import com.project.musicplaylistsharingplatform.musicplaylist.Service.LoginService;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/music")
@CrossOrigin
public class LoginController {

    @Autowired
    LoginService service;

    @GetMapping("/get-details-login")
    public ResponseEntity<Login> getDetails(@RequestParam String userName){
        Login res = service.getUserIdAfterValidation(userName);
        if(res != null){
            return ResponseEntity.ok(res);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/add-details")
    public ResponseEntity<Login> addDetails(@RequestBody Login login){
        System.out.println("asdfghj");
        Login res = service.addDetails(login);
        if(res != null){
            return ResponseEntity.ok(res);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> verifyLogin(@RequestBody Login login)
    {
        boolean isValid = service.Authenticate(login.getUserName(),login.getPassWord());

        if(isValid){
            Login loginDetails = service.getUserIdAfterValidation(login.getUserName());
            if (loginDetails != null && loginDetails.getUser() != null) {
            int userId = loginDetails.getUser().getUserId(); // assuming userId is Long
            // boolean userId = loginDetails.isVerified(); 
            return ResponseEntity.ok(loginDetails);
            } 
            else {
            return ResponseEntity.ok(null);
            }
        }
            else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
            }
        
    }

}
