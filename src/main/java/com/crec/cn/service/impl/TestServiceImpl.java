package com.crec.cn.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crec.cn.dao.PersonMapper;
import com.crec.cn.dto.Person;
import com.crec.cn.service.TestService;

@Service
public class TestServiceImpl implements TestService {
 
	@Autowired
	private PersonMapper personMapper;
	
	public Person login(String name) {
		return personMapper.select(name);
	}

	public List<Person> findAll() {
		
		return personMapper.findAll();
	}

	public Person selectOne(int id) {
		return personMapper.selectOne(id);
	}
}
