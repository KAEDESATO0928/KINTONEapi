(function() {
    'use strict';
    
    // 非表示にしたいラベルのテキストを正確に指定
    const labelsToHide = ['ラベルA', 'ラベルB']; // ここを非表示にしたいラベルのテキストに書き換えてください
    
    // 非表示にしたいグループのフィールドコード
    const group1Code = 'group1';
    const group3Code = 'group3';
    // グループ2のフィールドコード
    const group2Code = 'group2';
    
    // 表示したいフィールドのフィールドコード
    const fieldToShowCode = '文字列__複数行_';
    
    // ユーザーID
    const targetUserName = '株式会社樹人';

    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
        
        const userInfo = kintone.getLoginUser();

        if (userInfo.name === targetUserName) {
            
            // --- 1. グループ「group1」全体を非表示にする ---
            kintone.app.record.setFieldShown(group1Code, false);
            
             const group2Element = kintone.app.record.getFieldElement('group2');

           if (group2Element) {
                // グループ2内のすべてのラベル要素を取得
                const labelsInGroup2 = group2Element.getElementsByClassName('label-field-label');
                
                // 取得したラベルをすべて非表示にする
                for (let i = 0; i < labelsInGroup2.length; i++) {
                    labelsInGroup2[i].style.display = 'none';
                }
            }

            // --- 4. グループ「group3」全体を非表示にする ---
            kintone.app.record.setFieldShown(group3Code, false);
        }

        
        return event;
    });
})();