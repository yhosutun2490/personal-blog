---
title: Vue 監聽器的執行時機點 
date: 2024-09-22
description: 認識Vue的數據監聽器執行的時間點細節 。
image: /iron/day9/iron-day9-logo.png
alt: Vue-Watcher-Trigger-Time
ogImage: /iron/day9/iron-day9-logo.png
tags: ['Vue','鐵人賽']
published: true
---

# Vue 監聽器的執行時機點 

今天繼續來挖掘對Vue還不熟之前我的一些疑問，深入探討研究Vue監聽器，即便實務上已經使用的很熟悉，跟chatGPT答辯後才發現原來不只是官網，我也忽略掉滿多細節，造成用的時候觀念模稜兩可呢~

相信很多文章或官網已經介紹滿清楚`watch監聽器`功能，主要是監聽某些響應式數據做一些`副作用(side effect)`處理，像是呼叫api、更動其他響應式數據源，不過我比較好奇的是，到底watch執行的時間點是在什麼時候。

## 今日學習重點:

1. Vue watch執行函式的副作用行為是在瀏覽器更新之前還之後呢? 
2. watch 選項參數除了deep、immediate外，鮮少使用的flush選項又代表什麼?
3. 短時間觸發watch監聽器的批次更新(batch update)



-----

## 保持元件的純粹，讓元件渲染忠實呈現在畫面上

是來自以前學React官方有提及介紹的關於`純粹元件（pure components）`的描述觀念:

1. 給定相同的 prop 或內部響應式資料來源，元件應該始終生成相同的 DOM 結構或模板渲染結果-Same inputs, same output。
2. `應該避免依賴於外部的可變狀態或副作用來影響元件初次在畫面上的渲染`

例如組件的渲染前執行很多API獲取資料、進行原生瀏覽器DOM API的操作，因為必須依賴於這些外部的帶進來的非響應式資料變量，這可能會導致不同步的渲染結果，就會違反這一原則。

像是API呼叫獲取資料等副作用，React的設計思維: `渲染完畫面將資料先放到瀏覽器呈現後再執行side effect，確保不阻塞影響畫面渲染。`

