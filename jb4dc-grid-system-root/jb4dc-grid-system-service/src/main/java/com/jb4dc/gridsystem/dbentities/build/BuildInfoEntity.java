package com.jb4dc.gridsystem.dbentities.build;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jb4dc.base.dbaccess.anno.DBKeyField;
import java.util.Date;

/**
 *
 * This class was generated JBuild4DC.
 * This class corresponds to the database table :tgrid_build_info
 *
 * JBuild4DC do_not_delete_during_merge
 */
public class BuildInfoEntity {
    //BUILD_ID:
    @DBKeyField
    private String buildId;


    //BUILD_CATEGORY:建筑物分类:一般建筑物,特殊建筑物
    private String buildCategory;

    //BUILD_FILE_CODE:档案代码
    private String buildFileCode;

    //BUILD_CITY_ID:城市Id
    private String buildCityId;

    //BUILD_AREA_ID:区Id
    private String buildAreaId;

    //BUILD_STREET_ID:街道Id:街道,乡镇
    private String buildStreetId;

    //BUILD_COMMUNITY_ID:社区Id:社区,村
    private String buildCommunityId;

    //BUILD_GRID_ID:所属网格Id
    private String buildGridId;

    //BUILD_MAP_LOCATION:建筑物的地理坐标
    private String buildMapLocation;

    //BUILD_CODE:建筑物编码:441325 -______-____-____
    private String buildCode;

    //BUILD_TYPE:建筑物类型:楼房,平房,别墅
    private String buildType;

    //BUILD_STATUS:建筑状态:已竣工,在建,停建
    private String buildStatus;

    //BUILD_COVERED_AREA:总建筑面积*（M²）
    private Short buildCoveredArea;

    //BUILD_FLOOR_GROUND:总楼层-地面
    private Short buildFloorGround;

    //BUILD_FLOOR_UNDERGROUND:总楼层-地下
    private Short buildFloorUnderground;

    //BUILD_ADDRESS:门牌地址
    private String buildAddress;

    //BUILD_ADDRESS_TITLE_CER:产权证地址
    private String buildAddressTitleCer;

    //BUILD_NAME:建筑物名称
    private String buildName;

    //BUILD_FUNCTION_CATEGORY:建筑物功能分类
    private String buildFunctionCategory;

    //BUILD_PROPERTY:建筑物性质:非自建,单位自建,集体自建,个人自建
    private String buildProperty;

    //BUILD_IS_ENTRANCE_GUARD:门禁:是,否
    private String buildIsEntranceGuard;

    //BUILD_IS_VIDEO_MONITORING:视频监控:是,否
    private String buildIsVideoMonitoring;

    //BUILD_MANAGEMENT:物业管理单位
    private String buildManagement;

    //BUILD_CONTACT:联系人
    private String buildContact;

    //BUILD_CONTACT_PHONE:联系电话
    private String buildContactPhone;

    //BUILD_STRUCTURE:结构:框架结构,砖混结构,框筒结构,框剪结构,简易结构,钢结构,钢混结构,砖木结构,其它,不详
    private String buildStructure;

    //BUILD_DESIGN_FOR:设计用途:综合,住宅,商住,商业,厂房,仓库,办公,公共设施,其它,不详。[与特殊建筑物共用]
    private String buildDesignFor;

    //BUILD_FLOOR_DES:楼房建筑类型:超高层楼宇（100米或34层以上）,高层楼宇（19-33层或100米以下）,中高层楼宇（12-18层）,小高层楼宇（7-11层）,多层建筑（6层以下）
    private String buildFloorDes;

    //BUILD_PARKING_NUM:车位数
    private Integer buildParkingNum;

    //BUILD_IS_ELEVATOR:电梯:是,否
    private String buildIsElevator;

    //BUILD_CHECK_IS_GRID:综管所核查情况-所属网格是否正确:是,否
    private String buildCheckIsGrid;

    //BUILD_CHECK_IS_CODE:综管所核查情况-编码类型是否正确:是,否
    private String buildCheckIsCode;

    //BUILD_CHECK_IS_ADDRESS:综管所核查情况-地址填写是否正确:是,否
    private String buildCheckIsAddress;

    //BUILD_CHECK_IS_MAP:综管所核查情况-地图位置标注是否正确:是,否
    private String buildCheckIsMap;

    //BUILD_CHECK_IS_GROUP_CODE:综管所核查情况-是否符合编码划分规则:是,否
    private String buildCheckIsGroupCode;

    //BUILD_CHECK_IS_FLOOR_NUM:综管所核查情况-总楼层是否正确:是,否
    private String buildCheckIsFloorNum;

