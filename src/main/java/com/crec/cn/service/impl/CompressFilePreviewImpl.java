package com.crec.cn.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;

import com.crec.cn.keking.model.FileAttribute;
import com.crec.cn.keking.model.ReturnResponse;
import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.DownloadUtils;
import com.crec.cn.utils.FileUtils;
import com.crec.cn.utils.ZipReader;

/**
 * Created by kl on 2018/1/17.
 * Content :处理压缩包文件
 */
@Service
public class CompressFilePreviewImpl implements FilePreview{

    DownloadUtils downloadUtils=new DownloadUtils();

    ZipReader zipReader=new ZipReader();

    @Override
    public String filePreviewHandle(String url, Model model) {
    	FileUtils fileUtils=new FileUtils();
        FileAttribute fileAttribute=fileUtils.getFileAttribute(url);
        String fileName=fileAttribute.getName();
        String decodedUrl=fileAttribute.getDecodedUrl();
        String suffix=fileAttribute.getSuffix();
        String fileTree = null;
        // 判断文件名是否存在(redis缓存读取)
        if (!StringUtils.hasText(fileUtils.getConvertedFile(fileName))) {
            ReturnResponse<String> response = downloadUtils.downLoad(decodedUrl, suffix, fileName);
            if (0 != response.getCode()) {
                model.addAttribute("msg", response.getMsg());
                return "fileNotSupported";
            }
            String filePath = response.getContent();
            if ("zip".equalsIgnoreCase(suffix) || "jar".equalsIgnoreCase(suffix) || "gzip".equalsIgnoreCase(suffix)) {
                fileTree = zipReader.readZipFile(filePath, fileName);
            } else if ("rar".equalsIgnoreCase(suffix)) {
                fileTree = zipReader.unRar(filePath, fileName);
            }
            fileUtils.addConvertedFile(fileName, fileTree);
        } else {
            fileTree = fileUtils.getConvertedFile(fileName);
        }
        if (null != fileTree) {
            model.addAttribute("fileTree", fileTree);
            return "compress";
        } else {
            model.addAttribute("msg", "压缩文件类型不受支持，尝试在压缩的时候选择RAR4格式");
            return "fileNotSupported";
        }
    }
}
