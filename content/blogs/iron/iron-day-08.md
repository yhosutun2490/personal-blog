---
title: Vue的數據監聽器-watch和watchEffect 
date: 2024-09-21
description: 認識Vue的數據監聽器-watch和watchEffect，兩者的差異 。
image: /iron/day8/iron-day8-logo.png
alt: Vue-Watch-And-Watch-Effect
ogImage: /iron/day8/iron-day8-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue的數據監聽器 - watch 和 watchEffect 

Vue `computed` 計算屬性，可以幫助我們對於響應式數據做一些衍伸計算，同時有緩存功能，不過最大主要限制是不能處理一些程式副作用。
今天來談談Vue提供的另一項API:`watch`和`watchEffect`，可以處理一些副作用

## 今日學習重點:

1. 理解Vue監聽器基本使用- 深層監聽設定等
2. watch和watchEffect的差異性
3. 監聽器的配置選項



-----
## 監聽器的作用

監聽器在 Vue 中主要用來處理一些副作用。當監聽的數據發生變化時，監聽器會執行回調函數，這個過程往往涉及對外部世界產生影響的行為（副作用），比如發送 API 請求、寫入瀏覽器的 localStorage、記錄日誌、進行數據處理等。

## 副作用(side effect)是什麼?

副作用（Side Effect）是指在執行某個操作時，除了返回預期的結果外，還會影響到外部環境的變化。這些影響可能包括`修改外部變數`、`打API向伺服器獲取資料`、`操作 DOM`、`讀寫系統檔案`等，這些都是程序執行之外產生的「額外」效果，會讓程式碼行為不可預測也不好測試。

簡單來說，當一個函數除了做它主要應該做的事之外，還會去影響到外部的狀態或其他物件，就算是產生副作用。


```
let count = 0;

function increment() {
  // 副作用：修改了外部的變數 count
  count += 1;
}

increment();
console.log(count);  // 輸出 1，這是因為 increment 函數改變了外部的變數

```

在 Vue 的 `watch`中，可以監聽某些響應式數據變化時，去觸發一些外部行為，比如 API 請求、DOM 操作或是外部資源連結操作，像下列程式碼這樣:

```
<script setup>
import { ref, watch } from 'vue';

const count = ref(0);

// 監聽 count 值的變化，並觸發副作用：寫入 localStorage
watch(count, (newCount) => {
  // 副作用：寫入 localStorage
  localStorage.setItem('count', newCount);
});
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
  </div>
</template>
```


-----
## 監聽器的特性

- 深層監聽

這裡深層監聽細節有一些不太一樣的地方，如果是使用`reactive`，資料型別是物件的話，watch本身預設會深層監聽內部所有屬性變動。

但如果使用的是`ref`，就必須在監聽器選項裡設置`deep`，讓Vue監聽所有內部屬性變化。

- reactive

```
import { reactive } from 'vue';

const state = reactive({
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001'
    }
  }
});
watch(state, (newValue, oldValue) => {
  console.log("觸發watcher")
})

// 直接修改深層嵌套的屬性 會觸發回調函式
state.user.address.city = 'Los Angeles';
```

- ref

```
import { ref, watch } from 'vue';

const state = ref({
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001'
    }
  }
});

// 監聽 state 的變化
watch(state, (newVal) => {
  console.log('State changed:', newVal);
}, { deep: true });

```


-----

## 提取物件內部屬性單獨進行操作時，需使用getter function指定來源，讓監聽器正確監聽

當引用`reactive`或是`ref`物件內部的屬性時，如果想確保變更被正確追蹤，應該透過 reactive 物件的 `getter，一種對原始響應式物件做取值的內部getter函式`，而不是通過解構後的引用來操作。這樣 Vue 的響應式系統才能透過內部攔截功能(track)來監測到變化。

```
import { reactive, watch } from 'vue';

const state = reactive({
  user: {
    name: 'John',
    address: {
      city: 'New York',
      zip: '10001'
    }
  }
});

// 監聽整個 user 物件的變化
watch(
  () => state.user.address;, // 這裡就是所謂的getter function 
  (newVal, oldVal) => {
    console.log('User changed:', newVal);
  },
  { deep: true }
);

// 如果直接操作 user.address 的引用
const userAddress = state.user.address;
userAddress.city = 'Los Angeles';  // 不會觸發 watch 回調
```



-----
## watchEffect()

`watchEffect`是Vue提供一個進階監聽多個數據來源變化的API，提供給開發者另一種選擇:

**特點:**

- 不需要特別定義監聽對象，會自動追蹤在回調裡面用的的響應式數據來源
- 回調函式沒有放參數 (沒有newVal 和oldValue可以用)
- 元件掛載(mounted)後就會執行- egaer wathcer

這邊用官網比較的案例:

**watch的寫法**

```
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)
```

**watchEffect的寫法**

`watchEffect` 把`todoId`移到回調函式內，監聽器會自動追蹤所有用到響應式數據源的變化，並執行回調函式。

