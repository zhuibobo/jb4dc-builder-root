package com.jb4dc.gridsystem.po;

import com.jb4dc.gridsystem.dbentities.person.FamilyEntity;
import com.jb4dc.gridsystem.dbentities.person.PersonEntity;

import java.util.List;

public class FamilyPO {
    private FamilyEntity editFamilyInfo;
    private List<PersonPO> familyPersons;

    public FamilyEntity getEditFamilyInfo() {
        return editFamilyInfo;
    }

    public void setEditFamilyInfo(FamilyEntity editFamilyInfo) {
        this.editFamilyInfo = editFamilyInfo;
    }

    public List<PersonPO> getFamilyPersons() {
        return familyPersons;
    }

    public void setFamilyPersons(List<PersonPO> familyPersons) {
        this.familyPersons = familyPersons;
    }
}
