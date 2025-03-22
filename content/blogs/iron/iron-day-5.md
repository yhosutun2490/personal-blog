---
title: JavaScript Proxy 和 Vue Reactive 響應式系統 
date: 2024-09-18
description: 認識 JavaScript Proxy 和新一代 Vue 3 reactive 的神祕關係。
image: /iron/day5/iron-day5-logo.png
alt: JavaScript-Proxy-And-Vue-Reactivity
ogImage: /iron/day5/iron-day5-logo.png
tags: ['Vue','JavaScript','鐵人賽']
published: true
---
# JavaScript Proxy 和 Vue Reactive響應式系統 

在 Vue 2 中，響應式系統就是依賴於 `Object.defineProperty`，允許在物件的屬性上設置 getter 和 setter 攔截器，以監測屬性的變化並執行相應的處理。

但如果我需要對物件新增一個新屬性呢? myObject.name='a' ，反而是沒辦法有效攔截到的，因為攔截器是設定在下一層已經存在的屬性上(property)

```
consy myObject = {}

Object.defineProperty(myObject, "b", {
  get: function () {
    return bValue;
  },
  set: function (newValue) {
    bValue = newValue;
  },
  enumerable: true,
  configurable: true,
})

```

後來JavaScript ES6新版本出現了`Proxy(代理物件)`，我們在物件最外層就能定義攔截器，所以對物件進行**取值(getter)、賦值(setter)**，**新增屬性**等監測就很方便。

所以今天就來聊聊認識`Proxy`和新一代Vue 3 `reactive`的神祕關係吧~

---

## 今日學習重點:

1. 重新複習理解 JS Proxy 一些重要觀念

2. Vue響應式基礎-Reactive和Proxy的關係

3. reactive 使用的限制問題和怎麼解決



-----

## JavaScript代理物件(Proxy)的用處

JavaScript的`代理物件（Proxy）` 算是一個強大的功能，可以定義一層攔截函式，來偵測物件的基本操作（例如屬性讀取、屬性寫入、函數調用等）等行為。

target`指的是需要代理的物件，`handler`則是攔截函式支持多種操作，像是對基本的屬性存取get和設置set，還包括函數調用apply、屬性檢查has等([handler方法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy))。

基本handler攔截方法:

偵測物件賦值操作- `set()`
偵測物件取值操作- `get()`

```
const proxy = new Proxy(target, handler)
```

常見Proxy的例子，像是攔截對物件屬性設定之前進行驗證，例如確保數字類型的屬性不會被設置為非數字的值。

```
// 原始物件
const user = {
  age: 30
};

const proxyUser = new Proxy(user, {
  // 設置當對物件進行賦值操作時，觸發的對應操作
  set(target, property, value) {
    if (property === 'age' && typeof value !== 'number') {
      throw new Error('Age must be a number');
    }
    target[property] = value;
    return true;
  }
});

proxyUser.age = 25; 
proxyUser.age = 'twenty';  
```


-----

### Proxy 代理物件並不是把目標物件複製一次再操作!

Proxy 是用來定制基本操作（如屬性訪問、賦值、列舉等）的一種機制，`當你對 Proxy 物件進行操作時，其實操作的仍然是它所代理的目標物件，最終更動結果會影響到原始物件。`

### JavaScript 的 Proxy 並不是將目標物件進行一次複製。

而是在不改變原始物件的前提下進行攔截，Proxy 其實像是對目標物件的進行一個包裝，當你透過 Proxy 操作目標物件時，代理會攔截這些操作（如讀取屬性、修改屬性、函數調用等），然後根據你設定的攔截行為來執行相應的修改操作，會更動到原本的物件。

```
const handler = {
    get(target, prop) {
        console.log(`Getting property ${prop}`);
        return target[prop];
    },
    set(target, prop, value) {
        console.log(`Setting property ${prop} to ${value}`);
        target[prop] = value;
        return true;
    }
};

const target = {};
const proxy = new Proxy(target, handler);

proxy.name = 'John'; // Setting property name to John
proxy.name2 = 'John2'

console.log('target',target); // 原本的target是會連帶受到更動! 

