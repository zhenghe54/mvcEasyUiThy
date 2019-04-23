package com.crec.cn.test;

import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

import com.crec.cn.service.TestService;

public class PersonTest {

	@Autowired
	private TestService ts;
//	@Before
//    public void setUp() throws Exception {
//		System.out.println(ts.selectOne(0).getUsername());
//    }

    @Test
    public void testAdd() {
       System.out.println(ts.findAll().size());

    }

}
