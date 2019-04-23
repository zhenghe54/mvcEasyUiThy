package com.crec.cn.utils;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.crec.cn.keking.model.FileAttribute;
import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.FileUtils;

/**
 * Created by kl on 2018/1/17.
 * Content :
 */
public class FilePreviewFactory {

    ApplicationContext context=new ClassPathXmlApplicationContext("classpath:spring-context.xml");

    public FilePreview get(String url) {
    	FileUtils fileUtils=new FileUtils();
        Map<String, FilePreview> filePreviewMap = context.getBeansOfType(FilePreview.class);
        FileAttribute fileAttribute = fileUtils.getFileAttribute(url);
        return filePreviewMap.get(fileAttribute.getType().getInstanceName());
    }
}
