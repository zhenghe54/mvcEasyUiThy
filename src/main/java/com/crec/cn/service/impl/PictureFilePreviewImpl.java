package com.crec.cn.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.web.context.request.RequestContextHolder;

import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.FileUtils;
import com.google.common.collect.Lists;

/**
 * Created by kl on 2018/1/17.
 * Content :图片文件处理
 */
@Service
public class PictureFilePreviewImpl implements FilePreview {

    @Override
    public String filePreviewHandle(String url, Model model) {
    	FileUtils fileUtils=new FileUtils();
        String fileKey=(String) RequestContextHolder.currentRequestAttributes().getAttribute("fileKey",0);
        List imgUrls = Lists.newArrayList(url);
        try{
            imgUrls.clear();
            imgUrls.addAll(fileUtils.getRedisImgUrls(fileKey));
        }catch (Exception e){
            imgUrls = Lists.newArrayList(url);
        }
        model.addAttribute("imgurls", imgUrls);
        model.addAttribute("currentUrl",url);
        return "picture";
    }
}