    //BUILD_CHECK_IS_USER:综管所核查情况-核查人
    private String buildCheckIsUser;

    //BUILD_CHECK_IS_DATE:综管所核查情况-核查日期
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date buildCheckIsDate;

    //BUILD_INPUT_UNIT_NAME:填报单位
    private String buildInputUnitName;

    //BUILD_INPUT_UNIT_ID:填报单位
    private String buildInputUnitId;

    //BUILD_INPUT_DATE:登记时间
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date buildInputDate;

    //BUILD_INPUT_USER_NAME:登记人
    private String buildInputUserName;

    //BUILD_INPUT_USER_ID:登记人ID
    private String buildInputUserId;

    //BUILD_REMARK:备注
    private String buildRemark;

    //BUILD_SP_ADDRESS:特殊类建筑物-详细地址
    private String buildSpAddress;

    //BUILD_SP_OWNER_NAME:特殊类建筑物-建筑物业主
    private String buildSpOwnerName;

    //BUILD_SP_OWNER_ADDRESS:特殊类建筑物-建筑物业主-联系地址
    private String buildSpOwnerAddress;

    //BUILD_SP_OWNER_PHONE:特殊类建筑物-建筑物业主-联系电话
    private String buildSpOwnerPhone;

    //BUILD_SP_TYPE:特殊类建筑物-建筑物类型:铁皮房,工棚,窝棚,看守棚,集装箱、大型装箱,危房,其它
    private String buildSpType;

    //BUILD_CHILD_COUNT:子节点数量
    private Integer buildChildCount;

    //BUILD_IS_VIRTUAL:是否虚拟
    private String buildIsVirtual;

    //BUILD_ORDER_NUM:排序号
    private Integer buildOrderNum;

    //BUILD_PARENT_ID:父节点ID
    private String buildParentId;

    //BUILD_PARENT_ID_LIST:父节点列表
    private String buildParentIdList;

    //BUILD_RECORD_STATUS:状态
    private String buildRecordStatus;