```


-----
### Proxy vs 原始物件指向

比較特別的是，兩者間引用的資料物件是相同的，`但在記憶體中它們是兩個不同的物件，因此 === 比較時會返回 false。` (這裡先保留個疑問，原始物件的更動會影響Prxoy有點恐怖)

1. 因為 proxy 和 target 指向的是同一個內部物件，只是 proxy 透過代理來控制對 target 的操作，所以當你直接修改 target 時，這些變更會反映在 proxy 上。

2. 使用 proxy 物件來讀取或設置屬性時，Proxy 的攔截器會被觸發，並且執行handler function。
`但當你直接操作 target 時，Proxy 不會被觸發，因為這些操作不經過 proxy，而是直接在 target 上發生。`

> **想使用攔截監測功能，就需要透過Prxoy物件包裝並且透過它來代理操作囉**

```
target.name3 = 'rafael'; // 直接對 target 設定屬性
console.log('proxy after', proxy); // proxy 也會反映出 target 的變更，因為它們引用相同的物件

console.log('eqaul',proxy === target)  // 但兩者間的記憶體位置是不相同的，
//因為Proxy另外包裝過，附帶一些原始物件沒有的handler攔截方法，但引用資料來源是相同的

target.name3 = 'rafael'// proxy和target資料都被改變了，但是不會觸發攔截器handler
console.log('proxy after',proxy)

```



-----
### Proxy 物件代理的只有第一層的物件

Proxy 只會攔截對目標物件的頂層屬性的操作，不會自動遞迴地(recursive)幫你代理嵌套在內部的屬性對象，換句話說，對於深層巢狀物件更內部屬性訪問，是不會觸發設定好的攔截器handler~~~。

```
const target = {
    nested: {
        name: 'Nested Object'
    }
};

const handler = {
    get(target, prop) {
        console.log(`Accessing ${prop}`);
        return target[prop];
    }
};

const proxy = new Proxy(target, handler);

// 觸發攔截器hnadler
console.log(proxy.nested); // Accessing nested -> { name: 'Nested Object' }

// 訪問嵌套屬性不會觸發攔截器hnadler
console.log(proxy.nested.name); // 不會觸發代理 -> Nested Object
```

`另外，解構賦值提取出來的代理物件內部屬性，也不會掛上Proxy 代理，返回的是單純的物件屬性資料。`

這跟上面提到不會自動遞迴地將所有深層的物件屬性掛上攔截器一樣，當然解構賦值複製出來的方法，也就不會有handler function。

```
const proxy = new Proxy({ foo: 42, bar: 100 }, {
    get(target, prop) {
        if (prop === 'foo') {
            return target[prop] * 2;
        }
        return target[prop];
    }
});

const { foo, bar } = proxy;

console.log(foo); // output: 42，沒有觸發getter攔截器 * 2 變84
console.log(bar); // ouput: 100
```



-----

### 淺拷貝Proxy會失去攔截器(handler)功能

這是寫這篇文章測試發現到的(以前沒發覺到的細節)

> 在淺拷貝 Proxy 物件的情況下，外層的代理功能其實並不會隨著淺拷貝一起被複製。這是因為 Proxy 是一個包裹目標物件的特殊構造，當進行淺拷貝時，拷貝的僅僅是原始目標物件本身，而不是 Proxy 的本身攔截器行為。

1. 這邊 shallowCopy 不是代理物件，但在執行 const shallowCopy = { ...proxy } 這段解構賦值淺拷貝過程時時，`JavaScript 會在進行展開運算符 (...) 時先去讀取 proxy 的屬性`，由於 proxy 仍然是代理物件，因此在展開的過程中會觸發 get 攔截器。

2. 但後面shallowCopy.a 取值時就變成普通物件了


```
const target = { a: 1 };
const handler = {
    get: (obj, prop) => {
        console.log(`Accessing property ${prop}`);
        return obj[prop];
    }
};

const proxy = new Proxy(target, handler);
const shallowCopy = { ...proxy };  // 使用展開運算符進行淺拷貝

console.log(shallowCopy.a);  // 只會顯示1 不觸發getter
console.log(shallowCopy.a);  // 只會顯示1 不觸發getter
```



-----

## 中間休息

1. Proxy可以對物件的更動設置監測攔截，包括新增屬性或內部賦值資料更動變化
2. Proxy物件不是幫你複製一份原始資料，只是代理操作，兩者資料引用是相同的
3. Proxy物件代理的只有第一層的物件，沒有自動連深層屬性都幫你掛上

那我們繼續揭開`reactive`面紗~

-----



## Reactive-深層物件響應式特性

> reactive 不僅僅是為物件的頂層屬性添加代理，而是遞歸地為物件的所有嵌套屬性添加 Proxy，從而實現深度響應性。深度響應性，指的是當我們修改物件的深層嵌套屬性時，Vue 的回應系統也能夠偵測到變化，並更新相關的視圖或相關計算屬性(computed)

`註解: computed 也是Vue響應式API其中一種 ，後續也會加以介紹。`

在[Vue Core源碼](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts#L251)一打開也會立即發現，`reactive`是呼叫`createReactive`創建響應式Reactive物件，利用先前介紹的JS Proxy 將物件資料進行第一層物件代理，攔截資料操作的變化。

```
import { reactive } from 'vue';

