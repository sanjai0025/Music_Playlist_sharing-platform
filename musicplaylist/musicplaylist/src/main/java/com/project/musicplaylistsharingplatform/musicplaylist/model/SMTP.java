package com.project.musicplaylistsharingplatform.musicplaylist.model;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "mail")
@Data
public class SMTP {

    @Id
    @Column(name = "userid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userid;
    @Column(name="receiver")
    private String receiver;
    @Column(name="subject")
    private  String subject;
    @Column(name="body")
    private String body;


}