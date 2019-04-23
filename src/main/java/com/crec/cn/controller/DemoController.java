package com.crec.cn.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.crec.cn.dto.Person;
import com.crec.cn.service.TestService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Controller
@RequestMapping("/demo")
public class DemoController {
	@Autowired
	private TestService ts;
	@RequestMapping("/index")
    public String index(Model m){
		String htmlContent = "<p style='color:red'> 红色文字</p>";
		Person p=new Person(5,"我的demo", "123456",126);
		boolean b=false;
		List<Person>lp=new ArrayList<Person>();
		lp.add(new Person(1,"张三","123456",12));
		lp.add(new Person(2,"李四","54841a",22));
		lp.add(new Person(3,"王五","4a45s4das",32));
		lp.add(new Person(4,"赵六","123sdfa",42));
		lp.add(p);
		lp.add(new Person(6,"钱七","554asda",2));
		lp.add(new Person(7,"尤八","456789",62));
		lp.add(new Person(8,"鹫就","789456",23));
		lp.add(new Person(9,"十全","471825",41));
		Date now=new Date();
		m.addAttribute("name", "thymeleaf");
		m.addAttribute("htmlContent", htmlContent);
		m.addAttribute("person", p);
		m.addAttribute("bool", b);
		m.addAttribute("listPerson", lp);
		m.addAttribute("now", now);
        return "demo";
    }
	
	@RequestMapping("/page")
	 public String listPerson(Model m,@RequestParam(value = "start", defaultValue = "0") int start,@RequestParam(value = "size", defaultValue = "5") int size) throws Exception {
        PageHelper.startPage(start,size);
        List<Person> cs=ts.findAll();
        PageInfo<Person> page = new PageInfo<>(cs);
        m.addAttribute("page", page);       
        return "listPerson";
    }
      
}
