
package com.crec.cn.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.crec.cn.dto.Permission;
import com.crec.cn.dto.Role;
import com.crec.cn.service.PermissionService;
import com.crec.cn.service.RolePermissionService;
import com.crec.cn.service.RoleService;

@Controller
@RequestMapping("config")
public class RoleController {
	@Autowired RoleService roleService;
	@Autowired RolePermissionService rolePermissionService;
	@Autowired PermissionService permissionService;
	
    @RequestMapping("listRole")
    public String list(Model model){
        List<Role> rs= roleService.list();
        for (Role role : rs) {
			List<Permission> ps = permissionService.list(role);
			String[] pNames=new String[ps.size()];
			for(int i=0;i<ps.size();i++) {
				pNames[i]=ps.get(i).getName();
			}
			role.setpNames(pNames);
		}
        model.addAttribute("rs", rs);
        return "listRole";
    }
    @RequestMapping("editRole")
    public String list(Model model,long id){
    	Role role =roleService.get(id);
    	model.addAttribute("role", role);
    	
    	List<Permission> ps = permissionService.list();
    	model.addAttribute("ps", ps);

    	List<Permission> currentPermissions = permissionService.list(role);
    	model.addAttribute("currentPermissions", currentPermissions);
    	
    	return "editRole";
    }
    @RequestMapping("updateRole")
    public String update(Role role,long[] permissionIds){
    	rolePermissionService.setPermissions(role, permissionIds);
    	roleService.update(role);
    	return "redirect:listRole";
    }

    @RequestMapping("addRole")
    public String list(Model model,Role role){
    	System.out.println(role.getName());
    	System.out.println(role.getDesc_());
        roleService.add(role);
    	return "redirect:listRole";
    }
    @RequestMapping("deleteRole")
    public String delete(Model model,long id){
    	roleService.delete(id);
    	return "redirect:listRole";
    }    

}
