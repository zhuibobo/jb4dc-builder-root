package com.jb4dc.workflow.po;

import com.jb4dc.workflow.po.bpmn.process.BpmnTask;

import java.util.List;

public class ResolveNextPossibleFlowNodePO {
    List<BpmnTask> bpmnTaskList;

    boolean currentTaskIsMultiInstance;
    boolean currentTaskActionIsLast;
    boolean currentTaskIsSequential;
    boolean currentTaskIsParallel;
    int currentTaskMultiCountEngInstances;
    int currentTaskMultiCompletedInstances;
    int currentTaskMultiActiveInstances;
    boolean nextTaskIsEndEvent;

    public List<BpmnTask> getBpmnTaskList() {
        return bpmnTaskList;
    }

    public void setBpmnTaskList(List<BpmnTask> bpmnTaskList) {
        this.bpmnTaskList = bpmnTaskList;
    }

    public boolean isCurrentTaskIsMultiInstance() {
        return currentTaskIsMultiInstance;
    }

    public void setCurrentTaskIsMultiInstance(boolean currentTaskIsMultiInstance) {
        this.currentTaskIsMultiInstance = currentTaskIsMultiInstance;
    }

    public boolean isCurrentTaskActionIsLast() {
        return currentTaskActionIsLast;
    }

    public void setCurrentTaskActionIsLast(boolean currentTaskActionIsLast) {
        this.currentTaskActionIsLast = currentTaskActionIsLast;
    }

    public boolean isCurrentTaskIsSequential() {
        return currentTaskIsSequential;
    }

    public void setCurrentTaskIsSequential(boolean currentTaskIsSequential) {
        this.currentTaskIsSequential = currentTaskIsSequential;
    }

    public boolean isCurrentTaskIsParallel() {
        return currentTaskIsParallel;
    }

    public void setCurrentTaskIsParallel(boolean currentTaskIsParallel) {
        this.currentTaskIsParallel = currentTaskIsParallel;
    }

    public int getCurrentTaskMultiCountEngInstances() {
        return currentTaskMultiCountEngInstances;
    }

    public void setCurrentTaskMultiCountEngInstances(int currentTaskMultiCountEngInstances) {
        this.currentTaskMultiCountEngInstances = currentTaskMultiCountEngInstances;
    }

    public int getCurrentTaskMultiCompletedInstances() {
        return currentTaskMultiCompletedInstances;
    }

    public void setCurrentTaskMultiCompletedInstances(int currentTaskMultiCompletedInstances) {
        this.currentTaskMultiCompletedInstances = currentTaskMultiCompletedInstances;
    }

    public int getCurrentTaskMultiActiveInstances() {
        return currentTaskMultiActiveInstances;
    }

    public void setCurrentTaskMultiActiveInstances(int currentTaskMultiActiveInstances) {
        this.currentTaskMultiActiveInstances = currentTaskMultiActiveInstances;
    }

    public boolean isNextTaskIsEndEvent() {
        return nextTaskIsEndEvent;
    }

    public void setNextTaskIsEndEvent(boolean nextTaskIsEndEvent) {
        this.nextTaskIsEndEvent = nextTaskIsEndEvent;
    }
}
