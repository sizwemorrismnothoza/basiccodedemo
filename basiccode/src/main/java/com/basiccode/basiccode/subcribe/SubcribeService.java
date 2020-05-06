package com.basiccode.basiccode.subcribe;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubcribeService {
	
	@Autowired
	private SubscribeRepository subscribeRepository;
	
	public User subscribeUser(User user) {
		return subscribeRepository.save(user);
	}
	
	public List<User> getAllSubsciptions(){
		
		Iterable<User> dbUser = subscribeRepository.findAll();
		
		List<User> users = new ArrayList<User>();
		
		dbUser.forEach(users :: add);
		
		return users;
		
	}
	
	public boolean exists(User user) {
		boolean exists = false;
		exists = subscribeRepository.existsById(user.getEmail());
		return exists;
	}

}
