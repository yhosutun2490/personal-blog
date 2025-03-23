---
title: Vue元件的事件emits和參數props傳遞 
date: 2024-09-26
description: 認識Vue各個元件之間資料如何進行互動。
image: /iron/day13/iron-day13-logo.png
alt: Vue-Props-And-Emits
ogImage: /iron/day13/iron-day13-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue元件的事件emits和參數props傳遞 

## 今日學習重點:

1. Vue Props down, events up原則
2. 避免直接更動props造成不可預期的錯誤
2. 為什麼Vue不推薦以props傳遞函式(function)的模式，作為元件間溝通模式?


-----

## Vue Props down, events up 原則
[Vue 官方文件](https://vuejs.org/guide/components/props.html?source=post_page-----6a3c9e90aab3--------------------------------#one-way-data-flow)建議我們在處理基本元件溝通時，採用Props down, events up 原則，操作上會有`單向數據流(one-way-data flow)`的明顯特徵:

![https://ithelp.ithome.com.tw/upload/images/20240926/201452510jXuhui306.png](https://ithelp.ithome.com.tw/upload/images/20240926/201452510jXuhui306.png)
([圖片出處](https://ithelp.ithome.com.tw/articles/10219990))

### Props Down:

父組件向子組件傳遞數據時，應該通過 `props` 傳遞。父組件將數據通過 `props` 直接傳遞給子組件，子組件僅僅是使用這些數據，而不應該修改它們。這樣可以確保數據流是單向的，易於追踪和維護。

### Events Up:

當子組件需要與父組件進行通信時，應該通過事件來進行。子組件通過 `emits` 發送事件。

然後父組件可以監聽這些事件並做出相應的處理。這種方法同樣保證了數據流的單向性 — — `數據從父組件流向子組件，而事件從子組件流向父組件`。比起props pass funciton這種有點隱性在子組件溝通數據的方式，相對來說開發除錯上會比較明顯。


-----

## 避免直接更動props造成不可預期的錯誤

在 Vue 中直接修改 `props` 是不被推薦的，因為`props`是從父組件傳遞下來的數據，這些數據應該是`不可變的（immutable）`。

直接更動props會影響資料源頭造成難以追蹤。這意味著如果你在子組件中直接修改 `props`，它實際上會改變父組件中的資料源頭。這種違反了 Vue 的單向數據流原則，可能導致數據變更難以追蹤和調試。

比較常見的案例是選擇用`props物件`形式，將同邏輯類型的參數聚集起來，但有可能在後續開發操作上，我們`進行內層物件屬性的異動，Vue雖然響應式資料會更新，但Vue本身的警示機制並察覺不到`。

來用一個[案例](https://play.vuejs.org/#eNqtVEtu2zAQvcqAGzdALAFOVq5iwC4CtF00QdOlNrI0duRSJEFSrgNDuwK9QYHmGt32PG13vUKH1M8G3NQBvBI5bzh8M++JWzZVKliXyMYsMqnOlQWDtlSTWOSFktrCFjQuoIKFlgUMKHXQQdMmGIRTV6MHZh0wa4BYpFIYC1liE7hyJV8MXiPncnD2ch8dNfA2FgCFWY6hThwNzmNRueworJkSR9pYLBRPLNIOIMryNaQ8MeYqZlTTJrlAHTMPEjyFsbuDQPeJGYQtcq/b1WwvZ9QlRSEVp1UU7lxJW2MfOIJJpcLMwz4wYefMUlAs8mWwMlLQhH1Ljlehco76Rtmc2o7ZGDzisIQ6/fTWx6wukVqu4+k9ph8PxFdm42Ixu9VoUK8xZh1mE71EW8PXd+9wQ+sOLGRWcsp+AnyPRvLScazTZqXIiPZOnmf7xmuei+UHc72xKEzblCPqMiufHzNywqsnWu/pXgSX/hzpTVP03jrgz9oySktlyDIZLkjqW7errePE66rbB4VjuLOaaHo2rvbZ8VZSw0uYS52hbj5DU6YpGuqgtY2aeKJ/fjxut7XNqyoKHVEP71Yr5sOL7iBhPJkjh4XUhFmvRJdKwWLocTowhV+Pn39///Lz6ze6Jgp9vC+TC1VaWA9JPeSOtBtG0BjdTeAf5d1/oiVdAHnWpbS8G9P/z/48EUs6a1I3koM/g38JTiLjzXyFqe1lfMaTcJSOnmmtYz/CgJ6i0ys6O0LRdgcHpXW8Ytbn7Onchw8L3uM7yrfB7mk8kQWqvy9PJdE=)我們會更理解:

有一個父元件上面有2個表單資料，`dataA`給元件A使用，`dataB`給元件B使用。

**- dataA:** 以原始型別資料傳遞props
**- dataB:** 以物件型別資料傳遞props

會發現元件A裡面表單裡v-model綁定的`props.data`，如果我們在input輸入框打入新的值，因為會更動到傳入的props，Vue本身在開發環境會偵測到並拋出警告。
![https://ithelp.ithome.com.tw/upload/images/20240926/20145251GdwqOFNmCp.png](https://ithelp.ithome.com.tw/upload/images/20240926/20145251GdwqOFNmCp.png)

會發現元件B裡面表單裡v-model綁定的`props.data.msg`，如果我們在input輸入框打入新的值，Vue其實偵測不到這種違反原則的操作，並不會拋出警示。

但因為內層物件本身還是物件傳址(call by refrence)，指向內層由`reactive`響應式物件組成的屬性，Vue還是會透過`Proxy攔截器`偵測到賦值更新，便讓input輸入框的值更新了。

### 延伸閱讀: [Stak overflow對於props更動的相關討論](https://github.com/orgs/vuejs/discussions/9256)

```
<script setup>
import { ref } from 'vue'
import A from './A.vue'
import B from './B.vue'

const dataA = ref('Hello');

const dataB = ref({
  msg: 'Hello2',
});
</script>

<template>
  <div class="container">
    <A :data="dataA" />
    <hr>
    <B :data="dataB" />
  </div>
</template>

<style scoped>
</style>
```
B元件
```
<script setup>
const props = defineProps({
  data: {
    type: Object,
  }
});
</script>

<template>
  <div class="p-4 border border-success">
    <p>B.vue：{{ props.data.msg }}</p>
    <div class="mb-3">
      <label for="text" class="form-label">B 的資料：</label>
      <input
        v-model="props.data.msg"
        type="text"
        class="form-control"
        id="text"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
```

-----


### 編輯表單預設值處理狀況

像是某些編輯表單本身會讓使用者儲存資料後，按下儲存按鈕後透過API將表單資料記錄到資料庫後，再度打開更新時要`還原先前預設值，並且要能夠再次編輯表單資料`。 

表單元件的預設資料通常會透過`props`形式傳入，但又會透過`v-model`綁定讓使用者進行輸入更動，不過這麼做會違反了`避免傳入props的更動原則~`。

![https://ithelp.ithome.com.tw/upload/images/20240926/20145251cye9SmnRKc.png](https://ithelp.ithome.com.tw/upload/images/20240926/20145251cye9SmnRKc.png)



### 為了避免這種情況，如果真的要對props進行更動，應該如何處理：

- **本地狀態的複製副本:**

如果需要在子元件中更改 props 的值，應該可以將其`複製到子組件的本地狀態中，然後對本地狀態進行修改`。這樣可以避免直接改變父組件的數據，稍微注意一下物件是否為`深層嵌套(nesting)`，需要做`深拷貝(deep copy)`就是。

這樣就能api傳回上次的修改紀錄，並且在input表單中能讓使用者能再次修改的功能需求。

不過小細節，記得將傳入的props表單屬性資料進行`watcher監聽`，這樣後續props更新時才能讓複製的本地狀態資料一起連動。

我記得官方也有提到，如果props傳入子元件後變成local端響應式變數，會失去響應式連結，只會有初始預設值效果。不過嚴格具體來說物件如果修正內部，因為`傳值關係(call by refrence)`，還是更動到父層資料，保持著props傳進去的資料不要隨意更動觀念就行了。

> The prop is used to pass in an initial value; the child component wants to use it as a local data property afterwards. In this case, it's best to define a local data property that uses the prop as its initial value:


```
<template>
  <div>
    <p>First Name: {{ localUser.firstName }}</p>
    <input v-model="localUser.firstName" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-user']);

// 創建 props 的副本
const localUser = ref({ ...props.user });

// watch
watch(()=> props.user,(newVal)=>{
    localUser.value = newVal
})

// 用於修改 localUser 的方法
function updateFirstName(newFirstName) {
  localUser.firstName = newFirstName;
}

// 發送事件通知父元件更新
function updateFirstName() {
  const updatedUser = { ...props.user, firstName: newFirstName.value };
  emit('update-user', updatedUser);
}

</script>
```



-----

## 為什麼Vue不推薦以props傳遞函式(function)的模式，作為組件間溝通模式?

如果有初步接觸 React 的開發者，通過 `props`傳遞函數給子元件調用是很常見的開發模式:

```
// Implement the parent and child components together in one .js file

import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const increaseCount = () => {
    setCount(count + 1);
  };
  return <ShowCount count={count} increaseCount={increaseCount} />;
}

function ShowCount({ count, increaseCount }) {
  return (
    <div>{count
      <div>{count}</div>
      <button onClick={increaseCount}>Press to increase</button>
    </div> </div>
  );
}
```

那在 Vue 中，可以將字串、陣列、數字和物件作 `props` 傳遞，但是你也可以將`函數(function)`當作 `props` 傳遞。是會有和利用事件觸發傳遞 `emits` 同樣效果，功能也相同，但會有衍生那些元件設計問題呢?

```
// parent component
<template>
  <ChildComponent :method="parentMethod" />
</template>

<script setup>
const parentMethod = (valueFromChild) => {
  // Do something with the value
  console.log('From the child:', valueFromChild);
}
</script>

// child component

import { ref, onMounted } from 'vue';

const props = defineProps({
  method: {
    type: Function,
  }
});
const message = ref('A message from the child component');

onMounted(() => {
  // Pass a value to the parent through the function
  props.method(message.value);
});
```

當我們把函式作為 `props` 傳遞給子組件時，這樣做在某些情況下可能會影響到元件的**解耦性和獨立性**。

具體來說，`當子元件是一個通用的 UI 元件，而傳入的函數邏輯隨著需求的變化而不同時，這個元件的共用性可能會受到影響`。

最近在開發上PM跟我們說某專案不是很類似的UI，可以直接引用到新專案，但你會發現工程師還要加以修改，拆掉某些商業邏輯才能順利使用。

### 耦合性增強:

當依賴父元件傳入的函數進行特定的邏輯處理時，這意味著比較小的子元件的行為很大程度上受制於父元件。這增加了彼此之間的耦合性，降低了子元件的獨立性。

### 耦合性增強也代表著失去靈活性:

如果這個子元件是用於多個不同的場景，而`每個場景中需要的事件邏輯不同，那麼傳入的函數可能無法適應所有商業邏輯場景`。這會導致在不同使用場景下，子元件可能需要依賴不同的父元件來提供不同的函數邏輯，從而限制了子元件的通用性。

(`註: React 提供了一些不同的方式來處理組件的解耦和獨立性問題，方式包括使用 props.children、高階組件（HOC）、Render Props 等模式來增加組件的靈活性和可重用性，有興趣可以多探索`。)

-----

## 總結:

1. Vue開發中`以props傳遞函式給子組件來進行資料流更新並不是一個官方直接制止掉的不合法操作`，只是在調適或組件擴充上會比較失去彈性，資料變動追蹤上也比較隱誨，雖然開發上比較傳接一堆emits事件來的方便， 因此官方文件選擇以能夠讓元件開發比較明顯且區隔開的emits事件形式，推薦給使用者。
 
2. `props和emits使用上依循著Props down, events up的組件溝通原則`，是一種明顯單向的溝通原則，能讓我們掌握多數情況下開發的資料流追蹤，因此，多數情況我們應該注意傳入的props應該是保持唯讀不變的。



-----

## 學習資源:

1. https://michaelnthiessen.com/pass-function-as-prop
2. https://medium.com/front-end-weekly/passing-methods-as-props-in-vue-js-d65805bccee
3. https://maxkim-j.github.io/en/posts/function-props-vuejs/
4. https://michaelnthiessen.com/pass-function-as-prop/
5. https://michaelnthiessen.com/make-your-components-easier-to-think-about
