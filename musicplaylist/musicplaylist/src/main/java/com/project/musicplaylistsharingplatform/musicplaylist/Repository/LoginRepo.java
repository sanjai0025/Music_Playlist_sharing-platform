package com.project.musicplaylistsharingplatform.musicplaylist.Repository;

import com.project.musicplaylistsharingplatform.musicplaylist.model.Login;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface LoginRepo extends JpaRepository<Login,String> {
    Optional<Login> findByUserNameAndPassWord(String userName, String passWord);
    Optional<Login> findByUserName(String userName);
}
