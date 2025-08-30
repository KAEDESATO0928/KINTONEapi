(function() {
    'use strict';
    
    // ユーザーName
    const targetUserName = '株式会社樹人';

    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
        
        const userInfo = kintone.getLoginUser();

        if (userInfo.loginName === targetUserName) {
            
            // --- 1. グループ「group1」「group2」「group3」全体を非表示にする ---
            kintone.app.record.setFieldShown('group1', false);
            kintone.app.record.setFieldShown('group2', false);
            kintone.app.record.setFieldShown('group3', false);
            
            // --- 2. グループ「group4」内のラベルを非表示にする ---
            const group4Element = kintone.app.record.getFieldElement('group4');
            
            if (group4Element) {
                const labelsInGroup4 = group4Element.getElementsByClassName('label-field-label');
                
                for (let i = 0; i < labelsInGroup4.length; i++) {
                    labelsInGroup4[i].style.display = 'none';
                }
            }
        }
        
        return event;
    });
})();