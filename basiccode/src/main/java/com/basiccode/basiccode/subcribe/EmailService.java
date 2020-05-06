package com.basiccode.basiccode.subcribe;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
	
	public void sendEmail(String subject, String emailBody, String userEmail) throws MessagingException{
		
		Properties props = new Properties();
		
		props.put("mail.smtp.host", "smtp.gmail.com");
		props.put("mail.smtp.auth", "true");
		props.put("mail.smtp.port", "465");
		props.put("mail.smtp.socketFactory.port", "465");
		props.put("mail.smtp.socketFactory.class","javax.net.ssl.SSLSocketFactory");
		
		
		Session session = Session.getInstance(props,
				new javax.mail.Authenticator() {
	                               
	                                
					protected PasswordAuthentication getPasswordAuthentication() {
	                                    
					return new PasswordAuthentication("basiccodedemo@gmail.com","P@55w0rd123");
	                                
					}
				});
		
		Message message = new MimeMessage(session);
		message.setFrom(new InternetAddress("basiccodedemo@gmail.com"));
		message.setRecipients(Message.RecipientType.TO,
				InternetAddress.parse(userEmail));
		message.setSubject(subject);
		message.setContent(emailBody, "text/html");

		Transport.send(message);
		
	}
	
}
