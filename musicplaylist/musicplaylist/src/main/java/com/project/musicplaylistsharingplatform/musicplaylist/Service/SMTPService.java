package com.project.musicplaylistsharingplatform.musicplaylist.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.project.musicplaylistsharingplatform.musicplaylist.Repository.SMTPRepo;
import com.project.musicplaylistsharingplatform.musicplaylist.model.SMTP;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class SMTPService {
        @Autowired
        SMTPRepo repo;

        @Autowired
        JavaMailSender sender;

        public String saveSmtpRecords(String receiver, String subject, String body) {

            try
            {
            MimeMessage msg = sender.createMimeMessage();
            MimeMessageHelper msgHelper=new MimeMessageHelper(msg);
    
            msgHelper.setTo(receiver);
            msgHelper.setSubject(subject);
            msgHelper.setText(body);

            sender.send(msg);
            SMTP mentity=new SMTP();
            mentity.setReceiver(receiver);
            mentity.setSubject(subject);
            mentity.setBody(body);
            // mentity.setUserid(id);
    
            repo.save(mentity);
            return "Mail Sent Successfully";
            }catch(MessagingException m)
            {
                return "Mail Sent Failed"+m.getMessage();
            }
        
    
}
}
