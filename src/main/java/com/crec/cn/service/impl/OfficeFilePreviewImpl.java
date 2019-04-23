package com.crec.cn.service.impl;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;

import com.crec.cn.keking.config.ConfigConstants;
import com.crec.cn.keking.model.FileAttribute;
import com.crec.cn.keking.model.ReturnResponse;
import com.crec.cn.service.FilePreview;
import com.crec.cn.utils.DownloadUtils;
import com.crec.cn.utils.FileUtils;
import com.crec.cn.utils.OfficeToPdf;

/**
 * Created by kl on 2018/1/17.
 * Content :处理office文件
 */
@Service
public class OfficeFilePreviewImpl implements FilePreview {

    

    String fileDir = ConfigConstants.getFileDir();

    DownloadUtils downloadUtils=new DownloadUtils();

    @Override
    public String filePreviewHandle(String url, Model model) {
        FileUtils fileUtils=new FileUtils();
        OfficeToPdf officeToPdf=new OfficeToPdf();
        FileAttribute fileAttribute=fileUtils.getFileAttribute(url);
        String suffix=fileAttribute.getSuffix();
        String fileName=fileAttribute.getName();
        String decodedUrl=fileAttribute.getDecodedUrl();
        boolean isHtml = suffix.equalsIgnoreCase("xls") || suffix.equalsIgnoreCase("xlsx");
        String pdfName = fileName.substring(0, fileName.lastIndexOf(".") + 1) + (isHtml ? "html" : "pdf");
        // 判断之前是否已转换过，如果转换过，直接返回，否则执行转换
        if (!fileUtils.listConvertedFiles().containsKey(pdfName)) {
            String filePath = fileDir + fileName;
            if (!new File(filePath).exists()) {
                ReturnResponse<String> response = downloadUtils.downLoad(decodedUrl, suffix, null);
                if (0 != response.getCode()) {
                    model.addAttribute("msg", response.getMsg());
                    return "fileNotSupported";
                }
                filePath = response.getContent();
            }
            String outFilePath = fileDir + pdfName;
            if (StringUtils.hasText(outFilePath)) {
                officeToPdf.openOfficeToPDF(filePath, outFilePath);
                File f = new File(filePath);
                if (f.exists()) {
                    f.delete();
                }
                if (isHtml) {
                    // 对转换后的文件进行操作(改变编码方式)
                    fileUtils.doActionConvertedFile(outFilePath);
                }
                // 加入缓存
                fileUtils.addConvertedFile(pdfName, fileUtils.getRelativePath(outFilePath));
            }
        }
        model.addAttribute("pdfUrl", pdfName);
        return isHtml ? "html" : "pdf";
    }
}
