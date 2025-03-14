---
title: Vue Create App and Mount
date: 2024-09-14
description: 介紹Vue的起手式和Create App是什麼，Vue的編譯和執行核心初步介紹。
image: /iron/iron-1-1.jpg
alt: Vue-Create-App-and-Mount
ogImage: /iron/iron-1-1.jpg
tags: ['Vue','鐵人賽']
published: true
---
## 起因

嗨~大家好，我是Rafael，從原本的農業領域轉職剛滿1年，目前在AI數據公司擔任前端工程師。

最近自己籌組的Vue3線上讀書會順利結束了🥳，也剛好是以Vue3開發快近1年時間，想說整理自己撰寫的Vue讀書會綱要，並將各主題再深入探討撰寫成文章，會想發起這個心願主要一直心中有個原因:

Vue的官網其實對使用者滿好上手的，正因為如此，許多開發上細節或和正確觀念我們不得而知。也就造成許多初學開發者(包括本人)，知其然而不知其所以然，亂用產生bug而不得其解的情況出現。

大概會以官網一些基本介紹為基底，加入額外文章資源，也會嘗試加入一些SOLID設計準則，希望形成一些火花看看，第一次參加鐵人賽，也希望大家閱讀時能夠給予回饋，教學相長。

## Vue Create App和App.mount是什麼?

