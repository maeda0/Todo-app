# ベースイメージはNode.jsのLTS版を使用（ここでは18-alpineが軽量で推奨）
FROM node:22-alpine

# コンテナ内の作業ディレクトリを設定
WORKDIR /app

# package.json と yarn.lock をコンテナにコピー
# これにより、依存関係のインストールをキャッシュし、ビルド時間を短縮します
COPY package.json yarn.lock ./

# 依存関係をインストールします。
# --frozen-lockfile は yarn.lock に厳密に従ってインストールすることを強制します。
RUN yarn install --frozen-lockfile

# プロジェクトの残りのファイルを全てコンテナにコピー
COPY . .

# Vite 開発サーバーはデフォルトで 5173 ポートを使用します。
# このポートをコンテナ外に公開することをDockerに伝えます（情報的なもの）
EXPOSE 5173

# コンテナ起動時に実行されるコマンド
# yarn dev --host は、コンテナ外部からのアクセスを許可し、開発サーバーを起動します
CMD ["yarn", "dev", "--host"]