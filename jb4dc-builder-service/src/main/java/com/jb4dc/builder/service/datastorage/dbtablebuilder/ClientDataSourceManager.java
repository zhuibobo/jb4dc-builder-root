package com.jb4dc.builder.service.datastorage.dbtablebuilder;

import com.jb4dc.base.dbaccess.exenum.TrueFalseEnum;
import com.jb4dc.base.ymls.DBYaml;
import com.jb4dc.builder.dbentities.datastorage.DbLinkEntity;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCallback;
import org.springframework.jdbc.core.RowMapper;

import java.beans.PropertyVetoException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class ClientDataSourceManager {
    public static JdbcTemplate getJdbcTemplate(DbLinkEntity dbLinkEntity) throws PropertyVetoException {
        ComboPooledDataSource comboPooledDataSource=new ComboPooledDataSource();

        if(dbLinkEntity.getDbIsLocation().equals(TrueFalseEnum.True.getDisplayName())){
            dbLinkEntity.setDbDriverName(DBYaml.getDriverName());
            dbLinkEntity.setDbDatabaseName(DBYaml.getDatabaseName());
            dbLinkEntity.setDbUser(DBYaml.getUser());
            dbLinkEntity.setDbPassword(DBYaml.getPassword());
            dbLinkEntity.setDbUrl(DBYaml.getUrl());
        }

        comboPooledDataSource.setDriverClass(dbLinkEntity.getDbDriverName());
        comboPooledDataSource.setJdbcUrl(dbLinkEntity.getDbUrl());
        comboPooledDataSource.setUser(dbLinkEntity.getDbUser());
        comboPooledDataSource.setPassword(dbLinkEntity.getDbPassword());
        JdbcTemplate jdbcTemplate=new JdbcTemplate(comboPooledDataSource);
        return jdbcTemplate;
    }

    public static void execute(DbLinkEntity dbLinkEntity,String sql) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        jdbcTemplate.execute(sql);
    }

    public static void execute(DbLinkEntity dbLinkEntity, String sql, PreparedStatementCallback preparedStatementCallback) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        jdbcTemplate.execute(sql,preparedStatementCallback);
    }

    public static Map selectOne(DbLinkEntity dbLinkEntity,String sql) throws PropertyVetoException {
        JdbcTemplate jdbcTemplate=getJdbcTemplate(dbLinkEntity);
        //jdbcTemplate.
        List<Object> strLst=jdbcTemplate.query(sql, new RowMapper<Object>() {
            @Override
            public Object mapRow(ResultSet resultSet, int i) throws SQLException {
                return 1;
            }
        });
        if(strLst.isEmpty()){
            return null;
        }
        return jdbcTemplate.queryForMap(sql);
    }
}
