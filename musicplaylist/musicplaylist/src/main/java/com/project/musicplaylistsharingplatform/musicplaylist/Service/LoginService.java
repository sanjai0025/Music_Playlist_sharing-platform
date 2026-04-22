package com.project.musicplaylistsharingplatform.musicplaylist.Service;


import com.project.musicplaylistsharingplatform.musicplaylist.Repository.LoginRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;

@Service
public class LoginService {


    @Autowired
    LoginRepo repo;

//    public Login addDetails(Login login) {
//        return repo.save(login);
//    }
    public Login addDetails(Login login) {
        return repo.save(login);
    }

    public boolean Authenticate(String userName, String passWord) {
        Optional<Login> user = repo.findByUserNameAndPassWord(userName,passWord);
        return user.isPresent();
    }

    public void addUserDetails(String userName, UserInfo user){
        Login login = repo.findByUserName(userName).orElse(null);
        // login.setUserInfo(user);
        login.setUser(user);
        login.setVerified(true);
        user.setLogin(login);

        // Save login again to update foreign key
        repo.save(login);

    }

   public Login getUserIdAfterValidation(String userName){
        return repo.findById(userName).orElse(null);
   }

   public void updateVerifiedStatus(String userName, boolean verified) {
        Optional<Login> loginOpt = repo.findById(userName);
        if (loginOpt.isPresent()) {
            Login login = loginOpt.get();
            login.setVerified(verified);
            repo.save(login);
        }
   }

}