    /**
     * 构造函数
     * @param buildId
     * @param buildCategory 建筑物分类
     * @param buildFileCode 档案代码
     * @param buildCityId 城市Id
     * @param buildAreaId 区Id
     * @param buildStreetId 街道Id
     * @param buildCommunityId 社区Id
     * @param buildGridId 所属网格Id
     * @param buildMapLocation 建筑物的地理坐标
     * @param buildCode 建筑物编码
     * @param buildType 建筑物类型
     * @param buildStatus 建筑状态
     * @param buildCoveredArea 总建筑面积*（M²）
     * @param buildFloorGround 总楼层-地面
     * @param buildFloorUnderground 总楼层-地下
     * @param buildAddress 门牌地址
     * @param buildAddressTitleCer 产权证地址
     * @param buildName 建筑物名称
     * @param buildFunctionCategory 建筑物功能分类
     * @param buildProperty 建筑物性质
     * @param buildIsEntranceGuard 门禁
     * @param buildIsVideoMonitoring 视频监控
     * @param buildManagement 物业管理单位
     * @param buildContact 联系人
     * @param buildContactPhone 联系电话
     * @param buildStructure 结构
     * @param buildDesignFor 设计用途
     * @param buildFloorDes 楼房建筑类型
     * @param buildParkingNum 车位数
     * @param buildIsElevator 电梯
     * @param buildCheckIsGrid 综管所核查情况-所属网格是否正确
     * @param buildCheckIsCode 综管所核查情况-编码类型是否正确
     * @param buildCheckIsAddress 综管所核查情况-地址填写是否正确
     * @param buildCheckIsMap 综管所核查情况-地图位置标注是否正确
     * @param buildCheckIsGroupCode 综管所核查情况-是否符合编码划分规则
     * @param buildCheckIsFloorNum 综管所核查情况-总楼层是否正确
     * @param buildCheckIsUser 综管所核查情况-核查人
     * @param buildCheckIsDate 综管所核查情况-核查日期
     * @param buildInputUnitName 填报单位
     * @param buildInputUnitId 填报单位
     * @param buildInputDate 登记时间
     * @param buildInputUserName 登记人
     * @param buildInputUserId 登记人ID
     * @param buildRemark 备注
     * @param buildSpAddress 特殊类建筑物-详细地址
     * @param buildSpOwnerName 特殊类建筑物-建筑物业主
     * @param buildSpOwnerAddress 特殊类建筑物-建筑物业主-联系地址
     * @param buildSpOwnerPhone 特殊类建筑物-建筑物业主-联系电话
     * @param buildSpType 特殊类建筑物-建筑物类型
     * @param buildChildCount 子节点数量
     * @param buildIsVirtual 是否虚拟
     * @param buildOrderNum 排序号
     * @param buildParentId 父节点ID
     * @param buildParentIdList 父节点列表
     * @param buildRecordStatus 状态
     **/
    public BuildInfoEntity(String buildId, String buildCategory, String buildFileCode, String buildCityId, String buildAreaId, String buildStreetId, String buildCommunityId, String buildGridId, String buildMapLocation, String buildCode, String buildType, String buildStatus, Short buildCoveredArea, Short buildFloorGround, Short buildFloorUnderground, String buildAddress, String buildAddressTitleCer, String buildName, String buildFunctionCategory, String buildProperty, String buildIsEntranceGuard, String buildIsVideoMonitoring, String buildManagement, String buildContact, String buildContactPhone, String buildStructure, String buildDesignFor, String buildFloorDes, Integer buildParkingNum, String buildIsElevator, String buildCheckIsGrid, String buildCheckIsCode, String buildCheckIsAddress, String buildCheckIsMap, String buildCheckIsGroupCode, String buildCheckIsFloorNum, String buildCheckIsUser, Date buildCheckIsDate, String buildInputUnitName, String buildInputUnitId, Date buildInputDate, String buildInputUserName, String buildInputUserId, String buildRemark, String buildSpAddress, String buildSpOwnerName, String buildSpOwnerAddress, String buildSpOwnerPhone, String buildSpType, Integer buildChildCount, String buildIsVirtual, Integer buildOrderNum, String buildParentId, String buildParentIdList, String buildRecordStatus) {
        this.buildId = buildId;
        this.buildCategory = buildCategory;
        this.buildFileCode = buildFileCode;
        this.buildCityId = buildCityId;
        this.buildAreaId = buildAreaId;
        this.buildStreetId = buildStreetId;
        this.buildCommunityId = buildCommunityId;
        this.buildGridId = buildGridId;
        this.buildMapLocation = buildMapLocation;
        this.buildCode = buildCode;
        this.buildType = buildType;
        this.buildStatus = buildStatus;
        this.buildCoveredArea = buildCoveredArea;
        this.buildFloorGround = buildFloorGround;
        this.buildFloorUnderground = buildFloorUnderground;
        this.buildAddress = buildAddress;
        this.buildAddressTitleCer = buildAddressTitleCer;
        this.buildName = buildName;
        this.buildFunctionCategory = buildFunctionCategory;
        this.buildProperty = buildProperty;
        this.buildIsEntranceGuard = buildIsEntranceGuard;
        this.buildIsVideoMonitoring = buildIsVideoMonitoring;
        this.buildManagement = buildManagement;
        this.buildContact = buildContact;
        this.buildContactPhone = buildContactPhone;
        this.buildStructure = buildStructure;
        this.buildDesignFor = buildDesignFor;
        this.buildFloorDes = buildFloorDes;
        this.buildParkingNum = buildParkingNum;
        this.buildIsElevator = buildIsElevator;
        this.buildCheckIsGrid = buildCheckIsGrid;
        this.buildCheckIsCode = buildCheckIsCode;
        this.buildCheckIsAddress = buildCheckIsAddress;
        this.buildCheckIsMap = buildCheckIsMap;
        this.buildCheckIsGroupCode = buildCheckIsGroupCode;
        this.buildCheckIsFloorNum = buildCheckIsFloorNum;
        this.buildCheckIsUser = buildCheckIsUser;
        this.buildCheckIsDate = buildCheckIsDate;
        this.buildInputUnitName = buildInputUnitName;
        this.buildInputUnitId = buildInputUnitId;
        this.buildInputDate = buildInputDate;
        this.buildInputUserName = buildInputUserName;
        this.buildInputUserId = buildInputUserId;
        this.buildRemark = buildRemark;
        this.buildSpAddress = buildSpAddress;
        this.buildSpOwnerName = buildSpOwnerName;
        this.buildSpOwnerAddress = buildSpOwnerAddress;
        this.buildSpOwnerPhone = buildSpOwnerPhone;
        this.buildSpType = buildSpType;
        this.buildChildCount = buildChildCount;
        this.buildIsVirtual = buildIsVirtual;
        this.buildOrderNum = buildOrderNum;
        this.buildParentId = buildParentId;
        this.buildParentIdList = buildParentIdList;
        this.buildRecordStatus = buildRecordStatus;
    }

    public BuildInfoEntity() {
        super();
    }

    /**
     *
     * @return java.lang.String
     **/
    public String getBuildId() {
        return buildId;
    }

    /**
     *
     * @param buildId
     **/
    public void setBuildId(String buildId) {
        this.buildId = buildId == null ? null : buildId.trim();
    }

