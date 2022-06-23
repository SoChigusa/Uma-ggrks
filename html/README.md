# 情報更新方法メモ

## 育成ウマ娘追加時

### 新規ウマ娘の場合

1. ウマ娘の名前に対応するIDを使って、`html/iks` ディレクトリ内に html ファイルを作る。
2. `<body></body>` タグで囲んだ中にイベント選択肢リストをコピペ。
3. `<div class="umamusume-event-checker__event--title">` タグの次に以下の形で ID 情報を入れる。

   ```html
   <div class="umamusume-event-checker__event--id">[ID here]</div>
   ```

4. `src/to_json.py` および `js/choices.js` 内のキャラ ID リストに新規キャラの ID を追加する。
5. `src/to_json.py` を実行し、エラーメッセージに従って ID の被りを解消する。
6. `git push` したら必ず動作確認する。

### 既存ウマ娘の新衣装の場合

1. `html/iks` 内にある旧衣装のウマ娘の html ファイルを開く。
2. `<body></body>` タグ内、旧衣装の情報の下にイベント選択肢リストをコピペ。
3. 旧衣装と共通のイベントの情報は消去する。
4. `<div class="umamusume-event-checker__event--title">` タグの次に以下の形で ID 情報を入れる。
  
   ```html
   <div class="umamusume-event-checker__event--id">[ID here]</div>
   ```

5. 旧衣装と共通のイベントに関して、旧衣装側の `<div class="umamusume-event-checker__event--character">` タグ内に以下をコピペ。

   ```html
   <div><a href="~~~" target="_blank">[新衣装ウマ娘名]</a></div>
   ```

6. `src/to_json.py` を実行し、エラーメッセージに従って ID の被りを解消する。
7. `git push` したら必ず動作確認する。

## サポートカード追加時

### サポカ初実装のウマ娘の場合

1. `html/spt` 内にある対応するサポートタイプの html ファイルを開く。
2. `<body></body>` タグで囲んだ中にイベント選択肢リストをコピペ。
3. `<div class="umamusume-event-checker__event--title">` タグの次に以下の形で ID 情報を入れる。

   ```html
   <div class="umamusume-event-checker__event--id">[ID here]</div>
   ```

4. `src/to_json.py` を実行し、エラーメッセージに従って ID の被りを解消する。
5. `git push` したら必ず動作確認する。

### 他にサポカが存在するウマ娘の場合

1. `html/spt` 内にある対応するサポートタイプの html ファイルを開く。
2. `<body></body>` タグで囲んだ中にイベント選択肢リストをコピペ。
3. 既存のサポカと共通のイベントの情報は消去する。
4. `<div class="umamusume-event-checker__event--title">` タグの次に以下の形で ID 情報を入れる。

   ```html
   <div class="umamusume-event-checker__event--id">[ID here]</div>
   ```

5. 既存のサポカと共通のイベントに関して、既存のサポカ側の `<div class="umamusume-event-checker__event--character">` タグ内に以下をコピペ。

   ```html
   <div><a href="~~~" target="_blank">[新サポカ名]</a></div>
   ```

6. `src/to_json.py` を実行し、エラーメッセージに従って ID の被りを解消する。
7. `git push` したら必ず動作確認する。
