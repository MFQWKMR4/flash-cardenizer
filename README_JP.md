
# FlashCardenizer
csvファイルをフラッシュカード化するツールです

# 機能
- ランダム表示機能
- スコア機能
- カードを記録し、記録したカードを振り返ることができる
- フラッシュカードをカスタマイズ可能

## ランダム表示
ロードされたcsvファイルの中からランダムに表示することができます

## スコア
行ごとに正解判定を行うことができ、実行ごとに正解数を記録し振り返ることができます

## カードの記録
(csvファイル名,先頭列)をキーとして（キーのみを）記録します
同じcsvファイル名のファイルがロードされた時に、記録したカードを振り返るモードが利用可能です

## カスタマイズ
csvファイルにおける1行をどのように表示するかカスタマイズ可能です
- 1行につき表示する画面の数
  - default: 2
- 各画面で表示する情報の指定
  - default:
    - view1 -> \[col1\]
    - view2 -> \[col2\]

### 注意
上記の記録する機能は全て自身のローカルストレージに保存されます。