    /**
     * 建筑物分类:一般建筑物,特殊建筑物
     * @return java.lang.String
     **/
    public String getBuildCategory() {
        return buildCategory;
    }

    /**
     * 建筑物分类:一般建筑物,特殊建筑物
     * @param buildCategory 建筑物分类
     **/
    public void setBuildCategory(String buildCategory) {
        this.buildCategory = buildCategory == null ? null : buildCategory.trim();
    }

    /**
     * 档案代码
     * @return java.lang.String
     **/
    public String getBuildFileCode() {
        return buildFileCode;
    }

    /**
     * 档案代码
     * @param buildFileCode 档案代码
     **/
    public void setBuildFileCode(String buildFileCode) {
        this.buildFileCode = buildFileCode == null ? null : buildFileCode.trim();
    }

    /**
     * 城市Id
     * @return java.lang.String
     **/
    public String getBuildCityId() {
        return buildCityId;
    }

    /**
     * 城市Id
     * @param buildCityId 城市Id
     **/
    public void setBuildCityId(String buildCityId) {
        this.buildCityId = buildCityId == null ? null : buildCityId.trim();
    }

    /**
     * 区Id
     * @return java.lang.String
     **/
    public String getBuildAreaId() {
        return buildAreaId;
    }

    /**
     * 区Id
     * @param buildAreaId 区Id
     **/
    public void setBuildAreaId(String buildAreaId) {
        this.buildAreaId = buildAreaId == null ? null : buildAreaId.trim();
    }

    /**
     * 街道Id:街道,乡镇
     * @return java.lang.String
     **/
    public String getBuildStreetId() {
        return buildStreetId;
    }

    /**
     * 街道Id:街道,乡镇
     * @param buildStreetId 街道Id
     **/
    public void setBuildStreetId(String buildStreetId) {
        this.buildStreetId = buildStreetId == null ? null : buildStreetId.trim();
    }

    /**
     * 社区Id:社区,村
     * @return java.lang.String
     **/
    public String getBuildCommunityId() {
        return buildCommunityId;
    }

    /**
     * 社区Id:社区,村
     * @param buildCommunityId 社区Id
     **/
    public void setBuildCommunityId(String buildCommunityId) {
        this.buildCommunityId = buildCommunityId == null ? null : buildCommunityId.trim();
    }

    /**
     * 所属网格Id
     * @return java.lang.String
     **/
    public String getBuildGridId() {
        return buildGridId;
    }

    /**
     * 所属网格Id
     * @param buildGridId 所属网格Id
     **/
    public void setBuildGridId(String buildGridId) {
        this.buildGridId = buildGridId == null ? null : buildGridId.trim();
    }

    /**
     * 建筑物的地理坐标
     * @return java.lang.String
     **/
    public String getBuildMapLocation() {
        return buildMapLocation;
    }

    /**
     * 建筑物的地理坐标
     * @param buildMapLocation 建筑物的地理坐标
     **/
    public void setBuildMapLocation(String buildMapLocation) {
        this.buildMapLocation = buildMapLocation == null ? null : buildMapLocation.trim();
    }

    /**
     * 建筑物编码:441325 -______-____-____
     * @return java.lang.String
     **/
    public String getBuildCode() {
        return buildCode;
    }

    /**
     * 建筑物编码:441325 -______-____-____
     * @param buildCode 建筑物编码
     **/
    public void setBuildCode(String buildCode) {
        this.buildCode = buildCode == null ? null : buildCode.trim();
    }

    /**
     * 建筑物类型:楼房,平房,别墅
     * @return java.lang.String
     **/
    public String getBuildType() {
        return buildType;
    }

    /**
     * 建筑物类型:楼房,平房,别墅
     * @param buildType 建筑物类型
     **/
    public void setBuildType(String buildType) {
        this.buildType = buildType == null ? null : buildType.trim();
    }

    /**
     * 建筑状态:已竣工,在建,停建
     * @return java.lang.String
     **/
    public String getBuildStatus() {
        return buildStatus;
    }

    /**
     * 建筑状态:已竣工,在建,停建
     * @param buildStatus 建筑状态
     **/
    public void setBuildStatus(String buildStatus) {
        this.buildStatus = buildStatus == null ? null : buildStatus.trim();
    }

    /**
     * 总建筑面积*（M²）
     * @return java.lang.Short
     **/
    public Short getBuildCoveredArea() {
        return buildCoveredArea;
    }

    /**
     * 总建筑面积*（M²）
     * @param buildCoveredArea 总建筑面积*（M²）
     **/
    public void setBuildCoveredArea(Short buildCoveredArea) {
        this.buildCoveredArea = buildCoveredArea;
    }

