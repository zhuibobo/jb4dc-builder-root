package com.jb4dc.qcsystem.webpackage.beanconfig.sys;

import org.apache.catalina.connector.Connector;
import org.apache.coyote.http11.Http11NioProtocol;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class HttpsHttpConfig {

    @Value("${jb4dc.sslConfig.key-alias}")
    private String keyAlias;

    @Value("${jb4dc.sslConfig.key-store}")
    private String keyStoreFile;

    @Value("${jb4dc.sslConfig.key-store-password}")
    private String keyPassword;

    @Value("${jb4dc.sslConfig.key-store-type}")
    private String keyStoreType;

    @Value("${jb4dc.sslConfig.port}")
    private int sslPort;

    @Value("${jb4dc.sslConfig.enabled}")
    private boolean sslEnabled;


    @Bean
    public ServletWebServerFactory serverFactory() {
        TomcatServletWebServerFactory tomcat = new TomcatServletWebServerFactory();
        if(sslEnabled) {
            tomcat.addAdditionalTomcatConnectors(createSslConnector());
        }
        return tomcat;
    }
    /**
     * 配置http
     * @return
     */
    private Connector createSslConnector() {
        Connector connector = new Connector("org.apache.coyote.http11.Http11NioProtocol");
        Http11NioProtocol protocol = (Http11NioProtocol) connector.getProtocolHandler();
        connector.setScheme("https");
        connector.setSecure(true);
        protocol.setSSLEnabled(true);

        connector.setPort(sslPort);
        protocol.setKeystoreFile(keyStoreFile);
        protocol.setKeystorePass(keyPassword);
        protocol.setKeyAlias(keyAlias);
        protocol.setKeystoreType(keyStoreType);
        return connector;
    }
}