* 我們會看到官網起手式，會先 import Vue 套件中的createApp函式，並掛載一個App.vue為頂層根組件，其實createApp算是整個Vue應用程式的進入點，會開始一系列的內部初始化動作。
[官網連結](https://cn.vuejs.org/api/application.html){:target="_blank" rel="noopener noreferrer"}

```js [file.js]{2} meta-info=val
import { createApp } from 'vue'
// import the root component App from a single-file component.
import App from './App.vue'
const app = createApp(App)
```

在專案結構上，一個[單頁式應用(Single Page Application, SPA)](https://www.explainthis.io/zh-hant/swe/spa){:target="_blank" rel="noopener noreferrer"}專案結構，底下可包含更多Vue子元件:

```
App (root component)
├─ TodoList
│  └─ TodoItem
│     ├─ TodoDeleteButton
│     └─ TodoEditButton
└─ TodoFooter
   ├─ TodoClearButton
   └─ TodoStatistics
```

## Mount the App

**Mount**，顧名思義掛載的意思，Vue其實是一個大型JS套件包，可以想像成最終還是要將這些JS產物，掛到瀏覽器這個運行環境(runtime)執行。
官方也會提到 **app.mount** 這個方法的調用應該在整个應用配置和其他資源注册完成後才被调用。
這句話意思是說，如果有使用第三方插件或是註冊根組件，**app.mount 應該擺在入口檔案 index.js 檔案中最後一段執行**，確保掛載到瀏覽器上的需要的功能都正常。

```js [file.js]{2} meta-info=val
import App from './App.vue'
const app = createApp(App)
app.use(Vuetify)
app.use(Pinia)
app.mount('#app')
```

### app.mount api 認識

```js [file.js]{2} meta-info=val
interface App {
  mount(rootContainer: Element | string): ComponentPublicInstance
}
```

* 參數可以是一个實際的 DOM 元素或一个 CSS 選擇器 (使用第一个匹配到的元素)，所選擇到返回根组件的實例。
在瀏覽器運行編譯過的js檔案時，指定容器元素的 innerHTML 將被用作模板填充的位置。 預設是 **id=app的div容器內innerHtml**，Vue會以js調用瀏覽器API操作置換掉。

* 一個app實例，通常僅能調用一次 **mount** 方法，掛載vue實例後，vue還需要負責管理组件的生命周期、狀態和響應數據更新。如果多次調用  **mount** 的可能造成不可預期的交互混亂 。

### 多頁式應用(Multiple Page Application, MPA)

雖然說Vue 主要是以單頁式應用SPA作為主要應用，但並不是說不能做成多頁式應用 。  
只是需要利用createApp創建多個Vue實例，如同官方所建議的。

**MPA專案資料夾**

```
project-root/
├─ public/
│  ├─ index.html
│  ├─ about.html
├─ src/
│  ├─ main.js          // 對應 index.html 的入口文件
│  ├─ about.js         // 對應 about.html 的入口文件
├─ vite.config.js
```

在不同檔案中創建不同的Vue App 實例

```
// main.js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

// about.js
const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

在Vite打包入口檔的設定，可以設定使最終產物產出多份html檔案，可參考roll up文件  
<https://cn.rollupjs.org/configuration-options/#input>

```js [file.js]{2} meta-info=val
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'public/index.html'),
        about: resolve(__dirname, 'public/about.html')
      }
    }
  }
});
```

---

### Vue 的核心組成- compiler core vs runtime core

因為是新手深入篇，所以除了官網既定的介紹外，額外加入了vue 源碼專案上，他們對package的簡介，是採用monorepo形式去開發vue框架的，你一定也稍微聽個 **runtime core/compiler core** 這兩個名詞，可以試著打開Vue的[github](https://github.com/vuejs/core/blob/v3.0.0-alpha.4/.github/contributing.md#project-structure){:target="_blank" rel="noopener noreferrer"}稍微觀察一下。

那麼對vue來說編譯和運行這兩個核心主要負責什麼呢?

![編譯運行核心](/iron/iron-1-1.jpg "runtime vs compiler")
在使用上最大的區別:

如果你是剛接觸vue對它的功能不是很熟悉也沒關係，先理解核心套件會負責這項項目就行，用到再回顧也行。

* **運行器核心 (Runtime Core)**  
 Runtime Core 是 Vue.js 在瀏覽器中運行的核心部分，其檔案體積較小，專注於運行時的功能。通常指的是通過 Vue CLI 或 Vite 打包後的 JavaScript 檔案，這些檔案在瀏覽器中執行。當我們在網頁上與 Vue 應用互動、觸發資料更新時，Runtime Core 會負責響應式系統、組件渲染和虛擬 DOM 的更新操作，從而實現資料和畫面同步更新。

 1. **創建和管理元件的實例(instance)**： 處理元件的生命周期，初始化數據和內部函式方法等。
 2. **響應式系统的操作**： 監控數據的變化並連結相關有用到該資料的副作用effect，並自動更新 Virtual DOM。
 3. **更有效率的DOM 操作**： 虛擬DOM(virtual DOM)比對前後更新差異(differ)，再去調用負責的DOM API更新畫面(patch)。

 > 更有效率的DOM操作不代表框架使用，遠比使用原生JS DOM操作來的便宜，端看應用規模，Virtual DOM建立和運算也需耗費資源，取決於商業邏輯複雜度相較之下值不值得。

* **編譯器核心 (Compiler Core)**

1. 編譯器核心通常主要負責將Vue模板(template)編譯成為JS渲染函數(render function)，  
  可以想像成Vue開發完成後最終要執行的第一份JS code。
2. 我們通常不會在瀏覽器執行環境中執行編譯，因為檔案體積比較大也會影響速度，通常是npm run build需要打包構建js檔，  
  或是你在本地開發環境中修改程式碼時，npm run dev/npm run serve(vue-cli)，熱重載模式(HMR)幫你重新編譯生成新的JS代碼。
3. template模板解析： vue tempalte模板透過AST抽象樹轉為js渲染函數(有興趣可以去搜尋vue tamplate最終到底會變成什麼，後續討論也會納入)

### CSS 預處理器

CSS 預處理的過程並不是 Vue 編譯器的職責，而是由構建工具（如 Webpack、Vite）和對應的 Loader（如 sass-loader、less-loader 等）來處理的。

Vue 編譯器主要處理的是 Vue 特有的模板語法，而 CSS 預處理、JavaScript 模組打包等則由構建工具（如 Webpack 或 Vite）負責。構建工具通過配置不同的 Loader 或 Plugin 來處理各種資源文件的編譯和打包。

Webpack 中的 Vue Loader：需要配置 Vue Loader 並安裝相關插件，特別是在使用 CSS 預處理器時，需要相應的 Loader 配置。
Vite 的 Vue 支持：Vite 已經內建對 Vue 的支持，只需簡單配置插件即可。

```js [file.js]{2} meta-info=val
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()]
});
```

---

### 總結

挑了下面這張圖做本次ending，整個Vue學習也是環繞著它，之後也會常常出現。  

createApp後到app.mount這中間過程，其實還夾著這張圖一大段流程。

官方是擺在進階的渲染機制(Rendering Mechanism)做介紹，不過本次章節已經有觸碰到App.vue元件檔(template)的掛入，到app.mount -> Actual DOM的一些介紹，算是個開頭，後續進入元件化開發(SFC file component)、響應式資料和虛擬DOM(Virtual DOM)研究囉。

![總結圖](/iron/iron-1-2.jpg "resume")
