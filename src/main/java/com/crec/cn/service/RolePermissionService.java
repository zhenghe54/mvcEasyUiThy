package com.crec.cn.service;

import com.crec.cn.dto.Role;

public interface RolePermissionService {
    public void setPermissions(Role role, long[] permissionIds);
    public void deleteByRole(long roleId);
    public void deleteByPermission(long permissionId);
}
