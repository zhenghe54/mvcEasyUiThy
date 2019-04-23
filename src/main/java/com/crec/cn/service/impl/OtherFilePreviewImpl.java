package com.crec.cn.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.crec.cn.keking.model.FileAttribute;
import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.FileUtils;

/**
 * Created by kl on 2018/1/17.
 * Content :其他文件
 */
@Service
public class OtherFilePreviewImpl implements FilePreview {

    @Override
    public String filePreviewHandle(String url, Model model) {
    	FileUtils fileUtils=new FileUtils();
        FileAttribute fileAttribute=fileUtils.getFileAttribute(url);

        model.addAttribute("fileType",fileAttribute.getSuffix());
        model.addAttribute("msg", "系统还不支持该格式文件的在线预览，" +
                "如有需要请按下方显示的邮箱地址联系系统维护人员");
        return "fileNotSupported";
    }
}
