(function() {
  'use strict';


// ChatworkのAPIトークンとルームIDをここに設定してください
/* CW連携まだ
  const chatworkApiToken = 'YOUR_CHATWORK_API_TOKEN';//CWのAPI利用申請待ち
  const chatworkRoomId = 408492022; // cw「BARIASキントーン自動生成」のルームID
*/

  // レコード編集画面保存時とレコード追加画面で保存するときにイベントを発生させる
  kintone.events.on(['app.record.edit.submit.success','app.record.create.submit.success'], function(event) {
    const record = event.record;
    const fromAppId = kintone.app.getId(); // test用ID:148
    // 「BARIAS申込プラン」フィールドのコードを 'ドロップダウン' と仮定
    // 連携ステータスが「未連携」かつフラグが「有」の場合のみ処理を実行
    if (record['ドロップダウン'].value === '有'&& record['バリアスkintone連携ステータス'].value !== '連携済み') {
      
      const  configAppId = 149; // ★ここに作成した設定アプリのIDを設定してください
       const configRecordId = 1; // 常にレコード番号1番のレコードを参照

        // 設定アプリからレコード番号1番のレコードを直接取得
      const getBody = {
        'app': configAppId,
        'id': configRecordId
      };


      return kintone.api(kintone.api.url('/k/v1/record'), 'GET', getBody).then(function(resp) {
        const configRecord = resp.record;

        // 連携先アプリIDとフィールドマッピングを取得
        const barriassAppId = configRecord['連携先アプリID'].value;
        const fieldMappings = configRecord['連携フィールド設定'].value;

        // 連携フィールド設定から、動的にレコード作成用のボディを生成
        const newRecordBody = {};
        fieldMappings.forEach(mapping => {
          const fromFieldCode = mapping.value['連携元フィールドコード'].value;
          const toFieldCode = mapping.value['連携先フィールドコード'].value;
          
          // 連携元のレコードから値を取得し、連携先のレコードボディに設定
          if (record[fromFieldCode]) {
            newRecordBody[toFieldCode] = { 'value': record[fromFieldCode].value };
          }
        });

      
        // 「バリアス」アプリに新規作成するレコードのデータ
        const postBody = {
          'app': barriassAppId,
          'record': newRecordBody
        };
         
        return kintone.api(kintone.api.url('/k/v1/record'), 'POST', postBody);
      }).then(function(resp) {
        console.log('バリアスアプリにレコードが正常に作成されました。');
        
        // 連携成功後、WiMAXアプリの「バリアスkintone連携ステータス」フィールドを「連携済み」に更新
        const recordId = event.recordId;
        const updateBody = {
          'app': wimaxAppId,
          'id': recordId,
          'record': {
            'バリアスkintone連携ステータス': {
              'value': '連携済み'
            }
          }
        };
         
         return kintone.api(kintone.api.url('/k/v1/record'), 'PUT', updateBody);
      }).then(function() {
        return event;
      }).catch(function(error) {
        console.error('連携処理中にエラーが発生しました。', error);
        alert('連携処理中にエラーが発生しました。');
        return event;
      });
    }

       
    return event;
  });

})();