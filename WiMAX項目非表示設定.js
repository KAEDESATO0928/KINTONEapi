(function() {
    'use strict';
    
    // ユーザーName
    const targetUserName = '株式会社樹人';

    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
        
        const userInfo = kintone.getLoginUser();

        if (userInfo.name === targetUserName) {
            
            // --- 1. グループ「group1」「group2」「group3」全体を非表示にする ---
            kintone.app.record.setFieldShown('group1', false);
            kintone.app.record.setFieldShown('group2', false);
            kintone.app.record.setFieldShown('group3', false);
            
            
        }
        
        return event;
    });
})();