    /**
     * 总楼层-地面
     * @return java.lang.Short
     **/
    public Short getBuildFloorGround() {
        return buildFloorGround;
    }

    /**
     * 总楼层-地面
     * @param buildFloorGround 总楼层-地面
     **/
    public void setBuildFloorGround(Short buildFloorGround) {
        this.buildFloorGround = buildFloorGround;
    }

    /**
     * 总楼层-地下
     * @return java.lang.Short
     **/
    public Short getBuildFloorUnderground() {
        return buildFloorUnderground;
    }

    /**
     * 总楼层-地下
     * @param buildFloorUnderground 总楼层-地下
     **/
    public void setBuildFloorUnderground(Short buildFloorUnderground) {
        this.buildFloorUnderground = buildFloorUnderground;
    }

    /**
     * 门牌地址
     * @return java.lang.String
     **/
    public String getBuildAddress() {
        return buildAddress;
    }

    /**
     * 门牌地址
     * @param buildAddress 门牌地址
     **/
    public void setBuildAddress(String buildAddress) {
        this.buildAddress = buildAddress == null ? null : buildAddress.trim();
    }

    /**
     * 产权证地址
     * @return java.lang.String
     **/
    public String getBuildAddressTitleCer() {
        return buildAddressTitleCer;
    }

    /**
     * 产权证地址
     * @param buildAddressTitleCer 产权证地址
     **/
    public void setBuildAddressTitleCer(String buildAddressTitleCer) {
        this.buildAddressTitleCer = buildAddressTitleCer == null ? null : buildAddressTitleCer.trim();
    }

    /**
     * 建筑物名称
     * @return java.lang.String
     **/
    public String getBuildName() {
        return buildName;
    }

    /**
     * 建筑物名称
     * @param buildName 建筑物名称
     **/
    public void setBuildName(String buildName) {
        this.buildName = buildName == null ? null : buildName.trim();
    }

    /**
     * 建筑物功能分类
     * @return java.lang.String
     **/
    public String getBuildFunctionCategory() {
        return buildFunctionCategory;
    }

    /**
     * 建筑物功能分类
     * @param buildFunctionCategory 建筑物功能分类
     **/
    public void setBuildFunctionCategory(String buildFunctionCategory) {
        this.buildFunctionCategory = buildFunctionCategory == null ? null : buildFunctionCategory.trim();
    }

    /**
     * 建筑物性质:非自建,单位自建,集体自建,个人自建
     * @return java.lang.String
     **/
    public String getBuildProperty() {
        return buildProperty;
    }

    /**
     * 建筑物性质:非自建,单位自建,集体自建,个人自建
     * @param buildProperty 建筑物性质
     **/
    public void setBuildProperty(String buildProperty) {
        this.buildProperty = buildProperty == null ? null : buildProperty.trim();
    }

    /**
     * 门禁:是,否
     * @return java.lang.String
     **/
    public String getBuildIsEntranceGuard() {
        return buildIsEntranceGuard;
    }

    /**
     * 门禁:是,否
     * @param buildIsEntranceGuard 门禁
     **/
    public void setBuildIsEntranceGuard(String buildIsEntranceGuard) {
        this.buildIsEntranceGuard = buildIsEntranceGuard == null ? null : buildIsEntranceGuard.trim();
    }

    /**
     * 视频监控:是,否
     * @return java.lang.String
     **/
    public String getBuildIsVideoMonitoring() {
        return buildIsVideoMonitoring;
    }

    /**
     * 视频监控:是,否
     * @param buildIsVideoMonitoring 视频监控
     **/
    public void setBuildIsVideoMonitoring(String buildIsVideoMonitoring) {
        this.buildIsVideoMonitoring = buildIsVideoMonitoring == null ? null : buildIsVideoMonitoring.trim();
    }

    /**
     * 物业管理单位
     * @return java.lang.String
     **/
    public String getBuildManagement() {
        return buildManagement;
    }

    /**
     * 物业管理单位
     * @param buildManagement 物业管理单位
     **/
    public void setBuildManagement(String buildManagement) {
        this.buildManagement = buildManagement == null ? null : buildManagement.trim();
    }

    /**
     * 联系人
     * @return java.lang.String
     **/
    public String getBuildContact() {
        return buildContact;
    }

    /**
     * 联系人
     * @param buildContact 联系人
     **/
    public void setBuildContact(String buildContact) {
        this.buildContact = buildContact == null ? null : buildContact.trim();
    }

    /**
     * 联系电话
     * @return java.lang.String
     **/
    public String getBuildContactPhone() {
        return buildContactPhone;
    }

