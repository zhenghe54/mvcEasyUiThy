package com.crec.cn.test;

import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.springframework.beans.factory.annotation.Autowired;

import com.crec.cn.dao.UserMapper;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class JdbcTest extends BaseTest {
	@Autowired
	private UserMapper useService;

	@Test
	public void testUser() {
		System.out.println(useService.selectByPrimaryKey((long) 1).getName());
	}

}
