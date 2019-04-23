package com.crec.cn.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.authz.annotation.RequiresRoles;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("")
public class PageController {
   
  @RequestMapping("index")
  public String index(Model model,HttpServletRequest request){
	  HttpSession session=request.getSession();
	  model.addAttribute("subject",session.getAttribute("subject"));
	  if(session.getAttribute("subject")==null) {
		  return "login";
	  }
      return "index";
  }
   
  @RequiresPermissions("deleteOrder")
  @RequestMapping("deleteOrder")
  public String deleteOrder(){
      return "deleteOrder";
  }
  @RequiresRoles("admin")
  @RequestMapping("deleteProduct")
  public String deleteProduct(){
      return "deleteProduct";
  }
  @RequestMapping("listProduct")
  public String listProduct(){
      return "listProduct";
  }
   
  @RequestMapping(value="/login",method=RequestMethod.GET) 
  public String login(){
      return "login";
  }
  @RequestMapping("unauthorized")
  public String noPerms(){
      return "unauthorized";
  }

}