    /**
     * 联系电话
     * @param buildContactPhone 联系电话
     **/
    public void setBuildContactPhone(String buildContactPhone) {
        this.buildContactPhone = buildContactPhone == null ? null : buildContactPhone.trim();
    }

    /**
     * 结构:框架结构,砖混结构,框筒结构,框剪结构,简易结构,钢结构,钢混结构,砖木结构,其它,不详
     * @return java.lang.String
     **/
    public String getBuildStructure() {
        return buildStructure;
    }

    /**
     * 结构:框架结构,砖混结构,框筒结构,框剪结构,简易结构,钢结构,钢混结构,砖木结构,其它,不详
     * @param buildStructure 结构
     **/
    public void setBuildStructure(String buildStructure) {
        this.buildStructure = buildStructure == null ? null : buildStructure.trim();
    }

    /**
     * 设计用途:综合,住宅,商住,商业,厂房,仓库,办公,公共设施,其它,不详。[与特殊建筑物共用]
     * @return java.lang.String
     **/
    public String getBuildDesignFor() {
        return buildDesignFor;
    }

    /**
     * 设计用途:综合,住宅,商住,商业,厂房,仓库,办公,公共设施,其它,不详。[与特殊建筑物共用]
     * @param buildDesignFor 设计用途
     **/
    public void setBuildDesignFor(String buildDesignFor) {
        this.buildDesignFor = buildDesignFor == null ? null : buildDesignFor.trim();
    }

    /**
     * 楼房建筑类型:超高层楼宇（100米或34层以上）,高层楼宇（19-33层或100米以下）,中高层楼宇（12-18层）,小高层楼宇（7-11层）,多层建筑（6层以下）
     * @return java.lang.String
     **/
    public String getBuildFloorDes() {
        return buildFloorDes;
    }

    /**
     * 楼房建筑类型:超高层楼宇（100米或34层以上）,高层楼宇（19-33层或100米以下）,中高层楼宇（12-18层）,小高层楼宇（7-11层）,多层建筑（6层以下）
     * @param buildFloorDes 楼房建筑类型
     **/
    public void setBuildFloorDes(String buildFloorDes) {
        this.buildFloorDes = buildFloorDes == null ? null : buildFloorDes.trim();
    }

    /**
     * 车位数
     * @return java.lang.Integer
     **/
    public Integer getBuildParkingNum() {
        return buildParkingNum;
    }

    /**
     * 车位数
     * @param buildParkingNum 车位数
     **/
    public void setBuildParkingNum(Integer buildParkingNum) {
        this.buildParkingNum = buildParkingNum;
    }

    /**
     * 电梯:是,否
     * @return java.lang.String
     **/
    public String getBuildIsElevator() {
        return buildIsElevator;
    }

    /**
     * 电梯:是,否
     * @param buildIsElevator 电梯
     **/
    public void setBuildIsElevator(String buildIsElevator) {
        this.buildIsElevator = buildIsElevator == null ? null : buildIsElevator.trim();
    }

    /**
     * 综管所核查情况-所属网格是否正确:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsGrid() {
        return buildCheckIsGrid;
    }

    /**
     * 综管所核查情况-所属网格是否正确:是,否
     * @param buildCheckIsGrid 综管所核查情况-所属网格是否正确
     **/
    public void setBuildCheckIsGrid(String buildCheckIsGrid) {
        this.buildCheckIsGrid = buildCheckIsGrid == null ? null : buildCheckIsGrid.trim();
    }

    /**
     * 综管所核查情况-编码类型是否正确:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsCode() {
        return buildCheckIsCode;
    }

    /**
     * 综管所核查情况-编码类型是否正确:是,否
     * @param buildCheckIsCode 综管所核查情况-编码类型是否正确
     **/
    public void setBuildCheckIsCode(String buildCheckIsCode) {
        this.buildCheckIsCode = buildCheckIsCode == null ? null : buildCheckIsCode.trim();
    }

    /**
     * 综管所核查情况-地址填写是否正确:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsAddress() {
        return buildCheckIsAddress;
    }

    /**
     * 综管所核查情况-地址填写是否正确:是,否
     * @param buildCheckIsAddress 综管所核查情况-地址填写是否正确
     **/
    public void setBuildCheckIsAddress(String buildCheckIsAddress) {
        this.buildCheckIsAddress = buildCheckIsAddress == null ? null : buildCheckIsAddress.trim();
    }

    /**
     * 综管所核查情况-地图位置标注是否正确:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsMap() {
        return buildCheckIsMap;
    }

    /**
     * 综管所核查情况-地图位置标注是否正确:是,否
     * @param buildCheckIsMap 综管所核查情况-地图位置标注是否正确
     **/
    public void setBuildCheckIsMap(String buildCheckIsMap) {
        this.buildCheckIsMap = buildCheckIsMap == null ? null : buildCheckIsMap.trim();
    }

