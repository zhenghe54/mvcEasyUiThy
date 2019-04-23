package com.crec.cn.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.crec.cn.keking.model.FileAttribute;
import com.crec.cn.keking.model.ReturnResponse;
import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.FileUtils;
import com.crec.cn.utils.SimTextUtil;

/**
 * Created by kl on 2018/1/17.
 * Content :处理文本文件
 */
@Service
public class SimTextFilePreviewImpl implements FilePreview{

    @Override
    public String filePreviewHandle(String url, Model model){
    	SimTextUtil simTextUtil=new SimTextUtil();
    	FileUtils fileUtils=new FileUtils();
        FileAttribute fileAttribute=fileUtils.getFileAttribute(url);
        String decodedUrl=fileAttribute.getDecodedUrl();
        String fileName=fileAttribute.getName();
        ReturnResponse<String> response = simTextUtil.readSimText(decodedUrl, fileName);
        if (0 != response.getCode()) {
            model.addAttribute("msg", response.getMsg());
            model.addAttribute("fileType",fileAttribute.getSuffix());
            return "fileNotSupported";
        }
        model.addAttribute("ordinaryUrl", response.getMsg());
        return "txt";
    }

}