以下張圖來說([圖片出處](https://react.dev/learn/keeping-components-pure#where-you-_can_-cause-side-effects))，我們在元件裡定義好的初始資料，應該忠實地反應在右邊輸出:


![https://ithelp.ithome.com.tw/upload/images/20240922/20145251TYr0AMkEqJ.png](https://ithelp.ithome.com.tw/upload/images/20240922/20145251TYr0AMkEqJ.png) 

如果以Vue來假設行為也是類似的話:

一個SFC組件文件要放到網頁上渲染時，裡面的 `<script setup>`初始化或更新的邏輯，應該保持像是純函式(pure function)般行為，每次丟進去的資料源，產製出來的UI都是穩定一樣。


-----

## watch 監聽器回調函式執行時機點 vs 瀏覽器渲染

那我們來深入watch監聽器執行副作用時，時機點是不是也是如同pure component設計思維般純粹?

回顧一下watch基本用法:

`watch`會監聽一個響應式數據來源(ref 或reactive)，當監聽數據有變化時，會執行`回調函式(callback function)`，同時也提供接收`兩個新舊值參數(newValue、oldValue)`供你作一些額外驗證使用。

```
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // callback回調函式，當前面監聽數據有變化才執行
})

obj.count+
```

`那麼watch回調函式(處理副作用)執行時機點預設運作時機又是如何，會如同React一樣保持到瀏覽器渲染完畢嗎?`

瀏覽器更新前執行回調函式(預設pre模式)✅  
等到最後瀏覽器更新DOM完畢後才執行回調函式(post模式)❌

我們可以另外寫一個[案例](https://play.vuejs.org/#eNp9kb9O3EAQxl9ltI0PneNLlFTId8o/ikRKiBJKN84ydxjWu9bu7HGS5SYRUiLRpEwTkiqioUJCiOe5A96C8fpOXIEoXPj7vpn5zWwtXlVVMvUoNkVKWFYqJxxlGiD96omMhpdSFfJgGEnjNfX7EVgcDyPK7QQpGi2Ofy5+/IL+M3hS1xAy0DSQDrpq7pQO1tqmTtqiInBIvuL/oqyMJai5ZwyHOcm9BsbWlBAxUpRpabSjZdthO7n3dGOldghLWXul2AkteiEf96a52hiO6naZtsIoTJSZ9DIRUvOTi5t/x4vf3xanJ7dXfzIRAxfEEL3d/jA/+n59/nd+9H9+dhnFy0kJ2x6TQmu0OzgjHtfwlw66nUYiFuR40LiYJPvOaL5omJ0JacqqUGi3KyoYJBObEJzWy5Uyh++DRtZjvNLlHsqDB/R9N2u1THyy6NBOkcFXXsfZ2VtfPjLjmlmaXa84/Yj5GflIvmXsYq+93mXstVygfRcerdCTHbc1I9RutVQL2iabkM8Ev+GbR1a/x32evAh1fFHR3AEWhui3)來理解`watch`的行為

我們使用`ref`的捕捉樣板DOM元素的功能，`watch 回調函式(callback function)內容去捕捉樣板DOM元素內容`。

你會發現一直抓到舊的DOM元素內容，console.log()顯示內容總是還沒更新前的DOM元素內容，看起來執行`回調函式副作用的行為，會在瀏覽器渲染完成前執行完畢。`

![https://ithelp.ithome.com.tw/upload/images/20240922/20145251QgkJ3hDweK.png](https://ithelp.ithome.com.tw/upload/images/20240922/20145251QgkJ3hDweK.png)

```
<template>
  <button @click='count++' ref='target'>按我 +1 -{{ count }} </button>
</template>
<script setup>
import {ref, watch} from 'vue'
const count = ref(0)
const target = ref(null)
watch(count,(val)=>{
  console.log("watch執行時機點", val, 'DOM元素內容', target.value.innerText)
})
</script>
```


-----

## watch監聽器回調函式執行時機點設定參數flush，預設為pre

在Vue watch 函式中允許你監視一個或多個響應式數據的變化，並在數據變更時執行特定的邏輯。比較特殊的是 Vue 3中的 watch 有一個名為 `flush`的選項，這個選項可以控制監視回調的觸發時機，在瀏覽器渲染的前後:

![https://ithelp.ithome.com.tw/upload/images/20240922/20145251zbRGSeubNk.png](https://ithelp.ithome.com.tw/upload/images/20240922/20145251zbRGSeubNk.png)

 - **flush: pre（預設值）**

`回調函數在 Vue 進行瀏覽器 DOM 更新之前觸發，是watch的預設模式。`

意味著在回調執行的時候，DOM 還沒有根據變更進行更新，所以上面案例按下按鈕捕捉到都是還沒更新的舊DOM元素囉~。

這個模式適合需要在 DOM 更新前執行邏輯的情況，例如在數據變更時執行一些同步處理或檢查。

- **flush: post**

`回調函數在 Vue 進行Virtual DOM 更新之後觸發(註:但在瀏覽器渲染重繪之前執行)`

需要等待 DOM 更新後再執行的操作，尤其是在依賴最新的 DOM 結構進行操作的情況下，像是必須調用瀏覽器API的滾軸行為（例如計算 DOM 元素的大小或位置，滾到最新的對應位置）。

 - **flush: sync**

`回調函數會在數據變更的那一刻立即同步觸發。這與其他兩個模式不同，它不會等待 Vue 的下一個異步 DOM 更新循環。`

這適合需要立即響應數據變化的情況，`因為會高頻率觸發回調，應該謹慎使用，因為它可能會影響性能或造成一些預料外的副作用。`



-----

## watch 的批次更新(batch update)

`flush: pre`和`flush: sync` 看起字面上意思很像，但`flush: pre` 模式多了個`批次更新(batch update)`處理，來看一段在[Vue社群討論區有人討論的案例](https://github.com/vuejs/core/issues/5721
): 

也有[完整案例程式碼](https://play.vuejs.org/?source=post_page-----e5fcd315b307--------------------------------#eNqdVNtu2zAM/RVCGFAXMdwB21OWBNiGPmzALtj2Ng2o4tCJW1sSdEkzGP73kXLqXFB0W58s8pA8hxStTry1tthGFFMx86WrbQCPIdqF1HVrjQvQgcMqh3sVyk1OZ1WGeos5GP3JRB1wBT1UzrRwQWUu3kgNIHVptA9gYrAxwHzMyjqGrcMpSCFFzpb/rcsj0xofRrO/pHoP1VQqVGUv2Tm4lscuqZPG7CeonJBfOWSXMF9A4hykFEQNkznc0DcHNYUXnSq2qonYUwqby70ppb5JvTCRabBozDqTgvNL1TRLVd5JwayU2EHVRL9h1YRLAXvZf5fDvSc9fPgnQad0nPY/fDzcoX86PIOP0w58p6NZYmVoOm0MKtSEDOMZtyQb1ciwp5xMuMyZtedP1vn0VRXQnTP0l6xldjVsL+0tGQFb26iAZAHM6FIWXXeyArxgFEmt9AdkuI1HoWFwR9Dsiqsy7xGXyEXwJLmq18WtN5p+qjR9KUrT2rpB98XulU+He2GM1sncf0y+4CKmvyDlbLC8e8R/63fsk+KrQ49uSxs3YkG5NdIVMXz9/TPu6DyCrVnFhqKfAL8hjTuyxiHsXdQrkn0Ul9R+SE9Drdc//PUuoPYPTbFQjuxTvBT0JLx/ovWD3FfF65RH9yn6P4zTg7k=)，可以玩玩看~

- **案例解釋:**

分別設計了監聽a和b響應式變數的watch監聽器，分別有3種`flush: pre`、 `flush: sync` 和`flush: sync` 模式，我們在組件掛載到瀏覽器上後，調用其中的生命週期函式 onMounted 執行兩次a變數的資料更新 。

`flush: pre 最終只會執行一次回調函式，並且把兩次++操作對響應式資料先集中起來，再一併更新到畫面上`，這就是所謂的批次更新(batch update)，而flush: sync 會執行兩次。

```
<script setup>
import { ref, watch, reactive, onMounted } from 'vue';
  
const output = reactive({
  pre: "",
  sync: "",
  post: "",
});

const a = ref(0);
const b = ref(0);

watch([ a, b ], () => {
  output.pre += `pre, a: ${a.value}, b: ${b.value}\n`;
  console.log("pre callback");
}, { flush: "pre" });

watch([ a, b ], () => {
  output.sync += `sync, a: ${a.value}, b: ${b.value}\n`;
}, { flush: "sync" });

watch([ a, b ], () => {
  output.post += `post, a: ${a.value}, b: ${b.value}\n`;
}, { flush: "post" });

console.log("before mutations");
onMounted(() => {
 a.value++;
 a.value++;
 b.value++;
  console.log("after mutations");
})

</script>

<template>
  <pre>{{ output.pre + "\n" }}{{ output.sync + "\n" }}{{ output.post + "\n" }}</pre>
</template>
```



-----

## Vue批次更新和JavaScript 事件循環(Event Loop)的關係

其實`Vue的批次更新算是一種收集數據變化，和數據相關的副作用一起收集處理的機制`，會透過瀏覽器提供的環境，來達到非同步的處理更新，會跟`JavaScript 事件循環`運作有關，稍微提一下宏觀概念，之後文章有機會作深入介紹:

- **事件循環 (Event Loop)：**

JavaScript 的事件循環機制決定了同步程式碼會優先執行，非同步程式碼則會延後執行。Vue 正是利用這個特性，在同一個事件循環內，將多次資料變動合併處理。

- **Vue的響應式系統：**

Vue 的響應式系統會追蹤資料(Data)與畫面(View)的依賴關係，當資料變動時，變動並不會立即觸發 DOM 更新，而是先將變動記錄在一個排程`佇列中（scheduler）`。
等到`當前事件循環的同步程式碼執行完畢後，Vue 才會統一處理這些變動，最終更新 DOM`。

這樣的設計可以避免多次不必要的 DOM 操作，提升效能。

轉化成流程會有幾個步驟: 

1. 同步程式碼執行
2. 資料變動追蹤 (track)
3. 副作用推入排程佇列（scheduler）記錄變動(trigger effect into queue) 
4. 事件循環結束後，合併變動批次更新，最終瀏覽器更新畫面 DOM 

好像沒有人試著把它畫成比較簡易的圖理解，大概就找到[這篇文章](https://juejin.cn/post/6947296766433705998)的圖，會比較對上面這段話更有感覺~

![https://ithelp.ithome.com.tw/upload/images/20240922/20145251GncizV5GEK.png](https://ithelp.ithome.com.tw/upload/images/20240922/20145251GncizV5GEK.png)



-----

## 總結:

`Vue watch 執行時機點預設是真實DOM更新前完成執行 ，跟React的useEffect設計上不太一樣`，也有多種執行時機點和模式可以依需求選擇。

watch預設有`批次更新(batch update)處理，將多次數據變動收在一起`，在瀏覽器runtime執行時，會在渲染週期內，透過JS事件循環排入主線程式碼中執行，後續再針對`瀏覽器DOM更新`、`render queue渲染圖層`更新等。

發現好多JavaSctipt舊觀念`Event Loop`、`Event queue`、`微任務(MicroTask)和渲染週期(Render Cycle)`等這些觀念，在框架中也會出現呢，有興趣深入了解的話可以用這些關鍵字去作搜尋學習~

[圖片出處](https://blog.xnim.me/event-loop-and-render-queue)

![https://ithelp.ithome.com.tw/upload/images/20240922/20145251lwSWFQLzYK.png](https://ithelp.ithome.com.tw/upload/images/20240922/20145251lwSWFQLzYK.png)

-----

## 學習資源:
1. https://github.com/vuejs/core/issues/5721
2. https://github.com/vuejs/docs/issues/1154
3. https://book.vue.tw/CH1/1-7-lifecycle.html
4. https://docs.w3cub.com/vue~3/guide/essentials/watchers
5. https://blog.xnim.me/event-loop-and-render-queue