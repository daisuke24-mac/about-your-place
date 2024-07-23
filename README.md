This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Version Management

### 24-07-06    0.1.0
    ひな型ファイルの準備

### 24-07-11    1.0.0
    Googlemapを表示させるためMapComponentを作成
    マップ上にピンを表示させるためPinを作成、MapComponentにピンを追加
    TOPページにMapComponenを追加して、マップの表示ができるようにした
    TOPページにピンを追加する機能とピンの位置に移動するボタンを作成
    TOPページに保存されたピンの数と現在示しているピンを表示
    TOPページに中心の緯度と経度を表示

### 24-07-17    2.0.0
    autoCompleteを追加して検索窓とオートフィル機能を追加
    Descriptionを追加してGeminiAPIとの連携、土地に関するスクリプトを表示する機能を追加
    CollectDescriptionを追加してmongoDBとの連携、アイテムの探索・登録を行う機能を追加
    DBとの連携のためdatabase.jsとschemaModels.jsを追加

### 24-07-17    2.1.0
    デプロイのためDescription/route.jsをutilsに移動、route.js→gemini.jsに変更
    上記の変更に合わせてパスを修正
    console.logをすべてコメントアウト

### 24-07-17    2.2.0
    components/MapComponent/route.jsをcomponents/mapComponent.jsに修正
    components/Pin/route.jsroute.jsをcomponents/pin.jsに変更
    上記の変更に合わせてパスを修正

### 24-07-23    2.3.0
    本番環境からDBにアイテムを登録できない問題を修正
    PinとMapPinを統合
    テキストを英語表記に変更
    LandInformationを宣言
    不要なコメントアウトの削除
    環境変数をまとめるためconfig.jsのひな型を追加
    _app.js、_document.jsの配置を変更
    page.jsとmapComponent.jsにそれぞれ機能と表示を分割
    LandInformationに最小化・最大化ボタンを追加
    const ~ export defaultをexport default functionに統一
    各種ボタンやコントロールパネルなどのUI・UXを修正
    それに合わせてフォントや画像のインポートを追加
    JSファイルに直接記載されていたCSSスタイルをCSSファイルに移動