const state = reactive({
    user: {
        name: 'John',
        profile: {
            age: 30,
            city: 'New York'
        }
    }
});

// 修改深層屬性時，畫面會更新的
state.user.profile.age = 31;
```
![https://ithelp.ithome.com.tw/upload/images/20240918/20145251OCowEGzh6o.png](https://ithelp.ithome.com.tw/upload/images/20240918/20145251OCowEGzh6o.png)


-----
### Reactive-僅能用在物件(object)資料，丟入一般型別(primitive)型態資料會噴警示

打開[Vue Core Reactivity ](https://github.com/vuejs/core/blob/main/packages/reactivity/src/reactive.ts#L251)實際程式碼，會發現拋入一般型別資料，運用`isObject()` 檢測目標對象(target)是否為物件，不是的話在開發環境下會拋出警告，並直接返回該原始值，不會進行後續 Proxy 代理物件掛載，也確保開發在使用上錯誤時，不會造成程式突然中斷。

![https://ithelp.ithome.com.tw/upload/images/20240918/20145251T4TeafAf9q.png](https://ithelp.ithome.com.tw/upload/images/20240918/20145251T4TeafAf9q.png)



-----
### Reactive- 內部靠著遞歸式呼叫createReactive，幫物件深層屬性加上響應式監聽

先前介紹Proxy 代理的只有第一層的物件，所有在我們創建`reactive` 使用時，會掛上攔截器handler `BaseReactiveHandler` ，做的事情就是當我們對物件更深層的屬性調用觸發getter/setter。

大概主要就是檢測物件內部屬性是**一般型態**或**物件**

- 物件資料:

利用`isObject()` 檢查是否為物件，`是的話再調用reactive一次，重複剛剛掛上Proxy 代理物件的步驟，達成我們對深層屬性重新賦值時，Vue也能夠監測到而進行畫面更新`。

- 一般型態:

如果是一般型態(primitive)資料的話，進行取值(getter)操作時，reactive將會返回原始資料，不會特地把它再掛上一層Proxy攔截器的額外操作，也不再進行後續追蹤邏輯，這麼做能夠節省效能些。

![https://ithelp.ithome.com.tw/upload/images/20240918/20145251X4bQuKXwT8.png](https://ithelp.ithome.com.tw/upload/images/20240918/20145251X4bQuKXwT8.png)

`reactive已經對深層物件的每一層物件屬性無差別地都掛代理，效能上勢必會有所影響， 更能體現reactive在設計邏輯上是對偏向複雜的物件資料類型去做設計。`




-----
### Reactive 使用上的限制問題

理解完reactive 設計構造和設計理念後，來看看當初官方文件提及的[ reactive 使用的限制問題(limitation of reactive)](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive。)。

### 將原本定義的reactive重新賦值，那麼將丟失原有的響應式資料

這點還滿好理解的，Vue 的響應式更新是基於reactivie內部調用 Proxy設置攔截器，當我們重新賦值時也就等於重新創建新的Proxy 攔截器，相對應追蹤的響應式更新track邏輯也是新的，不會沿用舊的資料流。

```
let state = reactive({ count: 0 })

