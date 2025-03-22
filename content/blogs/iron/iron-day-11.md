---
title: Vue的nextTick-DOM更新後的回調 
date: 2024-09-24
description: 掌握到Vue Virtual DOM狀態已經更新的API-nextTick。
image: /iron/day11/iron-day11-logo.png
alt: Vue-NextTick
ogImage: /iron/day11/iron-day11-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue的nextTick-DOM更新後的回調

## 今日學習重點:

1. 理解`nextTick`的作用
2. ` nextick`的執行時間點小陷阱-Virtual DOM更新後、還是真正瀏覽器渲染重繪後?
3. 為什麼`nextick`可以確保在其他響應式資料更新流程後面執行?



-----
## nextTick

`當你需要在Vue的響應式資料狀態更新後，立即存取更新後的 DOM 時，可以使用nextTick。`

使用上類似允許你在下一個 DOM 更新周期後執行一個回呼函式，或者透過 await 來等待 DOM 更新完成，如此便能確保你的程式邏輯能夠在 DOM 更新後正確執行。

常見例子是假設你有一個動態新增的項目列表，並且想在每次新增一個項目後，希望獲取到最新的列表DOM結構，並自動滾動到最下方最新的元素。([範例](https://play.vuejs.org/#eNp9U89rE0EU/lceq5AU88O2nmJa1Fqwgla0N1fodneSTDuZWXZm04QQKEih0kK9NB6qoh70oqUHDxGhf013i/+Fb2Y26aZoDyGz733ve9/73kzfuR+GlU5MnJrj8roi7ZB5iiy6HKAe0A5EpLHgOoxKtSS48ignkeuAzzwps3jZv0yYuqyyU26ICDFFiqwloDwg3Rn8A/0tkaS2RXqYN4mrnBozoQPo900VDAZZgyp2sCIvTxuxUoLDPZ9RfwuJvCBYsTTp8DT58vHPp92L45N61eKwpl7NzYuf0o9oqEASFYcYoe1QRAr62oMScNJVa0gMA2hEog0FNK1wV9dVq5Acvk6PRsneh+TbfnIwdDl6IpWdFBY0QfFlwfaH2UIJxue53Hm+8GoG+WzllOEZA48Z0wjTMT/S+ehr+vss2T9K9k7T9zvno/10+GvMlLmAHJ7scR+KM7CwCH3tmJFX6XgsJpUwlq3ieiblZj+fYoQ3VQtuwexg3fYHQAUXP94kZ7vY7Hy0k37/DA9Xn0B6/FMLOzlI995qmLftUTWxrpirTg6Hydk7U/Qf+QB2gMn1whGmbLHykNIgsxjuUDC2JkJEX40+IrTZUlgwwF+9atedrV71GAHpi5AEGKlMX2xrV9vrlluGogZzt2+HXdNadEjUYGK73KuBFythghsiCkhUg9mwC1IwGsAN3/d15zG3uc6GNsQNUd5E8JjSVpc3BN7T9hRJEASWBNVrxYtOyVGomjdos7IpBcdnbEhdxxftkDISrYaKoo+uU7PtdM5jKPixiakoJqVx3G8Rf+sf8U2JD7SGh2cRkSTqENeZ5JQXNYmy6eUXT3HVuWRbBDFD9DXJ5wRni7VGC3sQ8wBl53BG7Yp5jOjTmlzuKsLleCgtVCMHBu86+CyXrhn9Uu585Y6pQz+dwV/Ms+K+))

```
<template>
  <div ref="listContainer" class="list-container">
    <div v-for="(item, index) in items" :key="index" class="list-item">
      {{ item }}
    </div>
  </div>
  <button @click="addItem">新增項目</button>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// 參數初始化
const items = ref(['項目 1', '項目 2', '項目 3']);
const listContainer = ref(null);

// 新增項目並滾動到最下方
const addItem = async () => {
  items.value.push(`項目 ${items.value.length + 1}`);

  // 等待下一次 DOM 更新完成
  await nextTick();

  // 取得 DOM 並滾動到最下方
  const container = listContainer.value;
  container.scrollTop = container.scrollHeight;
};
</script>

<style scoped>
.list-container {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
}
.list-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}
</style>
```

-----

## 陷阱? nextick 本身是在virtual dom 更新後，瀏覽器更新前執行

不過你們有沒有發現 nextick 所謂的DOM的更新後執行，是指Virtual DOM更新後，  
還是真的等到瀏覽器重繪掛到瀏覽器的DOM更新之後?

用下面這個[Stack overflow](https://stackoverflow.com/questions/47634258/what-is-nexttick-and-what-does-it-do-in-vue-js)有人提出的有趣的例子:

```
<template>
  <div class="hello">
    {{ msg }}
  </div>
</template>

<script setup>
import {ref,onMounted, nextTick} from 'vue'
const msg = ref('one')

onMounted(()=>{
  msg.value = 'two'
  nextTick(()=>{
    msg.value = 'three'
  })
  // 改用這段的話 反而畫面瀏覽器會重繪渲染閃一下看到 'two'，再變成'three'
  setTimeout(()=>{
     msg.value = 'three'
  },1)
})
</script>
```
### 使用nextTick

- **程式碼步驟:**

1. 我們在onMounted階段對msg資料進行更新變更為`two`，`Vue的響應式系統會同步收集更新，進入更新排程柱列(schedule Job queue)`

2. 如果你是使用`nextTick()`，裡面的回調會在上述Virtual DOM資料更新完後執行，但此時還未進入瀏覽器渲染任務queue中，因此Vue會再將msg資料進行更新變更為`three`再次排入資料更新微任務排程，一併將最終更新到瀏覽器畫面上。 有點像一段下面虛擬程式碼的感覺:

```
new Promise((resolve, reject) => {
  // onMounted階段
  msg.value = 'two'
  resolve();
})
  .then(() => {
    // nextTick 階段
    msg.value = 'three'

    console.log("Do this");
  })
```


`nextTick()`其實是`Vue Virtual DOM更新完執行的回調函式`，不然的話你會先看到'Two'掛到瀏覽器上面才對，但這裡的瀏覽器畫面一次顯示到`three`。

其實也跟nextick()本身是`Promise微任務`有關，昨天有提到，在事件循環過程中，微任務佇列中的任務會一併清空，這應該也是nextTick()再一次對響應式資料更新後，可以一併在瀏覽器渲染的原因。


### 使用setTimeout

如果你是使用`setTimeOut`，裡面的回調執行時機通常會在瀏覽器渲染後再進入新的event loop再執行一次，因次畫面很容易看到先跑出`two'，再出現'three'。

setTimeout 屬於`宏任務`，而Vue響應式數據更新如 msg.value = 'Two' 則是Vue收集數據更新進入`微任務`排程更新，會在宏任務之前就被處理。

- **為何 setTimeout 影響重繪?**

`setTimeout`放入了`宏任務隊列 (MacroTask queue)`，而畫面渲染是在每次事件循環中的 MicroTask queue 之後才進行。

因此：

第一次重繪：由於 msg.value = 'two' 是Vue響應式系統利用微任務排程去更新Virtual DOM，之後會先觸發一次重繪，顯示 two。

第二次重繪：setTimeout 宏任務執行後，msg.value 被設為 'three'，這個變化會觸發第二次畫面更新，因此會看到閃爍的效果。

## 事件循環Event Loop和瀏覽器渲染render queue重繪關係

用這張圖應該會更能理解事件循環中宏任務和微任務，在瀏覽器畫面更新的步驟流程:

同步任務 > 微任務 > DOM渲染到瀏覽器 > 宏任務

![https://ithelp.ithome.com.tw/upload/images/20240924/20145251alaUr3ScMp.png](https://ithelp.ithome.com.tw/upload/images/20240924/20145251alaUr3ScMp.png)

([圖片出處](https://dev.to/princam/javascript-event-loop-simply-explained-5d75))


-----

## nextTick 和Vue資料異步更新具體是如何協調工作的？

閱讀到這邊會發覺到Vue的響應式是`利用微任務，去收集所有需要更動數據的變化，放到佇列排隊後更新`，但是同樣nextTick本身也是`微任務promise`構成，Vue是如何確定這兩個微任務排程間，保持著nextTick一定要在Virutal DOM更新後才執行呢?

其實在[Vue源碼runtime core-schedule模組](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts#L59)可以找到nextick()本人的蹤跡:

`currentFlushPromise` 其實是Vue響應式資料當前更新佇列的 Promise任務，它會在 DOM 更新完成後 resolve，所以我們擺放在nextTick()中的回調函式，會在Virtual DOM更新後才被執行。

因為網路很多源碼解釋文章很複雜，讓人暈頭轉向的，不過具體白話來說，Vue透過`promise.then`的機制確保響應式資料的比較差異更新過程任務先執行，避免和`nextTick`執行順序的混亂。

```

export function nextTick<T = void, R = void>(
  this: T,
  fn?: (this: T) => R,
): Promise<Awaited<R>> 
  const p = currentFlushPromise || resolvedPromise
  return fn ? p.then(this ? fn.bind(this) : fn) : p
}
```

下面這張圖說的[文章](https://juejin.cn/post/7179077094754746426)滿棒的，幫我們總結到目前為止，理解到的響應式資料從更新到最終畫面渲染過程的核心概念，也有帶入`nextTick`在其中的參與流程:

-**資料變更 (setter)：** 
當響應式資料發生變更時，Vue 不會立即更新 DOM，而是將變更加入到更新佇列 (queue) 中等待處理。

-**Virtual DOM 比較和更新：** 
在同一個事件循環中，Vue 會等待所有響應式資料的變更完成後，進行一次 `Virtual DOM 的比較 (diffing) 和更新操作`，這一步會計算哪些 DOM 元素需要變更。

-**nextTick 調用：** 
當我們在資料變更和Virtual DOM更新後才調用 `nextTick`，Vue 會將回調函數 (callback) 加入到微任務隊列，並保證這些回調函數會在 DOM 更新完成後才執行，`這樣可以確保在 nextTick 的回調中能夠正確地操作更新後的 DOM 元素。`

-**瀏覽器DOM渲染：**
在微任務執行完畢後，瀏覽器才會進入進行真正的DOM渲染和畫面重繪(repaint)。


![https://ithelp.ithome.com.tw/upload/images/20240924/201452512c7LDT4x5O.png](https://ithelp.ithome.com.tw/upload/images/20240924/201452512c7LDT4x5O.png)



-----
## 總結:

1. `nextTick` 並不是專門用來獲取 DOM 渲染完成後的最終畫面狀態使用，而是用來確保在 Vue 完成 響應式數據變更後 的`下一個更新周期（微任務）執行回調函數`，也是所謂的tick。

2. 功能面來說，它能確保我們的回調函數在 Vue 更新完 Virtual DOM 並同步好數據後執行，但要注意瀏覽器的 DOM 可能還沒有真正完成渲染一點點小小的細微陷阱。



-----
## 學習資源:
1. https://vuejs.org/guide/essentials/reactivity-fundamentals.html#dom-update-timing (官方提及DOM updating time)
2. https://stackoverflow.com/questions/47634258/what-is-nexttick-and-what-does-it-do-in-vue-js
3. https://juejin.cn/post/7179077094754746426
4. https://www.youtube.com/watch?v=RxBuXTlUsTQ
5. https://www.everseenflash.com/CS/Frontend/Vue 


