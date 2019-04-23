package com.crec.cn.service;

import java.util.List;

import com.crec.cn.dto.Person;

public interface  TestService {
	public Person login(String name);
	public Person selectOne(int id);
	public List<Person>findAll();
}