    /**
     * 综管所核查情况-是否符合编码划分规则:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsGroupCode() {
        return buildCheckIsGroupCode;
    }

    /**
     * 综管所核查情况-是否符合编码划分规则:是,否
     * @param buildCheckIsGroupCode 综管所核查情况-是否符合编码划分规则
     **/
    public void setBuildCheckIsGroupCode(String buildCheckIsGroupCode) {
        this.buildCheckIsGroupCode = buildCheckIsGroupCode == null ? null : buildCheckIsGroupCode.trim();
    }

    /**
     * 综管所核查情况-总楼层是否正确:是,否
     * @return java.lang.String
     **/
    public String getBuildCheckIsFloorNum() {
        return buildCheckIsFloorNum;
    }

    /**
     * 综管所核查情况-总楼层是否正确:是,否
     * @param buildCheckIsFloorNum 综管所核查情况-总楼层是否正确
     **/
    public void setBuildCheckIsFloorNum(String buildCheckIsFloorNum) {
        this.buildCheckIsFloorNum = buildCheckIsFloorNum == null ? null : buildCheckIsFloorNum.trim();
    }

    /**
     * 综管所核查情况-核查人
     * @return java.lang.String
     **/
    public String getBuildCheckIsUser() {
        return buildCheckIsUser;
    }

    /**
     * 综管所核查情况-核查人
     * @param buildCheckIsUser 综管所核查情况-核查人
     **/
    public void setBuildCheckIsUser(String buildCheckIsUser) {
        this.buildCheckIsUser = buildCheckIsUser == null ? null : buildCheckIsUser.trim();
    }

    /**
     * 综管所核查情况-核查日期
     * @return java.util.Date
     **/
    public Date getBuildCheckIsDate() {
        return buildCheckIsDate;
    }

