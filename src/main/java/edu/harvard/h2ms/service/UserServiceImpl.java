package edu.harvard.h2ms.service;

import com.google.common.collect.Lists;
import edu.harvard.h2ms.domain.core.Event;
import edu.harvard.h2ms.repository.EventRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import edu.harvard.h2ms.domain.core.User;
import edu.harvard.h2ms.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import static java.lang.Boolean.TRUE;

/**
 * Contains the business logic and call methods in the repository layer
 * https://www.codebyamir.com/blog/create-rest-api-with-spring-boot
 */
@Service("userService")
@Repository
@Transactional
public class UserServiceImpl implements UserService {

	final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;

	private UserRepository userRepository;

	@Autowired
	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	private EventRepository eventRepository;

	@Autowired
	public void setEventRepository(EventRepository eventRepository) {
		this.eventRepository = eventRepository;
	}

	public List<User> getAllUsers() {
		List<User> users = new ArrayList<User>();
		userRepository.findAll().forEach(users::add);
		return users;
	}
	
	public User getUser(Long id) {
		return userRepository.findOne(id);
	}
	
	public User addUser(User user) {
		userRepository.save(user);
		return user;
	}
	
	public void deleteUser(Long id) {
		userRepository.delete(id);
	}
	

	@Override
	public void save(User user) {
		user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
//		user.setRoles(new HashSet<>(roleRepository.findAll()));
		userRepository.save(user);
	}

	@Override
	@Transactional(readOnly=true)
	public Map<String, Double> findAvgHandWashCompliance() {

		// Fetches all users from H2MS database
		List<User> users = Lists.newArrayList(userRepository.findAll());
		log.info("No. of users found: {}", users.size());

		// Determines all the distinct types of users
		List<String> distinctUserTypes = users.stream()
				.map(User::getType)
				.collect(Collectors.toList());
		log.info("There are {} distinct user types ", distinctUserTypes.size());

		// No user types found
		if(distinctUserTypes.isEmpty())
			return null;

		// Fetches all events from the H2MS database
		List<Event> events = Lists.newArrayList(eventRepository.findAll());
		log.info("No. of events found: {}", events.size());

		// No events found
		if(events.isEmpty())
			return null;

		Map<String, Double> dataMap = new HashMap<String, Double>();
		long totalPopulation;
		long washedPopulation;

		for (String type : distinctUserTypes) {
			if(type == null)
				continue;
			// Retrieves the total count of events per user type
			Stream<Event> eventStream = events.stream().filter(event -> event.getSubject().getType().equals(type));
			if (eventStream == null) {
				log.warn("There are no events from user type {}", type);
				continue;
			}
			totalPopulation = eventStream.count();

			// Retrieves the count of events where user type took opportunity to wash hands
			eventStream = events.stream().filter(event -> event.getSubject().getType().equals(type) &&
										         event.getSubject().isWashed()==TRUE);
			if(eventStream == null) {
				log.warn("No users of any user type {} took the opportunity to wash their hands.", type);
				continue;
			}
			washedPopulation = eventStream.count();

			if(Long.valueOf(washedPopulation)==null) {
				log.warn("No users of any user type {} took the opportunity to wash their hands.", type);
				continue;
			}

			// Calculates the percent of time user type took opportunity to hand wash
			Double result = Double.valueOf(washedPopulation)/Double.valueOf(totalPopulation);

			// Format for response
			NumberFormat nf= NumberFormat.getInstance();
			nf.setMaximumFractionDigits(2);
			nf.setMinimumFractionDigits(2);
			nf.setRoundingMode(RoundingMode.HALF_UP);

			dataMap.put(type, Double.valueOf(nf.format(result)));
		}

		return dataMap;
	}

}
