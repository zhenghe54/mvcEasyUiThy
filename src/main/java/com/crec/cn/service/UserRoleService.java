package com.crec.cn.service;

import com.crec.cn.dto.User;

public interface UserRoleService {
	public void setRoles(User user, long[] roleIds);
    public void deleteByUser(long userId);
    public void deleteByRole(long roleId);
}
