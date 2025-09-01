(function() {
  'use strict';

  // ChatworkのAPIトークンとルームIDをここに設定してください
  const chatworkApiToken = '51ac74578cdbe68480fd0e26c744865d';
  const chatworkRoomId = 408492022;

  // レコード編集画面保存時とレコード追加画面で保存するときにイベントを発生させる
  kintone.events.on(['app.record.edit.submit.success','app.record.create.submit.success'], function(event) {
    const record = event.record;
    const fromAppId = kintone.app.getId();
    
    // 「BARIAS申込プラン」フィールドのコードを 'ドロップダウン' と仮定
    // 連携ステータスが「未連携」かつフラグが「有」の場合のみ処理を実行
    if (record['ドロップダウン'].value === '有' && record['バリアスkintone連携ステータス'].value !== '連携済み') {
      
      const configAppId = 149;
      const configRecordId = 1;

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
          'app': fromAppId,
          'id': recordId,
          'record': {
            'バリアスkintone連携ステータス': {
              'value': '連携済み'
            }
          }
        };
          
        return kintone.api(kintone.api.url('/k/v1/record'), 'PUT', updateBody);
      }).then(function() {
        // 全てのAPI連携が成功した場合のみ画面をリロード
        location.reload(); 
        return event;
      }).catch(function(error) {
        // API実行に失敗した場合の処理
        const recordNumber = record['レコード番号'].value;
        const errorMessage = `【kintone連携エラー】\nWiMAXアプリからバリアスアプリへのレコード作成に失敗しました。\n\nWiMAXアプリID: ${fromAppId}\nWiMAXレコード番号: ${recordNumber}\n\nエラー詳細:\n${JSON.stringify(error, null, 2)}`;
        
        const chatworkBody = {
          'room_id': chatworkRoomId,
          'body': errorMessage
        };

        // Chatwork APIを呼び出してメッセージを送信
        return kintone.api(kintone.api.url('https://api.chatwork.com/v2/rooms/messages', true), 'POST', chatworkBody, {
          'X-ChatWorkToken': chatworkApiToken
        }).then(function() {
          console.error('バリアスアプリへのレコード作成に失敗し、Chatworkへ通知しました。');
          // ユーザーにエラーが発生したことを通知
          alert('連携処理中にエラーが発生しました。詳細は担当者にお問い合わせください。');
          return event;
        }).catch(function(chatworkError) {
          console.error('Chatworkへの通知も失敗しました。', chatworkError);
          // Chatworkへの通知も失敗した場合、ユーザーに通知
          alert('連携処理およびエラー通知に失敗しました。');
          return event;
        });
      });
    }

    return event;
  });
})();