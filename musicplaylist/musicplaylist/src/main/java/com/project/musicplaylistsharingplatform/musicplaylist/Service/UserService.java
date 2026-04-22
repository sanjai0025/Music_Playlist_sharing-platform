package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.musicplaylistsharingplatform.musicplaylist.Repository.UserRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.UserInfo;

@Service
public class UserService {
    @Autowired
    UserRepo repo;

    public UserInfo getUserDetails(int id) {
        Optional<UserInfo> user = repo.findById(id);
        return user.orElse(null); 
    }

    public UserInfo addUserDetails(UserInfo info)
    {
        return repo.save(info);
    }

    public UserInfo updateDetails(UserInfo newinfo) {
        return repo.saveAndFlush(newinfo);
    }

    public void deleteProductbyId(int id) {
        repo.deleteById(id);
    }


    //contains || not-contains 
    // public List<UserInfo> startWithRecords(String username) {
	// 	return repo.findByEmailIDStartsWith(username);
	// }

	public List<UserInfo> endsWithRecords(String email) {
		return repo.findByEmailIDEndsWith(email);
	}
    public List<UserInfo> LikeRecords(String email) {
		return repo.findByEmailIDLike(email);
	}

	public List<UserInfo> ContainingRecords(String email) {
		return repo.findByEmailIDContains(email);
	}

	public List<UserInfo> NotContainingRecords(String email) {
		return repo.findByEmailIDNotContains(email);
	}

	public List<UserInfo> NotLikeRecords(String email) {
		return repo.findByEmailIDNotLike(email);
	}

	public List<UserInfo> isNotContainsRecords(String email) {
		return repo.findByEmailIDNotContains(email);
	}
    public List<UserInfo> fetchAndRecords(long phoneNum,String email) {
		return repo.findByPhoneNumAndEmailID(phoneNum,email);

	}

	public List<UserInfo> fetchOrRecords(long phoneNum,String email) {
		return repo.findByPhoneNumOrEmailID(phoneNum,email);
	}



    public List<UserInfo> fetchPage(int pageno, int pagesize, String empnamesort) {
        Pageable pageable = PageRequest.of(pageno, pagesize, Sort.by(empnamesort).ascending());
        return repo.findAll(pageable).getContent();
    }

    public void updateUserStatus(int userId, String status) {
        Optional<UserInfo> userOpt = repo.findById(userId);
        if (userOpt.isPresent()) {
            UserInfo user = userOpt.get();
            user.setStatus(status);
            repo.save(user);
        }
    }
    



}
