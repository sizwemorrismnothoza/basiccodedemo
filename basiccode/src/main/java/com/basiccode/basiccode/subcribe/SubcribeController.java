package com.basiccode.basiccode.subcribe;

import java.util.ArrayList;
import java.util.List;

import javax.mail.MessagingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SubcribeController {
	
	@Autowired
	private SubcribeService subscribeService;
	@Autowired
	private EmailService emailService;
	
	
	//send email to one user
	@RequestMapping("/sendmessage")
	public String sendEmail() throws MessagingException{
		
		String userEmail = "sizwemorrismnothoza50@gmail.com";
		
		String messageBody = "<h2>Basic Code weekly</h2>\n\n Let's get into it:"
				+ "<a href = \"www.basiccode.co.za \">Design Concepts</a>";
			
		
		emailService.sendEmail("Basic Code Weekly ",messageBody,userEmail);
		
		return userEmail ;
	}
	
	//sending email to all subscribers
	@RequestMapping("/sendmessages")
	public List<User> sendEmailToAll() throws MessagingException{
		
		List<User> subscriptions = new ArrayList<User>();
		
		subscriptions = getSubciptions();
		
		String messageBody = "<h2>Basic Code weekly</h2>\n\n Let's get into it:"
				+ "<a href = \"www.basiccode.co.za \">Design Concepts</a>";
		
		for( int i =0; i<subscriptions.size(); i++) {
			System.out.println(subscriptions.get(i).getEmail());
			emailService.sendEmail("Basic Code Weekly",messageBody ,subscriptions.get(i).getEmail());
		}
		
		return subscriptions;
		
	}
	
	@RequestMapping("/subscribe")
	public List<User> getSubciptions(){
		
		List<User> subscriptions = new ArrayList<User>();
		
		subscriptions = subscribeService.getAllSubsciptions();
		
		return subscriptions;
	}

	//subscribe users
	@PostMapping("/subscribe")
	public User subscribe(@RequestBody User user) {
		
		// get user in db and compare with given user;
		if(subscribeService.exists(user)) {
			//user exists user so do not add to the data base
			return null;
		}else {
			//user doesnt exists
			//subscribe user and return user as response
			user.setActive(true);
			System.out.println(user);
			User dbUeser = subscribeService.subscribeUser(user);
			return dbUeser;
		}
	} 
	
	//un-subscribe users
	public void unSubscribe() {
		
	}
	
	
}
