---
title: Vue SFC樣板(Template)和渲染函式(Render Function) 
date: 2024-09-15
description: Vue template樣板的本質和渲染函數(Render Function)。
image: /iron/day2/iron-day2-logo.png
alt: Vue-SFC-Template-And-Render-Function
ogImage: /iron/day2/iron-day2-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue SFC樣板 (Template) 和渲染函式 (Render Function) 

## 本篇學習重點:

- Vue的單一元件檔(SFC)如何工作，template 不是直接撰寫 HTML 語法
- Vue 的渲染函式是什麼，和虛擬DOM之間的關係?
- Vue 最小渲染單位是什麼，元件嗎?

---

## Vue 的單文件檔案(Single File Component, SFC)

在 Vue 3 開發中，我們經常使用官方建議的`單文件元件（Single File Component, SFC)`作為開發單位。

SFC 是一種將 `<template`、`<script>` 和 `<style> `用標籤形式組織在一起的文件結構，這樣開發者就可以用類似 HTML、CSS 和 JavaScript 的方式來撰寫元件。透過這種結構化的方式，開發者可以更直觀地編寫和維護元件，同時也能充分利用 Vue 的特性和工具鏈來進行開發。

```
// Vue SFC 基本程式碼
<script setup>
import { ref } from 'vue'
const greeting = ref('Hello World!')
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style>
.greeting {
  color: red;
  font-weight: bold;
}
</style>
```
![render function](/iron/day2/iron-2-2.png "render-function")

這次我們將重點放在上次用作結尾的 Vue 渲染機制圖，並將其作為開頭的主題。
從中可以看到，SFC（單文件元件）的樣板會被轉換成渲染函式（render function），而這其中包含了一個編譯過程（compiler）。

如果你有興趣深入了解，可以直接進入 Vue SFC playground，  
你會發現雖然 SFC 的編寫看起來像是 HTML 代碼，但最終的轉換產物卻並不是 HTML 😯。

SFC 樣板的轉換過程可以概述為以下等式：  
`template` 的最終編譯產物 = `createElement`（生成虛擬 DOM 節點 VNode） + `渲染函式 (render function)`

---
## 樣板(Template)編譯的過程

官方文件中提到，SFC（單文件元件）文件實際上是一種特殊的格式，需要通過` @vue/compiler-sfc` 編譯器來轉換成瀏覽器可以理解的 JavaScript 和 CSS。
這個編譯過程會將 .vue 文件中的 `<template>`轉換為`渲染函式`，並將 <style> 轉換為相應的 CSS 樣式。

編譯器裡主要有一段代碼是所謂的`抽象語法樹（Abstract Syntax Tree，AST)`

