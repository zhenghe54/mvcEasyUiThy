
package com.crec.cn.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.crec.cn.dao.RolePermissionMapper;
import com.crec.cn.dto.Role;
import com.crec.cn.dto.RolePermission;
import com.crec.cn.dto.RolePermissionExample;
import com.crec.cn.service.RolePermissionService;

@Service
public class RolePermissionServiceImpl implements RolePermissionService{

	@Autowired RolePermissionMapper rolePermissionMapper;

	@Override
	public void setPermissions(Role role, long[] permissionIds) {
		//ɾ����ǰ��ɫ���е�Ȩ��
		RolePermissionExample example= new RolePermissionExample();
		example.createCriteria().andRidEqualTo(role.getId());
		List<RolePermission> rps= rolePermissionMapper.selectByExample(example);
		for (RolePermission rolePermission : rps) 
			rolePermissionMapper.deleteByPrimaryKey(rolePermission.getId());

		//�����µ�Ȩ�޹�ϵ
		if(null!=permissionIds)
			for (long pid : permissionIds) {
				RolePermission rolePermission = new RolePermission();
				rolePermission.setPid(pid);
				rolePermission.setRid(role.getId());
				rolePermissionMapper.insert(rolePermission);
			}
	}

	@Override
	public void deleteByRole(long roleId) {
		RolePermissionExample example= new RolePermissionExample();
		example.createCriteria().andRidEqualTo(roleId);
		List<RolePermission> rps= rolePermissionMapper.selectByExample(example);
		for (RolePermission rolePermission : rps) 
			rolePermissionMapper.deleteByPrimaryKey(rolePermission.getId());
	}

	@Override
	public void deleteByPermission(long permissionId) {
		RolePermissionExample example= new RolePermissionExample();
		example.createCriteria().andPidEqualTo(permissionId);
		List<RolePermission> rps= rolePermissionMapper.selectByExample(example);
		for (RolePermission rolePermission : rps) 
			rolePermissionMapper.deleteByPrimaryKey(rolePermission.getId());
	}

}
