package com.crec.cn.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.crec.cn.dto.Person;
import com.crec.cn.service.TestService;

@Controller
@RequestMapping("/user")
public class MainController {
	
	@Autowired
	private TestService testService;
	
	@RequestMapping(value="/login")
	public String  login(@RequestParam(value="username", defaultValue = "ÕÅÈý")String username,
			@RequestParam(value="password", defaultValue = "123zxc")String password, 
			HttpServletRequest request)
	{
		System.out.println("======================================");
		System.out.println("username=" + username + "  password=" + password);
		
		Person person = testService.login(username);
		if (person == null)
		{
			System.out.println("not found");
		}
		
		System.out.println("password = " + person.getPassword());
		
		if (password.equals( person.getPassword()))
		{
			System.out.println("this user is exist");
			return "loginSuccess";
		}
		else
		{
			System.out.println("this user is not exist");
			return "loginFail"; 
		}
	}
}
