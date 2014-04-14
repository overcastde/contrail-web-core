/*
 * Copyright (c) 2013 Juniper Networks, Inc. All rights reserved.
 */

var cacheApi = require('../../core/cache.api'),
    global   = require('../../../common/global'),
    commonUtils = require('../../../utils/common.utils'),
    config = require('../../../../../config/config.global.js'),
    rest = require('../../../common/rest.api'),
    storageServer= require('../../../common/cephServer.api'),
    async = require('async'),
    jsonPath = require('JSONPath').eval,

storageInfraApi = module.exports;

function getStorageClusterStatus(req, res ){
    url = "/status";
   // console.log("get data:"+url);
    cacheApi.queueDataFromCacheOrSendRequest(req, res, global.STR_JOB_TYPE_CACHE,
                                             global.STR_CEPH_TYPE_CLUSTER, url,
                                             0, 1, 0, -1, true, null);
}


function getStorageClusterHealthStatus(req, res, appData){
    url = "/health";
   storageServer.apiGet(url, appData, function (error, resultJSON) {
        if(!error && (resultJSON)) {
            var resultJSON = parseStorageHealthStatusData(resultJSON);
            commonUtils.handleJSONResponse(null, res, resultJSON);
        } else {
            commonUtils.handleJSONResponse(error, res, null);
        }
    });
   
}

function parseStorageHealthStatusData(resultJSON){
    var emptyObj = {};  
        var healthJSON = {};
        var status = jsonPath(resultJSON, "$..status");
        var summary= jsonPath(resultJSON, "$..summary");
        var details= jsonPath(resultJSON, "$..detail");
        if (status.length > 0 ) {
            var temp = new Object();
            temp["overall_status"] = status[0];
            temp["details"] = details[0];
            temp["summary"] = summary[0];
            healthJSON['cluster_status']= temp;
            return healthJSON;
        }
        return emptyObj;
}


function getStorageClusterActivity(req, res,appData){
    url = "/status";
     storageServer.apiGet(url, appData,url, function (error, resultJSON) {
            if(!error && (resultJSON)) {
                var resultJSON = parseStorageClusterActivityData(resultJSON);
                commonUtils.handleJSONResponse(null, res, resultJSON);
            } else {
                commonUtils.handleJSONResponse(error, res, null);
            }
        });  
}

function parseStorageClusterActivityData(activityJSON){
   return activityJSON;
}

function getStorageClusterUsageData(req, res, appData){
    url = "/df";
     storageServer.apiGet(url, appData, function (error, resultJSON) {
            if(!error && (resultJSON)) {
                var resultJSON = parseStorageClusterUsageData(resultJSON);
                commonUtils.handleJSONResponse(null, res, resultJSON);
            } else {
                commonUtils.handleJSONResponse(error, res, null);
            }
        });  
}

function parseStorageClusterUsagaeData(usageJSON){
   return usageJSON;
}



function getStorageClusterDFStatus(req, res, appData){
    url = "/df";
    storageServer.apiGet(url, appData, function (error, resultJSON) {
        if(!error && (resultJSON)) {
            var resultJSON = parseStorageDFData(resultJSON);
            commonUtils.handleJSONResponse(null, res, resultJSON);
        } else {
            commonUtils.handleJSONResponse(error, res, null);
        }
    });
}

function parseStorageDFData(dfDataJSON){
    var dfJSON ={};
    dfJSON['utilization_stats']= dfDataJSON;
    return dfJSON;
}



/* List all public functions */
exports.getStorageClusterStatus= getStorageClusterStatus;
exports.getStorageClusterDFStatus=getStorageClusterDFStatus
exports.getStorageClusterHealthStatus = getStorageClusterHealthStatus;
exports.getStorageClusterActivity = getStorageClusterActivity;
exports.getStorageClusterUsageData= getStorageClusterUsageData;



