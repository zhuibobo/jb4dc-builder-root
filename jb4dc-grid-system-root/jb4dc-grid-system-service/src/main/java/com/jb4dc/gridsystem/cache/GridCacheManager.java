package com.jb4dc.gridsystem.cache;

import com.jb4dc.base.service.cache.JB4DCCacheManager;
import org.ehcache.CacheManager;

/**
 * Created with IntelliJ IDEA.
 * User: zhuangrb
 * Date: 2019/11/5
 * To change this template use File | Settings | File Templates.
 */
public class GridCacheManager extends JB4DCCacheManager {
    public static String GRID_APP_CLIENT_LOGIN_STORE_CACHE_MANAGER="GridAppClientLoginStoreCacheManager";

    public GridCacheManager(CacheManager _cacheManager) {
        super(_cacheManager);
    }
}