![https://ithelp.ithome.com.tw/upload/images/20240915/201452517aa3lvlY0c.png](iron/day2/iron-2-1.png)
([圖片出處](https://medium.com/glovo-engineering/dissecting-vue-3-template-compilation-e01e2b98dafd))


主要功能是將將模板轉換為一個能夠被程式語言處理的結構化數據，像是標籤種類、內容，我記得[chrome瀏覽器V8引擎](https://dev.to/khattakdev/chrome-v8-engine-working-1lgi)其中有一部分也是類似原理，就是將JS代碼轉成AST，之後後續才能進行JS運行和記憶體管理優化等。

樣板被解析轉成AST後，因為變成像JSON結構之後可以產生成為真正的Javascript Render function-渲染函式，至此這段過程是上次有提及的`Vue 編譯器核心代碼(compiler core)`幫我們完成的。

---
## 渲染函式(Render Function)是什麼?

理解到`樣板<template>`最終會被編譯成 `JavaScript 程式碼`後，就能打破在 Vue 裡面直接撰寫 HTML 的迷思。接下來，我們可以稍微探討一下渲染函式的內容：

除了樣板部分，`<script> `標籤內的程式碼會被收集到 `__sfc__ 物件`中。

setup 是 Vue 3 Composition API 的語法糖，我們會在深入響應式系統時再詳細介紹。不過，當我們在 SFC 中定義事件`處理函式（例如點擊事件的 function）`、`ref` 或 `reactive` 等內容時，這些都會被包含在 `setup() 函式`中，而這個函式的回傳值將允許你使用 `__sfc__ 物件`來調用內部的資料和方法，這樣的設計提供了更直觀的方式來組織和使用元件內的邏輯和狀態。

```
// SFC 文件檔編譯後所形成的JavaScript物件
const __sfc__ = {
  __name: 'App',
  setup(__props, { expose: __expose }) {
  __expose();

  const msg = ref('Hello World!')

  const __returned__ = { msg, ref }
  Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
  return __returned__
}
```
--- 
## 渲染函式(Render Function)的主體:

在 Vue 中，渲染函式的主體與生成虛擬節點（VNode）的函式密切相關，例如 `createElementVNode` 和 `createElementBlock` 等，這些函式負責創建虛擬節點。
`虛擬節點（VNode）是虛擬 DOM 的最小單位，這些節點最終會組合成一棵完整的虛擬 DOM 樹。`

嚴格來說，`在 Vue 中最小的渲染單位是虛擬節點（VNode），而不是元件`。

這是因為元件在編譯後可能會由多個虛擬節點組成，形成一個更高級別的抽象物件。

- 虛擬節點是 Vue 進行 DOM 更新的基本單位，它們反映了真實 DOM 的結構。
- 元件則是透過虛擬節點來管理，並且透過一些商業邏輯包裝來呈現其內部的視圖和邏輯。

因此，即使元件是 Vue 中的基本開發單位，真正參與渲染和更新的最小顆粒度應該是這些虛擬節點。

```
// Render Funciton 內呼叫其它創建虛擬DOM的方法
import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, 
vModelText as _vModelText, withDirectives as _withDirectives, 
Fragment as _Fragment, openBlock as _openBlock, 
createElementBlock as _createElementBlock } from "vue"

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock(_Fragment, null, [
    _createElementVNode("h1", null, _toDisplayString($setup.msg), 1 /* TEXT */),
    _withDirectives(_createElementVNode("input", {
      "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => (($setup.msg) = $event))
    }, null, 512 /* NEED_PATCH */), [
      [_vModelText, $setup.msg]
    ])
  ], 64 /* STABLE_FRAGMENT */))
}
__sfc__.render = render
__sfc__.__file = "src/App.vue"
export default __sfc__
```

實際上，Vue 也為開發者提供了一個直接操作生成渲染函式的 API——`h() 函式`。

h() 函式類似於 JavaScript 版的超文本標記語言（Hypertext Markup Language），是一個封裝好的函式，用於生成虛擬 DOM 節點 (createVNode())。  透過 h() 函式，開發者可以直接創建虛擬節點，而不需要操作複雜的底層邏輯，也不用透過撰寫SFC文件檔來做開發。

```
<script setup>
// 引入 Vue 的函式
import { ref, h } from 'vue';

// 定義計數器的狀態
const count = ref(0);

// 按鈕點擊事件處理函式
const increment = () => {
  count.value++;
};

// 渲染函式
const render = () =>
  h('div', { class: 'counter' }, [
    h('h1', '這是一個計數器範例'), // 使用 h() 生成標題節點
    h('button', { onClick: increment }, `點擊我：${count.value}`), // 使用 h() 生成按鈕節點
  ]);
</script>

<template>
  <!-- 使用 Vue 內建的渲染函式 render -->
  <component :is="render" />
</template>
```
雖然 h() 函式提供了高靈活性，但一般開發還是推薦使用 SFC，因為它更加直觀且易於維護。


-----

## 總結:

1. 本篇通過大量的 JavaScript 程式碼解析，打破了 Vue template 是撰寫 HTML 的迷思。

2. Vue 的模板在經過 `@vue/compiler-sfc`編譯後，最終的產物是`渲染函式（render function）`，而不是直接的 HTML。從中我們看到了 `createVNode()` 系列 API 如何生成虛擬節點，以及 Vue 中元件渲染的最小單位是這些虛擬DOM節點。

3. Vue 3 的`編譯核心（compiler-core）`除了負責編譯外，還會在編譯過程中對 Vue template 中的靜態和動態節點進行分類，這樣可以在進入運行核心（runtime-core）時，提升虛擬 DOM 資料更新的計算效率。這種優化讓 Vue 能夠更精確地處理動態變化，提高整體渲染性能。

理解了開頭渲染機制圖中的渲染函式（render function）後，我們就可以開始深入探索 Vue 的響應式系統（reactive system）章節，進一步了解 Vue 如何處理數據變更與自動更新~繼續加油!


-----

## 學習資源:

1. https://medium.com/glovo-engineering/dissecting-vue-3-template-compilation-e01e2b98dafd (介紹Vue渲染函式觀念好文章，必讀)
2. https://www.cythilya.tw/2017/03/31/virtual-dom/ (虛擬DOM觀念加強，超棒)
3. https://www.youtube.com/watch?v=cpGZgKz-SnM (尤雨溪親自講解 Vue Template，超愛~講解超親民~~但為什麼觀看人數超少XD)