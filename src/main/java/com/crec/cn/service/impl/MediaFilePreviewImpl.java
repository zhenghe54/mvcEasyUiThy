package com.crec.cn.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.crec.cn.service.FilePreview;
/**
 * @author : kl
 * @authorboke : kailing.pub
 * @create : 2018-03-25 上午11:58
 * @description:
 **/
@Service
public class MediaFilePreviewImpl implements FilePreview {

    @Override
    public String filePreviewHandle(String url, Model model) {
        model.addAttribute("mediaUrl", url);
        return "media";
    }


}
