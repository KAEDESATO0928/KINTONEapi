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
            
             // --- 2. グループ「group2」内のラベルと、表示したいフィールド以外の項目をすべて非表示にする ---
            const group2Element = kintone.app.record.getFieldElement(group2Code);
            
            if (group2Element) {
                // グループ内のすべてのフィールド要素を取得
                const allFieldElementsInGroup2 = group2Element.querySelectorAll('[data-cy-field-code]');

                allFieldElementsInGroup2.forEach(element => {
                    const fieldCode = element.getAttribute('data-cy-field-code');
                    // '文字列__複数行_' 以外のフィールドを非表示にする
                    if (fieldCode !== fieldToShowCode) {
                        kintone.app.record.setFieldShown(fieldCode, false);
                    }
                });

                // グループ内のすべてのラベルを非表示にする
                const labelsInGroup2 = group2Element.getElementsByClassName('label-field-label');
                for (let i = 0; i < labelsInGroup2.length; i++) {
                    labelsInGroup2[i].style.display = 'none';
                }
            }
            //kintone.app.record.setFieldShown(group2Code, false);
            // --- 4. グループ「group3」全体を非表示にする ---
            kintone.app.record.setFieldShown(group3Code, false);
        }

        
        return event;
    });
})();