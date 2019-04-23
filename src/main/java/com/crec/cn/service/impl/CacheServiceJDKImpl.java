package com.crec.cn.service.impl;

import com.crec.cn.service.CacheService;
import com.googlecode.concurrentlinkedhashmap.ConcurrentLinkedHashMap;
import com.googlecode.concurrentlinkedhashmap.Weighers;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/**
 * @auther: chenjh
 * @time: 2019/4/2 17:21
 * @description
 */
@Service
public class CacheServiceJDKImpl implements CacheService {

    private Map<String, String> pdfCache;

    private Map<String, List<String>> imgCache;

    private static final int QUEUE_SIZE = 500000;

    private BlockingQueue blockingQueue = new ArrayBlockingQueue(QUEUE_SIZE);

    @Override
    public void initPDFCachePool(Integer capacity) {
        pdfCache = new ConcurrentLinkedHashMap.Builder<String, String>()
                .maximumWeightedCapacity(capacity).weigher(Weighers.singleton())
                .build();
    }

    @Override
    public void initIMGCachePool(Integer capacity) {
        imgCache = new ConcurrentLinkedHashMap.Builder<String, List<String>>()
                .maximumWeightedCapacity(capacity).weigher(Weighers.singleton())
                .build();
    }

    @Override
    public void putPDFCache(String key, String value) {
        if (pdfCache == null) {
            initPDFCachePool(CacheService.DEFAULT_PDF_CAPACITY);
        }
        pdfCache.put(key, value);
    }

    @Override
    public void putImgCache(String key, List<String> value) {
        if (imgCache == null) {
            initIMGCachePool(CacheService.DEFAULT_IMG_CAPACITY);
        }
        imgCache.put(key, value);
    }

    @Override
    public Map<String, String> getPDFCache() {
        if (pdfCache == null) {
            initPDFCachePool(CacheService.DEFAULT_PDF_CAPACITY);
        }
        return pdfCache;
    }

    @Override
    public String getPDFCache(String key) {
        if (pdfCache == null) {
            initPDFCachePool(CacheService.DEFAULT_PDF_CAPACITY);
        }
        return pdfCache.get(key);
    }

    @Override
    public Map<String, List<String>> getImgCache() {
        if (imgCache == null) {
            initPDFCachePool(CacheService.DEFAULT_IMG_CAPACITY);
        }
        return imgCache;
    }

    @Override
    public List<String> getImgCache(String key) {
        if (imgCache == null) {
            initPDFCachePool(CacheService.DEFAULT_IMG_CAPACITY);
        }
        return imgCache.get(key);
    }

    @Override
    public void addQueueTask(String url) {
        blockingQueue.add(url);
    }

    @Override
    public String takeQueueTask() throws InterruptedException {
        return String.valueOf(blockingQueue.take());
    }
}
