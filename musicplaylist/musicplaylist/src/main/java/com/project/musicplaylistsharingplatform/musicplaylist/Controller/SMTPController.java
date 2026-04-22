package com.project.musicplaylistsharingplatform.musicplaylist.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.project.musicplaylistsharingplatform.musicplaylist.Service.SMTPService;

@RestController
@RequestMapping("/music")
public class SMTPController {
    @Autowired
    SMTPService service;

    @PostMapping("/smtp")
	public String saveSmtpData(@RequestParam String receiver,@RequestParam String subject,@RequestParam String body)
	{
		return service.saveSmtpRecords(receiver,subject,body);
	}
}