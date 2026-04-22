package com.project.musicplaylistsharingplatform.musicplaylist.model;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Login {


    @Id
    private String userName;
    private String passWord;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_fk_ref")
    private UserInfo user;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private boolean verified = false;  // Default false until OTP verified
}
