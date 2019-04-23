package com.crec.cn.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.crec.cn.service.FilePreview;

/**
 * Created by kl on 2018/1/17.
 * Content :处理pdf文件
 */
@Service
public class PdfFilePreviewImpl implements FilePreview{

    @Override
    public String filePreviewHandle(String url, Model model) {
        model.addAttribute("pdfUrl", url);
        return "pdf";
    }
}
