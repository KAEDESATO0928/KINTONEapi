(function() {
    'use strict';

      // レコード詳細画面と編集画面のイベントをフック
    kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
        // ログインユーザー情報を取得
         const userInfo = kintone.getLoginUser();
        // 非表示にしたいグループのフィールドコード
         const targetGroupCode1 = 'group1'; 
         const targetGroupCode3 = 'group3';
        // 非表示グループの中で”営業コメント（文字列__複数行_）”だけ表示したい
         const targetGroupCode2 = 'group2'; 
         const displaytargetCode = '文字列__複数行_'; 
         // 特定のログイン名（例: 'mikito'）の場合にフィールドを非表示にする
         const hiddenLoginName = 'a.inota@apclo.net'; 
         // ユーザーIDが「mikito」の場合に処理を実行
        if (userInfo.loginName === hiddenLoginName) {
            
            // --- 1. グループ「group1」全体を非表示にする ---
            const group1Element = kintone.app.record.getFieldElement(targetGroupCode1);
            if (group1Element) {
                group1Element.style.display = 'none';
            }
            
            // --- 2. グループ「group2」内の「文字列__複数行_」以外を非表示にする ---
            const record = event.record;
            
            // グループ「group2」内のすべてのフィールドを非表示にする
            const group2Fields = record.targetGroupCode2.value;
            group2Fields.forEach(field => {
                const fieldCode = Object.keys(field)[0];
                
                // 「文字列__複数行_」フィールド以外を非表示にする
                if (fieldCode !== displaytargetCode) {
                    const fieldElement = kintone.app.record.getFieldElement(fieldCode);
                    if (fieldElement) {
                        fieldElement.style.display = 'none';
                    }
                }
            });

            // --- 3. グループ「group3」全体を非表示にする ---
            const group3Element = kintone.app.record.getFieldElement(targetGroupCode3);
            if (group3Element) {
                group3Element.style.display = 'none';
            }
        }
         return event;
     });

})();