    /**
     * 综管所核查情况-核查日期
     * @param buildCheckIsDate 综管所核查情况-核查日期
     **/
    public void setBuildCheckIsDate(Date buildCheckIsDate) {
        this.buildCheckIsDate = buildCheckIsDate;
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getBuildInputUnitName() {
        return buildInputUnitName;
    }

    /**
     * 填报单位
     * @param buildInputUnitName 填报单位
     **/
    public void setBuildInputUnitName(String buildInputUnitName) {
        this.buildInputUnitName = buildInputUnitName == null ? null : buildInputUnitName.trim();
    }

    /**
     * 填报单位
     * @return java.lang.String
     **/
    public String getBuildInputUnitId() {
        return buildInputUnitId;
    }

    /**
     * 填报单位
     * @param buildInputUnitId 填报单位
     **/
    public void setBuildInputUnitId(String buildInputUnitId) {
        this.buildInputUnitId = buildInputUnitId == null ? null : buildInputUnitId.trim();
    }

    /**
     * 登记时间
     * @return java.util.Date
     **/
    public Date getBuildInputDate() {
        return buildInputDate;
    }

    /**
     * 登记时间
     * @param buildInputDate 登记时间
     **/
    public void setBuildInputDate(Date buildInputDate) {
        this.buildInputDate = buildInputDate;
    }

    /**
     * 登记人
     * @return java.lang.String
     **/
    public String getBuildInputUserName() {
        return buildInputUserName;
    }

    /**
     * 登记人
     * @param buildInputUserName 登记人
     **/
    public void setBuildInputUserName(String buildInputUserName) {
        this.buildInputUserName = buildInputUserName == null ? null : buildInputUserName.trim();
    }

    /**
     * 登记人ID
     * @return java.lang.String
     **/
    public String getBuildInputUserId() {
        return buildInputUserId;
    }

    /**
     * 登记人ID
     * @param buildInputUserId 登记人ID
     **/
    public void setBuildInputUserId(String buildInputUserId) {
        this.buildInputUserId = buildInputUserId == null ? null : buildInputUserId.trim();
    }

    /**
     * 备注
     * @return java.lang.String
     **/
    public String getBuildRemark() {
        return buildRemark;
    }

    /**
     * 备注
     * @param buildRemark 备注
     **/
    public void setBuildRemark(String buildRemark) {
        this.buildRemark = buildRemark == null ? null : buildRemark.trim();
    }

    /**
     * 特殊类建筑物-详细地址
     * @return java.lang.String
     **/
    public String getBuildSpAddress() {
        return buildSpAddress;
    }

    /**
     * 特殊类建筑物-详细地址
     * @param buildSpAddress 特殊类建筑物-详细地址
     **/
    public void setBuildSpAddress(String buildSpAddress) {
        this.buildSpAddress = buildSpAddress == null ? null : buildSpAddress.trim();
    }

    /**
     * 特殊类建筑物-建筑物业主
     * @return java.lang.String
     **/
    public String getBuildSpOwnerName() {
        return buildSpOwnerName;
    }

    /**
     * 特殊类建筑物-建筑物业主
     * @param buildSpOwnerName 特殊类建筑物-建筑物业主
     **/
    public void setBuildSpOwnerName(String buildSpOwnerName) {
        this.buildSpOwnerName = buildSpOwnerName == null ? null : buildSpOwnerName.trim();
    }

    /**
     * 特殊类建筑物-建筑物业主-联系地址
     * @return java.lang.String
     **/
    public String getBuildSpOwnerAddress() {
        return buildSpOwnerAddress;
    }

    /**
     * 特殊类建筑物-建筑物业主-联系地址
     * @param buildSpOwnerAddress 特殊类建筑物-建筑物业主-联系地址
     **/
    public void setBuildSpOwnerAddress(String buildSpOwnerAddress) {
        this.buildSpOwnerAddress = buildSpOwnerAddress == null ? null : buildSpOwnerAddress.trim();
    }

    /**
     * 特殊类建筑物-建筑物业主-联系电话
     * @return java.lang.String
     **/
    public String getBuildSpOwnerPhone() {
        return buildSpOwnerPhone;
    }

    /**
     * 特殊类建筑物-建筑物业主-联系电话
     * @param buildSpOwnerPhone 特殊类建筑物-建筑物业主-联系电话
     **/
    public void setBuildSpOwnerPhone(String buildSpOwnerPhone) {
        this.buildSpOwnerPhone = buildSpOwnerPhone == null ? null : buildSpOwnerPhone.trim();
    }

    /**
     * 特殊类建筑物-建筑物类型:铁皮房,工棚,窝棚,看守棚,集装箱、大型装箱,危房,其它
     * @return java.lang.String
     **/
    public String getBuildSpType() {
        return buildSpType;
    }

    /**
     * 特殊类建筑物-建筑物类型:铁皮房,工棚,窝棚,看守棚,集装箱、大型装箱,危房,其它
     * @param buildSpType 特殊类建筑物-建筑物类型
     **/
    public void setBuildSpType(String buildSpType) {
        this.buildSpType = buildSpType == null ? null : buildSpType.trim();
    }

    /**
     * 子节点数量
     * @return java.lang.Integer
     **/
    public Integer getBuildChildCount() {
        return buildChildCount;
    }

    /**
     * 子节点数量
     * @param buildChildCount 子节点数量
     **/
    public void setBuildChildCount(Integer buildChildCount) {
        this.buildChildCount = buildChildCount;
    }

    /**
     * 是否虚拟
     * @return java.lang.String
     **/
    public String getBuildIsVirtual() {
        return buildIsVirtual;
    }

    /**
     * 是否虚拟
     * @param buildIsVirtual 是否虚拟
     **/
    public void setBuildIsVirtual(String buildIsVirtual) {
        this.buildIsVirtual = buildIsVirtual == null ? null : buildIsVirtual.trim();
    }

    /**
     * 排序号
     * @return java.lang.Integer
     **/
    public Integer getBuildOrderNum() {
        return buildOrderNum;
    }

    /**
     * 排序号
     * @param buildOrderNum 排序号
     **/
    public void setBuildOrderNum(Integer buildOrderNum) {
        this.buildOrderNum = buildOrderNum;
    }

    /**
     * 父节点ID
     * @return java.lang.String
     **/
    public String getBuildParentId() {
        return buildParentId;
    }

    /**
     * 父节点ID
     * @param buildParentId 父节点ID
     **/
    public void setBuildParentId(String buildParentId) {
        this.buildParentId = buildParentId == null ? null : buildParentId.trim();
    }

    /**
     * 父节点列表
     * @return java.lang.String
     **/
    public String getBuildParentIdList() {
        return buildParentIdList;
    }

    /**
     * 父节点列表
     * @param buildParentIdList 父节点列表
     **/
    public void setBuildParentIdList(String buildParentIdList) {
        this.buildParentIdList = buildParentIdList == null ? null : buildParentIdList.trim();
    }

    /**
     * 状态
     * @return java.lang.String
     **/
    public String getBuildRecordStatus() {
        return buildRecordStatus;
    }

    /**
     * 状态
     * @param buildRecordStatus 状态
     **/
    public void setBuildRecordStatus(String buildRecordStatus) {
        this.buildRecordStatus = buildRecordStatus == null ? null : buildRecordStatus.trim();
    }
}