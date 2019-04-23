package com.crec.cn.dao;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.crec.cn.dto.Person;

public interface PersonMapper {
	
	public Person select(@Param("username")String username);
	
	public Person selectOne(@Param("id")int id);
	
	public List<Person> findAll();
}
