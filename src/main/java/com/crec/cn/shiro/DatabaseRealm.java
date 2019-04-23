package com.crec.cn.shiro;

import java.util.Set;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;

import com.crec.cn.dto.User;
import com.crec.cn.service.PermissionService;
import com.crec.cn.service.RoleService;
import com.crec.cn.service.UserService;
 
public class DatabaseRealm extends AuthorizingRealm {
	 
	@Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private PermissionService permissionService;
     
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
        //�ܽ��뵽�����ʾ�˺��Ѿ�ͨ����֤��
        String userName =(String) principalCollection.getPrimaryPrincipal();
        //ͨ��service��ȡ��ɫ��Ȩ��
        Set<String> permissions = permissionService.listPermissions(userName);
        Set<String> roles = roleService.listRoleNames(userName);
         
        //��Ȩ����
        SimpleAuthorizationInfo s = new SimpleAuthorizationInfo();
        //��ͨ��service��ȡ���Ľ�ɫ��Ȩ�޷Ž�ȥ
        s.setStringPermissions(permissions);
        s.setRoles(roles);
        return s;
    }
 
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        //��ȡ�˺�����
        UsernamePasswordToken t = (UsernamePasswordToken) token;
        String userName= token.getPrincipal().toString();
        //��ȡ���ݿ��е�����
        User user =userService.getByName(userName);
        String passwordInDB = user.getPassword();
        String salt = user.getSalt();
        //��֤��Ϣ�����˺�����, getName() �ǵ�ǰRealm�ļ̳з���,ͨ�����ص�ǰ���� :databaseRealm
        //��Ҳ�Ž�ȥ
        //����ͨ��applicationContext-shiro.xml�����õ� HashedCredentialsMatcher �����Զ�У��
        SimpleAuthenticationInfo a = new SimpleAuthenticationInfo(userName,passwordInDB,ByteSource.Util.bytes(salt),getName());
        return a;
    }
}
