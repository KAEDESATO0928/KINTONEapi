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
    const targetUserID = '株式会社樹人';

    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
        
        const userInfo = kintone.getLoginUser();

        if (userInfo.name === targetUserID) {
            
            // --- 1. グループ「group1」全体を非表示にする ---
            kintone.app.record.setFieldShown(group1Code, false);
            
            // --- 2. グループ「group2」内のラベルと他のフィールドを非表示にする ---
            /* まずはグループ2全体を非表示にする
            kintone.app.record.setFieldShown(group2Code, false);
            
            // 次に、特定のフィールドだけを表示にする
            kintone.app.record.setFieldShown(fieldToShowCode, true);
            
            // --- 3. グループ「group2」内の非表示にしたいラベルを非表示にする ---
            const allLabels = document.getElementsByClassName('label-field-label');
            
            for (let i = 0; i < allLabels.length; i++) {
                if (labelsToHide.includes(allLabels[i].innerText)) {
                    allLabels[i].style.display = 'none';
                }
            }
*/
            // --- 4. グループ「group3」全体を非表示にする ---
            kintone.app.record.setFieldShown(group3Code, false);
        }

        
        return event;
    });
})();