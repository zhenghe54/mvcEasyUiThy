
package com.crec.cn.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crec.cn.dao.UserRoleMapper;
import com.crec.cn.dto.User;
import com.crec.cn.dto.UserRole;
import com.crec.cn.dto.UserRoleExample;
import com.crec.cn.service.UserRoleService;

@Service
public class UserRoleServiceImpl implements UserRoleService{

	@Autowired UserRoleMapper userRoleMapper;
	@Override
	public void setRoles(User user, long[] roleIds) {
		//删除当前用户所有的角色
		UserRoleExample example= new UserRoleExample();
		example.createCriteria().andUidEqualTo(user.getId());
		List<UserRole> urs= userRoleMapper.selectByExample(example);
		for (UserRole userRole : urs) 
			userRoleMapper.deleteByPrimaryKey(userRole.getId());

		//设置新的角色关系
		if(null!=roleIds)
			for (long rid : roleIds) {
				UserRole userRole = new UserRole();
				userRole.setRid(rid);
				userRole.setUid(user.getId());
				userRoleMapper.insert(userRole);
			}
	}
	@Override
	public void deleteByUser(long userId) {
		UserRoleExample example= new UserRoleExample();
		example.createCriteria().andUidEqualTo(userId);
		List<UserRole> urs= userRoleMapper.selectByExample(example);
		for (UserRole userRole : urs) {
			userRoleMapper.deleteByPrimaryKey(userRole.getId());
		}
	}
	@Override	
	public void deleteByRole(long roleId) {
		UserRoleExample example= new UserRoleExample();
		example.createCriteria().andRidEqualTo(roleId);
		List<UserRole> urs= userRoleMapper.selectByExample(example);
		for (UserRole userRole : urs) {
			userRoleMapper.deleteByPrimaryKey(userRole.getId());
		}
	}

}
