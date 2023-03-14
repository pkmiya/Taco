If you prefer to read info in English, refer to [English ver.](https://pkmiya.myportfolio.com/)

# 更新履歴
v1.0 / 2023-03-14

# はじめに
## 目的
このレポジトリは，学生と教員が共同運用するTo-do管理システム「**TacoClass**」についてまとめたものです．
## 対象読者
- 小島研究室のメンバー
- 外部の方々

小島研の方へ：このReadMeは外部の方々を想定して作成しました．細かい説明や機密情報は削除しているため，不明な点があれば遠慮なく相談してください．

## 手順
システムのフォークにあたり，次の手順を踏むことをオススメします：
1. 各種資料の閲覧（概要・論文・発表資料）
2. 環境の構築
3. 開発状況の把握

## おことわり
このシステムは，筆者とその先輩，計２名が共同で開発したものです．\
システムは２つの主要機能を有し，筆者は２つめの機能の開発を担当しました．そのため，機能によって説明の分量や詳しさに差があるかもしれません．


# 各種資料
このシステムに関する，筆者が作成した資料を掲載します．いずれも.pdfファイルで，筆者の個人用OneDriveにアップロードしたものです．
1. 概要：[OneDrive](https://1drv.ms/b/s!Ai9qS4d125m_gaU-Y4A5i9ncgGDPiQ?e=wTg783)
2. 論文：[OneDrive](https://1drv.ms/b/s!Ai9qS4d125m_gaU9G79NOOqnw1ACag?e=GlVjNI
)
3. 発表：[OneDrive](https://1drv.ms/b/s!Ai9qS4d125m_galp9iMF70qML2cKqg?e=hioWgx
)


# 環境構築
環境構築は以下の手順で行います．
1. WSL\
参考：[Qiita](https://qiita.com/matarillo/items/61a9ead4bfe2868a0b86)
1. Node.jsとnpm\
参考：[Ubunlog](https://ubunlog.com/ja/%E5%8F%8D%E5%BF%9C%E3%82%A2%E3%83%97%E3%83%AA%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8Breact%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E6%9C%80%E5%88%9D%E3%81%AE%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B/)
1. Gitとクローン\
参考：[Qiita](https://qiita.com/tommy_g/items/771ac45b89b02e8a5d64), 
1. データベース\
参考：[DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-ubuntu-20-04-ja)，[技術メモの壁](https://fsck.jp/?p=793)，[arkgame](https://arkgame.com/2022/08/20/post-312194/)
1. Firebase\
参考：[Firebase](https://console.firebase.google.com/u/0/?hl=ja)

## 1. WSL
#### 目的
本研究では学内サーバにRaspberryPi（OSはLinuxベースであるRaspbian）を使っています．一方，普段と同じ環境（OSはWindows）で開発がしたいです．そこで，Windows上でLinuxの仮想マシンを動かせる技術「WSL」を使います．
#### 手順
今回はLinuxディストリビューションとしてUbuntuを使います．
1. WSLのインストール
    1. アプリ「コントロールパネル」で「Windowsの機能の有効化または無効化」を選ぶ
    1. 2つの項目「Linux用Windowsサブシステム」「仮想マシンプラットフォーム」にチェックを入れる．「OK」を選択後，PCの再起動を求められるので従う
1. Ubuntuのインストール\
再起動後，アプリ「Microsoft Store」を開いて「Ubuntu」と検索．「入手」ボタンをクリックしてダウンロード
1. Ubuntuの初期設定\
Ubuntuを起動する．コンソールの表示に従い，ユーザ名やパスワードを入力
1. パッケージの更新\
コマンドが入力できるようになったら，`sudo apt update`と`sudo apt upgrade -y`を順番に実行

- データ保存先\
`username`という名前のユーザが持つデータは，Windows上のパス`\\wsl.localhost\Ubuntu-22.04\home\username`に保存されています．
- WSLのバージョンアップやマザボの仮想化設定が必要になることも．適宜対応

## 2. Node.jsとnpm
#### 目的
本システムはフロントエンド（クライアント側）とバックエンド（サーバ側）をどちらもJavaScript言語(JS)をベースに実装しました．そこで，JSでプログラムを動作させるためにJS実行環境「Node.js」を用います．\
また，本システムは要求実現のために多くのライブラリを使用します．ライブラリやそのバージョンの管理性を上げるために，パッケージ管理システム「npm」を用います．

>※ここが一番重要な環境構築ですが，バージョンやデバイスの違いによって以下のコマンドでも正常にインストールできないことがあります．「論文に示したバージョン」または「LTSバージョン」であれば動くはずなので，とりあえずどちらかをインストールすることを目標にしてください．

#### 手順
1. Node.js/npmのインストール\
Ubuntuのターミナルを開き，`sudo apt install nodejs`と入力
2. npmの更新\
インストール後，`npm -v`でnpmのバージョンを確認する．バージョンが古い（例えばv5.6以下）場合は，`sudo npm install -g npm@latest`でnpmを最新バージョンに更新する．

## 3. Gitとクローン
#### 目的
このシステムを手元で動かすには，手元にそのソースコードが必要です．ソースコードはGitHubにアップロードしてあるので，これを手元にコピー（clone）するためにGitを使います．
#### 手順
1. Gitのインストール\
Gitをインストールする．Ubuntuのターミナルを開き`sudo apt install git`と入力
1. Gitの初期設定（不要かも？） \
ユーザの名前とメアドを設定する．以下両方のコマンドを入力
```
git config --global user.name [任意のユーザ名]
git config --global user.email [任意のユーザ名]
```
3. Tacoのクローン
Tacoをクローンする．以下のコマンドを入力
```
git clone https://github.com/pkmiya/Taco.git
```

## 4. データベース
#### 目的
To-do管理システム（Webアプリ）としてユーザやTo-doのデータを保管するためにデータベースを用意します．今回は，学内サーバとして使用中のRaspberryPiとの相性から「MariaDB」を採用しました．
#### 手順１：MariaDBの初期設定
1. 依存パッケージのインストール\
MariaDBが依存するパッケージを先にインストールする．Ubuntuのターミナルを開き以下のコマンドを入力
"""
sudo apt install dirmngr ca-certificates software-properties-common gnupg gnupg2 apt-transport-https curl -y
"""
1. MariaDBのインストール\
MariaDBをインストールする．`sudo apt install mariadb-server mariadb-client -y`と入力
1. MariaDBの起動\
MariaDBの起動状態を確認する．`sudo service mysql status`と入力し，「running」と表示されたら既に起動しているので，次へ進む．\
ただし，「stopping」と表示されたら起動していないので，`sudo service mysql start`と入力しSQLサーバを起動する．
1. セキュリティスクリプトの実行\
SQLサーバの安全性を高めるよう設定を変更する．`sudo mysql_secure_installation`と入力\
    1. Enter current password for root\
    何も入力せず「Enter」キーを押す
    2. Set root password?\
    「n」と入力して「Enter」キー
    3. これ以降の設定では，全て「y」と入力して「Enter」キーでよい\
    （匿名ユーザやテスト用データベースが削除されるが問題ない）
1. パスワード認証方式への変更\
Ubuntuは，デフォルトではMariaDBのroot認証に「UNIX経由である`unix_socket`方式」を採用しています．安全で使いやすい一方，運用が複雑なため，root認証方式を「パスワードを用いた`mysql_native_password`方式」へと変更します．\
    1. SQLサーバへログイン\
    SQLサーバへログイン．`sudo mysql -u root -p`と入力
    2. ユーザ認証方式の変更
    SQLサーバへ接続できたら，以下5行のコードを順に入力する．
    3. パスワードの設定
    認証方式をパスワードへ変更し，rootのパスワードを**my_password**として設定する．`set password for 'root'@'localhost'=password('my_password');`と入力
    4. 権限の更新
    コマンド`flush privileges;`を入力

最後に，パスワードでログインできるか確認します．`mysql -u root -p`の後に(SQLサーバの）rootのパスワードを入力し，ログインできれば成功です．

#### 手順２：データベースの作成
1. データベースの作成\
SQLサーバにログインした状態で，コマンド`CREATE DATABASE tacoclass`を入力します．
2. データベースの選択\
DBの閲覧や操作は「どの」DBなのかを指す必要があります．そのため，コマンド`USE tacoclass`と入力して今作成したDBを選択します．このコマンドを叩くことで，コマンドラインの表示が`MariaDB [none]>`から`MariaDB [tacoclass]>`に変わったかと思います．
3. テーブルの作成\
以下のソースコードをコピペしてテーブルを作成します．
```SQL
CREATE TABLE members (
  id INT(11) NOT NULL AUTO_INCREMENT,
  team_id INT(11) NOT NULL,
  uid CHAR(50) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY team_id (team_id)
);

CREATE TABLE teams (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name CHAR(10) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE todos_private (
  id INT(11) NOT NULL AUTO_INCREMENT,
  content CHAR(50) NOT NULL,
  uid CHAR(50) NOT NULL,
  dead_line DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  memo TEXT,
  is_done TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id)
);

CREATE TABLE todos_shared (
  id INT(11) NOT NULL AUTO_INCREMENT,
  team_id INT(11) NOT NULL,
  content CHAR(50) NOT NULL,
  dead_line DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  memo TEXT,
  is_done TINYINT(1) DEFAULT 0,
  PRIMARY KEY (id),
  KEY team_id (team_id)
);

CREATE TABLE todos_shared_status (
  id INT(11) NOT NULL AUTO_INCREMENT,
  todo_shared_id INT(11) NOT NULL,
  member_id INT(11) NOT NULL,
  is_done TINYINT(1) DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY todo_shared_id (todo_shared_id),
  KEY member_id (member_id)
);
```

## 5. Firebase
#### 目的
このシステムでは，Googleアカウントを用いてユーザの認証と管理を行います．そのために，Googleが提供するプラットフォームFirebaseを利用します．
> ３者win-winなシステムになります（ユーザはGoogleアカウントさえあれば別途アカウント作成の必要がない．学校側はGoogle Workspaceを導入していればユーザを一括管理できる．開発者は実装の手間が省けてセキュアなユーザ周りの実装ができる）．

#### 手順１：Firebaseコンソールでの設定
1. [Firebase](https://console.firebase.google.com/u/0/)にアクセス\
お好みのアカウントでOKです（学校用アカウントでも良いが，卒業後に消える）
1. プロジェクトの作成
    1. 「プロジェクトを追加」を押す
    1. プロジェクト名を入力
    1. Googleアナリティクスはチェックを外す
1. Googleアカウント認証の有効化
    1. 左側タブの「Authentication」をクリック
    1. メイン画面タブの「Sign-in method」をクリック
    1. 「新しいプロバイダを追加」をクリックし，「Google」を追加
1. Googleアカウント認証の設定（フロントエンド）
    1. 左側タブの歯車アイコン「プロジェクトの設定」をクリック
    1. メイン画面タブの「全般」をクリック
    1. 画面下部にスクロールして項目「マイアプリ」を見つける
    1. 「アプリを追加」をクリックし，ソースコードアイコンをクリック
    1. SDKの設定と構成で「npm・CDN・Config」のうち「npm」を選択
    1. SDK用ソースコードが表示されるので，`const firebaseConfig = `後の{}内をコンテンツをコピーしておく（設定①とします）
1. Googleアカウント認証の設定（バックエンド）
    1. 左側タブの歯車アイコン「プロジェクトの設定」をクリック
    1. メイン画面タブの「サービスアカウント」をクリック
    1. メイン画面左側で「Firebase Admin SDK」をクリック
    1. Admin SDK構成スニペットで「Node.js・Java・Python・Go」のうち「Node.js」を選択
    1. 「新しい秘密鍵の生成」をクリック
    1. JSONファイルがダウンロードされるので，とっておく（設定②とします）

#### 手順２：Ubuntuでの設定
1. フロントエンド（以下，`frontend`ディレクトリ内の作業です）
    1. 修正：`package.json`ファイル\
    5行目の`proxy`プロパティを`"http://localhost:8080"`に修正．また，64行目の`homepage`プロパティを削除．
    1. **修正**：`src/firebase.js`ファイル\
    12-17行目`const app = initializeApp({ ... })`内を設定①のコードに置き換える
    1. 修正：`src/Components/modules/axios.js`ファイル\
    4行目の`baseURL`プロパティを`"http://localhost:8080/api"`にする
2. バックエンドの書き換え（以下，`backend`ディレクトリ内の作業です）
    1. **修正**：`index.js`ファイル\
    19行目`var serviceAccount = require("")`の""内を，設定②のファイル名に書き換える
    1. **移動**：`.json`ファイル\
    設定②ファイルを`/backend`直下に置く
    1. **追加**：`.env`ファイル\
    .envファイルを作成し，以下のコードを記入する．ただし，`my_password`部分には自分が設定したパスワードを設定すること

```js:.env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=my_password
DATABASE_NAME=tacoclass
```

---

# 開発の進捗状況
### 注意点
- Safariで開けない
- リロードすると固まる（URLの`/home`を削除して再アクセスできる）
- 学内限定

### 開発予定
- 教員用機能
- 通知機能