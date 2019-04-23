package com.crec.cn.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.crec.cn.dto.Message;
import com.crec.cn.keking.config.ConfigConstants;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;

/**
 *
 * @author yudian-it
 * @date 2017/12/1
 */
@Controller
public class FileController {
    String fileDir = "D:\\info\\mvcEasyUIThy\\src\\main\\";
    String demoDir = "demo";
    String demoPath = demoDir + File.separator;

    @RequestMapping(value = "fileUpload", method = RequestMethod.POST)
    @ResponseBody
    public Message fileUpload(@RequestParam("file") MultipartFile file,
                             HttpServletRequest request) throws JsonProcessingException {
    	Message message=new Message();
        String fileName = file.getOriginalFilename();
        // 判断该文件类型是否有上传过，如果上传过则提示不允许再次上传
        if (existsTypeFile(fileName)) {
        	message.setStatus(1);
        	message.setMeg( "每一种类型只可以上传一个文件，请先删除原有文件再次上传");
           return message;
        }
        File outFile = new File(fileDir + demoPath);
        if (!outFile.exists()) {
            outFile.mkdirs();
        }
        
        try(InputStream in = file.getInputStream();
            OutputStream ot = new FileOutputStream(fileDir + demoPath + fileName)){
            byte[] buffer = new byte[1024];
            int len;
            while ((-1 != (len = in.read(buffer)))) {
                ot.write(buffer, 0, len);
            }
            message.setStatus(0);
            message.setMeg("上传成功");
            message.setDes("上传文件地址:"+fileDir + demoPath + fileName);
            return message;
        } catch (IOException e) {
            e.printStackTrace();
            message.setStatus(1);
            message.setMeg("上传失败");
            return message;
        }
    }

    @RequestMapping(value = "deleteFile", method = RequestMethod.GET)
    @ResponseBody
    public Message deleteFile(String fileName) throws JsonProcessingException {
        if (fileName.contains("/")) {
            fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
        }
        File file = new File(fileDir + demoPath + fileName);
        if (file.exists()) {
            file.delete();
        }
        Message message=new Message();
        message.setStatus(0);
        message.setMeg("SUCCESS");
        message.setDes("删除成功");
        return message;
    }

    @RequestMapping(value = "listFiles", method = RequestMethod.GET)
    @ResponseBody
    public List<Map<String, String>> getFiles() throws JsonProcessingException {
        List<Map<String, String>> list = Lists.newArrayList();
        File file = new File(fileDir + demoPath);
        if (file.exists()) {
            Arrays.stream(file.listFiles()).forEach(file1 -> list.add(ImmutableMap.of("fileName", demoDir + "/" + file1.getName())));
        }
        return list;
    }

    private String getFileName(String name) {
        String suffix = name.substring(name.lastIndexOf("."));
        String nameNoSuffix = name.substring(0, name.lastIndexOf("."));
        String uuid = UUID.randomUUID().toString();
        return uuid + "-" + nameNoSuffix + suffix;
    }

    /**
     * 是否存在该类型的文件
     * @return
     * @param fileName
     */
    private boolean existsTypeFile(String fileName) {
        boolean result = false;
        String suffix = fileName.substring(fileName.lastIndexOf("."));
        File file = new File(fileDir + demoPath);
        if (file.exists()) {
            for(File file1 : file.listFiles()){
                String existsFileSuffix =file1.getName().substring(file1.getName().lastIndexOf("."));
                if (suffix.equals(existsFileSuffix)) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    }
}
