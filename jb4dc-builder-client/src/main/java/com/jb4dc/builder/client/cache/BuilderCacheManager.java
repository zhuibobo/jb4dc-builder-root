package com.jb4dc.builder.client.cache;

import com.jb4dc.base.service.cache.JB4DCCacheManager;
import org.ehcache.CacheManager;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/8/5
 * To change this template use File | Settings | File Templates.
 */
public class BuilderCacheManager extends JB4DCCacheManager {
    public static String BUILDER_CACHE_NAME="JB4DCBuilder";

    public BuilderCacheManager(CacheManager _cacheManager) {
        super(_cacheManager);
    }
}
