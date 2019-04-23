package com.crec.cn.controller;

import java.util.List;

import org.apache.shiro.crypto.SecureRandomNumberGenerator;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.crec.cn.dto.Role;
import com.crec.cn.dto.User;
import com.crec.cn.service.RoleService;
import com.crec.cn.service.UserRoleService;
import com.crec.cn.service.UserService;
 
@Controller
@RequestMapping("/config")
public class UserController {
    @Autowired UserRoleService userRoleService;
    @Autowired UserService userService;
    @Autowired RoleService roleService;
     
    @RequestMapping("/listUser")
    public String list(Model model){
        List<User> us= userService.list();
        for (User user : us) {
            List<Role> roles=roleService.listRoles(user);

            for(Role r:roles) {
            	user.setrName(r.getName());
            }
        }
        model.addAttribute("us", us);
        return "listUser";
    }
    @RequestMapping("editUser")
    public String edit(Model model,long id){
        List<Role> rs = roleService.list();
        model.addAttribute("rs", rs);      
        User user =userService.get(id);
        model.addAttribute("user", user);
         
        List<Role> roles =roleService.listRoles(user);
        if(!roles.isEmpty()) {
        	model.addAttribute("currentRoles", roles);
        }else {
        	model.addAttribute("currentRoles", new Role());
        }
         
        return "editUser";
    }
    @RequestMapping("deleteUser")
    public String delete(Model model,long id){
        userService.delete(id);
        return "redirect:listUser";
    }
    @RequestMapping("updateUser")
    public String update(User user,long[] roleIds){
        userRoleService.setRoles(user,roleIds);
         
        String password=user.getPassword();
        //如果在修改的时候没有设置密码，就表示不改动密码
        if(user.getPassword().length()!=0) {
            String salt = new SecureRandomNumberGenerator().nextBytes().toString();
            int times = 2;
            String algorithmName = "md5";
            String encodedPassword = new SimpleHash(algorithmName,password,salt,times).toString();
            user.setSalt(salt);
            user.setPassword(encodedPassword);
        }
        else
            user.setPassword(null);
         
        userService.update(user);
 
        return "redirect:listUser";
 
    }
 
    @RequestMapping("addUser")
    public String add(Model model,String name, String password){
         
        String salt = new SecureRandomNumberGenerator().nextBytes().toString();
        int times = 2;
        String algorithmName = "md5";
          
        String encodedPassword = new SimpleHash(algorithmName,password,salt,times).toString();
         
        User u = new User();
        u.setName(name);
        u.setPassword(encodedPassword);
        u.setSalt(salt);
        userService.add(u);
         
        return "redirect:listUser";
    }
 
}