package com.crec.cn.utils;

import com.crec.cn.keking.config.ConfigConstants;
import com.crec.cn.keking.model.ReturnResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *  读取类文本文件
 * @author yudian-it
 * @date 2017/12/13
 */
public class SimTextUtil {
    String fileDir = ConfigConstants.getFileDir();

    public ReturnResponse<String> readSimText(String url, String fileName){
    	DownloadUtils downloadUtils=new DownloadUtils();
        ReturnResponse<String> response = downloadUtils.downLoad(url, "txt", fileName);
        return response;
    }
}
