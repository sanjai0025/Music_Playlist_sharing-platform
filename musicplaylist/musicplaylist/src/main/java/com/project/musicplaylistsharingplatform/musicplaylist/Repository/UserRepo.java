package com.project.musicplaylistsharingplatform.musicplaylist.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;

@Repository
public interface UserRepo extends JpaRepository<UserInfo,Integer>{

    	

	List<UserInfo> findByEmailIDEndsWith(String email);

	List<UserInfo> findByEmailIDLike(String email);

	List<UserInfo> findByEmailIDContains(String email);

	List<UserInfo> findByEmailIDNotLike(String email);

    List<UserInfo> findByEmailIDNotContains(String email);
    
    List<UserInfo> findByPhoneNumAndEmailID(Long phoneNum, String email);

	List<UserInfo> findByPhoneNumOrEmailID(Long phoneNum, String email);


}