// the above reference ({ count: 0 }) is no longer being tracked
// (reactivity connection is lost!)
state = reactive({ count: 1 })
```



-----
### 原始資料mutate和reactive物件間有關係嗎?

當我們將物件資料裝入reactive 後，兩者資料的參照位置是一樣的，因為Proxy會以new Proxy 建構子產生新的資料儲存位置。所以對raw原始物件進行操作時，會影響 `proxy = reactive(raw)`的變化。

實務上也應該避免這麼操作，雖然沒有觸發響應式系統的攔截器功能，但可能讓資料流變化不好追蹤，甚至亂掉。

`也是剛剛研究Proxy和原始物件資料流指向的疑問: 原始物件的更動會影響Prxoy有點恐怖`

剛剛寫了個[案例](https://play.vuejs.org/#eNp9UktOwzAQvcrIG0CURnxWVaj4iAUsAAFLb9J0mqZ1bMufUinKni0X4CLcB4lbMLbpZwFVNjPz3pu8GU/LLrXuLzyyActtaWrtwKLzeshl3WhlHLRgcAI9g0Xp6gV2MDGqgT3S7HEZvlJJ60CNZnAOLZcAxQCOeyEYDeCEgm7FaWxFnFWnfZIccDnxklIlofGucLh/kJoQ2C/g8DDKNxxbPQpvVyRKN6Q8SwOQdUocNlpQP8oA8unxsG1/6V2XZ5THei21d7A4atQYxTlnkcEZZAkeeeforxelqMt5gKNFzobfnx9fb+8pzbNE+0eSHG80ttoS5NmWT9ZjztKmJnXVn1kl6U3ilJyVqtG1QPOgwxao2SDNH7BCCPV6F2vOeIyLj5oplvM/6jO7DDXOHg1aNAsaZ425wlToEnzzfI9Litcg7cgLYu8An9Aq4YPHRLvycky2t3jR7W28rFpWL/Zm6VDa1VDBaGB2kc8ZHdn1jtE3dk/7Z1FHh8C6H/JL9zA=)，才發現恐怖點在哪:

如果先點選`點我mutate`點個幾下，響應式系統不會更新，看起一切風平浪靜，但如果再去點正常`點我msg`，會發現挖賽`reactive`資料流起始點怎麼不一樣了，也就是原始物件更動也是會影響Proxy代理的物件，實務上應該避免這麼做。

```
<script setup>
import { ref ,reactive} from 'vue'


const obj = {
  a: 1,
  b: 2,
}
const msg = reactive(obj)
function mutate() {
  obj.a ++
}
function msgPlus() {
  msg.a ++
}
</script>

<template>
  <h1>{{ msg.a }}</h1>
  <input v-model="msg.a" />
  <button @click="mutate">點我mutate</button>
  <button @click="msgPlus">點我msg</button>
</template>

```




-----
### Reactive中內部一般型態屬性資料解構(primitive type)使用的限制

這點當初看官方文件有看沒有懂，不過實際理解`reactivie`內部 Proxy設置機制後就會很清楚，剛剛有簡單看Vue Core Reactive()源碼我們有得到一段結論:

> 如果是一般型態(primitive)資料的話，進行取值(getter)操作時，reactive將會返回原始資料，不會特地把它再掛上一層Proxy ，也就是攔截器的額外操作 ，也不再進行後續追蹤邏輯，這麼做能夠節省效能些。

很明顯地，我們把要對 `count` 這個`reactive`內部的`一般型態資料屬性(property)`，進行資料提取和解構賦值複製時，取到的是`原始值資料，沒有帶任何一點代理物件Proxy` 。

自然而然後續對它進行資料更新，Vue本身已經監測不到任何在當初在 reactive 內部 Proxy設置的追蹤機制，也喪失了響應式。

```
const state = reactive({ count: 0 })

// count is disconnected from state.count when destructured.
let { count } = state
// does not affect original state
count++
callSomeFunction(state.count)
```




-----

## 總結:

複習了`Proxy` 的基本觀念和解構賦值會發生什麼問題，也理解`reactive`設計理念上滿多是針對物件去做考量的，所以也有衍伸一些限制:

- Proxy不是幫你複製物件，只是代理操作
- Proxy最終操作會影響原始物件資料、解構賦值後攔截器會喪失功能
- 一般型態(primitive type) 資料無法使用
- `reactive`本身深層式響應式式透過遞迴方式掛上Prxoy攔截器(物件資料屬性)，去監測資料變化
- 不要隨意更動原始物件，因為會造成`reactive`資料流不易察覺的bug，正確方式應該是使用`reactive`做資料更新。

後續再進入Vue 對一般型態(primitive type)資料額外設計的`ref`核心功能囉，本篇用力聚焦在`reactive` 上，希望堅持到這的你跟我一樣都有一點點收獲。



-----
## 學習資源
1.  https://javascriptpatterns.vercel.app/patterns/design-patterns/proxy-pattern 
2.  https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy 
3.  https://pjchender.dev/javascript/js-proxy/
4.  https://vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive-proxy-vs-original-1 
5.  https://github.com/vuejs/core/blob/2a29a71d8ae2eabb4b57aee782dfb482ee914121/packages/reactivity/src/reactive.ts#L288
6.  https://tabxx.github.io/tab.github.io/2021/02/23/vue3-reactive-ref/ 