```
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
   console.warn(`current data value is: ${data.value}`) //這裡其實追蹤不到，不會在觸發回調執行
})
```

`⚠️⚠️⚠️限制!: 只在同步程式碼範圍內，因為Vue的設計資料收集追蹤過程屬於同步收集，這樣才能確保每一段觸發更新過程收到的資料變化保持穩定，如果納入非同步後的watcher依賴項，會變成不穩定。`

先掌握Vue一個原則就行: `同步收集數據變化和依賴，非同步更新畫面`，就能稍稍理解`watchEffect`不連非同步部分一起等待追蹤的設計思維。



-----


可以看到`watchEffect`對於需要監聽多個數據源很方便，不用像`watch`一個個掛入依賴追蹤源，其實`watch`也做得到多個數據源追蹤，實務上是用`陣列`當作`watch依賴來源`也是可以。


**時間選擇器選擇案例**:

使用者點選一段時間區間，有起始時間和結束時間，任一個時間變動會去query下一段資料，因為兩個響應式資料變動後要執行的事情都一樣，所以利用`watch`一起監聽，並執行同段fetch資料的共同邏輯。
![https://ithelp.ithome.com.tw/upload/images/20240921/201452514dYlhoywRt.png](https://ithelp.ithome.com.tw/upload/images/20240921/201452514dYlhoywRt.png)


```
<template>
  <div>
    <label>開始時間：</label>
    <input type="datetime-local" v-model="startTime" />

    <label>結束時間：</label>
    <input type="datetime-local" v-model="endTime" />

    <button @click="fetchData">查詢資料</button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 定義兩個時間選擇器的響應式數據
const startTime = ref('');
const endTime = ref('');

// 監聽起始時間和結束時間的變化
watch([startTime, endTime], ([newStartTime, newEndTime]) => {
  if (newStartTime && newEndTime) {
    // 當起始時間和結束時間都有值時，觸發資料查詢
    fetchData();
  }
});

// 資料查詢的函數
function fetchData() {
  console.log('Fetching data for time range:', startTime.value, 'to', endTime.value);
  // 實際資料查詢邏輯可以在這裡實現，比如發送 API 請求
}
</script>

```


-----

## 監聽器基本配置選項

在 Vue，`watch` 和 `watchEffect` 可以通過配置項來定義更詳細的監聽行為，可以更靈活地控制監聽邏輯，稍微介紹一下比較常用的監聽器配置項：

- immediate: 是否在第一次渲染時立即觸發回調

`watch 預設值為 false 懶執行`，不會在元件掛載時自動執行，需要設置為 `true`，watch才會在監聽對象初始化時立即執行回調。

`watchEffect本身是eager`，元件掛載時會立刻執行一次，兩間這裡使用特性上有一些不同囉。


```
watch(
  () => state.value,
  (newVal, oldVal) => {
    console.log('Value changed:', newVal);
  },
  { immediate: true }  // 會立即觸發一次
);
watchEffect(
  () => {
    console.log(state.value);
  })  // 元件掛載時就會觸發

```
- flush: 設置回調的執行時機：

參數配置很多，先理解就行了，主要是設定監聽器的回調函式要在DOM更新前或更新後執行，後面幾天文章會深入探討

**post**: 回調會在 Vue Virtual DOM 更新後執行。
**pre**: 回調會在 Vue Virtual DOM 更新前執行（預設值）。
**sync**: 回調會同步執行，即數據變化後立即執行。

```
watch(
  () => state.value,
  (newVal, oldVal) => {
    console.log('Value changed:', newVal);
  },
  { flush: 'pre' }  // 在 DOM 更新之前觸發
);
```


-----

## watch vs. watchEffect 怎麼選擇?

||watch|watchEffect|
|---|------------|---------------|
|監聽數據量|一個或多個(需先定義)|一個或多個|
|回調caback執行|有定義的追蹤變數變化才執行|會自動追蹤回調中使用到的響應式數據源|
|效能|數據結構複雜或有大量響應式數據時，指定具體的依賴項能夠避免不必要的響應式系統開銷。| 會自動追蹤回調中所有使用到的依賴項，但當回調中使用了較多的數據源時，可能會有性能損耗。|
|使用時機|當你需要對具體的數據源 進行精確的監聽。|自動追蹤回調中的所有響應式數據。當你需要監聽多個數據源且希望簡化代碼時。|




-----

## 總結:

今日內容可能比較偏向基礎，但也有一些小細節希望有幫助到大家，也算是為了後續理解Vue在收集這些數據變化時，到底怎麼追蹤並更新到畫面上做些複習回顧。



-----

## 學習資源:

1. https://cn.vuejs.org/guide/essentials/watchers
2. https://medium.com/@marsuo52_70945/vue3-watch-watcheffect%E6%80%8E%E9%BA%BC%E7%94%A8-208b2ab2ea0c
