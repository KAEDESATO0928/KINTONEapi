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

    // 「BARIAS申込プラン」フィールドのコードを 'ドロップダウン' と仮定
    // フラグが「有」の場合のみ処理を実行
    if (record['ドロップダウン'].value === '有') {
     //不要？ const wimaxAppId = kintone.app.getId(); // test用ID:148
      const barriassAppId = 147; // 連携先の「バリアステスト用」アプリID:147をここに設定
      
      // WiMAXアプリから取得するフィールドのコードを仮定
      const customerName = record['文字列__1行_'].value;//お客様姓カナ
      const phoneNumber = record['文字列__1行__0'].value;//電話番号
     // const merchandise= 'WiMAX';//付帯元商材
     // const uniquenumber = record['文字列__1行__1'].value;//自動採番用の番号

      // 「バリアス」アプリに新規作成するレコードのデータ
      const body = {
        'app': barriassAppId,
        'record': {
          /*'付帯元商材': {
            'value': merchandise
          },*/

          '文字列__1行__0': {
            'value': customerName
          },
          '文字列__1行__1': {
            'value': phoneNumber
          },
         /* '文字列__1行_': {//自動採番
            'value': uniquenumber
          },*/

        }
      };


       return kintone.api(kintone.api.url('/k/v1/record'), 'POST', body).then(function(resp) {
        console.log('バリアスアプリにレコードが正常に作成されました。');
        return event;
      }).catch(function(error) {
        console.error('バリアスアプリへのレコード作成に失敗しました。', error);
        alert('連携処理中にエラーが発生しました。');
        return event;
      });
     /*検証部分なので一旦オフ
      return kintone.api(kintone.api.url('/k/v1/record'), 'POST', body).then(function(resp) {
        console.log('バリアスアプリにレコードが正常に作成されました。');
        return event;
      }).catch(function(error) {
        // API実行に失敗した場合の処理
        const errorMessage = `【kintone連携エラー】\nWiMAXアプリからバリアスアプリへのレコード作成に失敗しました。\n\nエラー詳細:\n${JSON.stringify(error, null, 2)}\n\nお客様氏名: ${customerName}\n電話番号: ${phoneNumber}`;

        const chatworkBody = {
          'room_id': chatworkRoomId,
          'body': errorMessage
        };

         // Chatwork APIを呼び出してメッセージを送信
        return kintone.api(kintone.api.url('https://api.chatwork.com/v2/rooms/messages', true), 'POST', chatworkBody, {
          'X-ChatWorkToken': chatworkApiToken
        }).then(function() {
          console.error('バリアスアプリへのレコード作成に失敗し、Chatworkへ通知しました。');
          alert('連携処理中にエラーが発生し、担当者に通知しました。');
          return event;
        }).catch(function(chatworkError) {
          console.error('Chatworkへの通知も失敗しました。', chatworkError);
          alert('連携処理およびエラー通知に失敗しました。');
          return event;// エラーがあっても元の処理は続行
        });

        });
        */
    }

    // フラグが「有」でない場合は、そのまま元の処理を続行
    return event;
  });

})();