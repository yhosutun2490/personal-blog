---
title: <script setup> 語法糖的本質
date: 2024-09-16
description: 介紹composition api 中的 <script setup> 語法糖。
image: /iron/day3/iron-3-1.webp
alt: Vue-script-setup-sugar-syntax
ogImage: /iron/day3/iron-3-1.webp
tags: ['Vue','鐵人賽']
published: true
---

# script setup 語法糖的本質

## 今日學習重點

1. `<script setup>`解決舊有Vue版本那些問題?
2. `<script setup>`是標準JS語言嗎?
3. 為何`<script setup>`定義的變數或響應式資料，能夠暴露給樣板(template)直接使用?

---
## 舊有Vue版本(optional API)痛點

在 Vue 2 中，主要是使用`選項式 API（Options API)`，例如 data、methods、computed、watch 等分類方式來組織組件邏輯。這些方式容易理解，但在大型應用中，元件內部的邏輯分散在不同的選項中，導致程式碼難以維護。

以前Vue 2.x 或是你曾在公司舊專案optional API開發組件會大概長這樣:

```
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  mounted() {
    // methods can be called in lifecycle hooks, or other methods!
    this.increment()
  }
}
```


-----


## 元件實例this指向問題(順便複習JS this觀念)

過往Vue開發時需要用this指向元件的實例，去調用已經定義好的數據或方法等，不過若是有些非同步處理，會影響到實際作用時this的指向。


在 JavaScript 中，this 的指向是根據函數由誰呼叫來決定綁定對象，而不是在函數定義時，是當下變數定義的 [語彙環境(lexical scope)](https://www.cythilya.tw/2018/10/18/lexical-scope/) 決定的。

當在 Vue 中使用非同步函式，如 `setTimeout`或 `Promise` 時，如果沒有正確綁定 this，回調函數內的 this 很可能會指向`全域物件（如 window）`，而不是 `Vue 的組件實例`。

如果對於JavaScript this指向不熟，可以先閱讀這篇文章-[解釋 JavaScript 中 this 的值](https://www.explainthis.io/zh-hant/swe/what-is-this)

```
methods: {
  handleClick() {
    console.log(this.message); // 'this' refers to the component instance
  },
  setTimeoutExample() {
    setTimeout(this.handleClick, 1000); // 'this' will be undefined inside handleClick
  }

```

所以在非同步邏輯上使用元件資料時，就需要使用`箭頭函式(arrow function)`來解決這類問題，箭頭函式的this式根據創建時的語彙環境(lexical scope)決定好的。

```
setTimeoutExample() {
 setTimeout(() => {
 this.handleClick();
 }, 1000);

```

或是使用 `bind`方法，可以在定義回呼函數時使用 .bind(this)，手動綁定 this：

```
methods: {
  greet() {
    setTimeout(function() {
      console.log(this.message);
    }.bind(this), 1000);
  }
}
```


-----

## Mixin 的變數命名衝突問題

當多個 `Mixin` 合併到同一個組件中時，如果這些 `Mixin` 內有相同名稱的變數、方法或生命周期鉤子，Vue 會進行合併處理，但合併的規則並不總是直觀的：

- 函式方法的覆蓋：

當 Mixin 中的變數或方法名稱與組件內或其他 Mixin 衝突時，最後一個合併的 Mixin 會覆蓋之前的定義。這會導致無法預測的行為。

- 生命周期鉤子合併:

在生命周期鉤子（如 created、mounted）中，Vue 會將它們合併並依序執行，但如果這些鉤子依賴某些變數或狀態，很容易因為執行順序導致意外錯誤。

```
const myMixin = {
  methods: {
    sharedMethod() {
      console.log('mixin method');
    }
  }
};

export default {
  mixins: [myMixin],
  methods: {
    sharedMethod() {
      console.log('component method');
    }
  },
  created() {
    this.sharedMethod(); // 输出 'component method'
  }
};
```


-----

## `<script setup>`是標準JavaScript語言嗎?

原生標準的JavaScript `<script>`標籤是沒有這段`<script setup>`，瀏覽器也不認識，顯然跟上一次提到樣板中的內容會被編譯(compiler)有關。

上次有提到`@vue-sfc-compiler`除了編譯.vue文件中的`樣板(template)`，也同時有編譯`<script>標籤`內容的作用。

上次我們再觀察[SFC文件(SFC playground)](https://play.vuejs.org/#eNp9kUFLwzAUx7/KM5cqzBXR0+gGKgP1oKKCl1xG99ZlpklIXuag9Lv7krK5w9it7//7v/SXthP3zo23EcVEVKH2yhEEpOhm0qjWWU/QgccV9LDytoWCq4U00tTWBII2NDBN/LJ4Qq0tfFuvlxfFlTRVORzHB/FA2Dq9IOQJoFrfzLouL/d9VfKUU2VcJNhet3aJeioFcymgZFiVR/tiJCjw61eqGW+CNWzepX0pats6pdG/OVKsJ8UEMklswXa/LzkjH3G0z+s11j8n8k3YpUyKd48B/RalODBa+AZpwPPPV9zx8wGyfdTcPgM/MFgdk+NQe4hmydpHvWz7nL+/Ms1XmO8ITdhfKommZp/7UvA/eTxz9X/d2/Fd3pOmF/0fEx+nNQ==)檔編譯後程式碼的樣子，其實已經有看到它的產物:

沒錯~!，就是`__sfc__`裡面的其中一個`setup()函式`，我們在原本 `<script setup>` 定義的響應式資料，會形成一個setup function，並將這些資料返回，如果有引入其他子元件也是一樣。

```
import { ref } from "vue";
import Child from "./Child.vue";

const title = "title";

const __sfc__ = {
  __name: "index",
  setup() {
    const msg = ref("Hello World!");
    if (msg.value) {
      const content = "content";
      console.log(content);
    }
    const __returned__ = { title, msg, Child };
    return __returned__;
  },
}
```


-----

## Vue3 `<setup script>`語法糖做了什麼事?

看到這裡，會發現`setup`可以被視為一個`JavaScript作用域（scope）`的概念。

其中定義的所有變數和函數都存在於這個局部作用域內，這使得變數不會污染全域空間，也避免了 this 指向錯誤的問題。

由於所有變數和函式都共享相同的局部作用域(local scope)，所以不能有相同名稱的變數或函數，否則會發生命名衝突。這要求開發者在命名時必須更加謹慎，特別是在引入多個組合式Composables 函式或是處理較複雜的邏輯時。

如果引入的自訂義函式有重複命名發生，可能就需要解構出來並重新命名囉~

```
import { ref as userRef } from 'vue';
import { ref as otherRef } from './otherComposable';
```


-----

## script setup和樣板的關係

### 為何`<script setup>`定義的變數或響應式資料能夠暴露給樣板(template)直接使用

這就要把樣板編譯成的`渲染函式-render function`和`__sfc__物件中的setup()`，一起搭配來看就能一竅而通。

```
import { ref } from 'vue';

// 元件對象 (SFC Object)
const __sfc__ = {
  __name: 'App',
  setup(__props, { expose: __expose }) {
    __expose();  

    const msg = ref('Hello World!');  // 定義響應式資料

    // 返回定義的變數和函數
    const __returned__ = { msg, ref };
    // 標誌這些是從 <script setup> 來的
    Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true });
    return __returned__; // 暴露樣板使用
  }
};

// 創建虛擬DOM節點和資料連結部分

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

//這裡sfc物件當初定義好的setup回傳值會給render function使用，當然也包括create Vnode所綁定的資料
__sfc__.render = render 
__sfc__.__file = "src/App.vue"
export default __sfc__
```



-----

雖然原始代碼有點深，不過我們來試著簡單總結一下這段過程:

- 編譯階段 (Compiler Phase)

在 Vue 3 中，當你撰寫 `<template>` 和 `<script setup>` 時，這些代碼會被 Vue 的編譯器轉換成渲染函式（render function）和 setup 函數：

   - 編譯器轉換：
   
   Vue 編譯器會將`模板（template）`轉換為`渲染函式（render function)`。這個渲染函式用於瀏覽器中的實際 DOM 操作，它是由 JavaScript 語法構建的，可以更高效地進行 DOM 更新。
   
   - 渲染函式與 setup 的結合： 
   
   在編譯過程中，Vue 會生成一個包含渲染函式的組件對象，這個對象包含 setup 函數返回的我們定義好響應式資料，渲染函式會依賴這些資料進行實際的 DOM 渲染。


- 運行時階段 (Runtime Phase)

這個階段的細節滿深入的主要是`__sfc__.render = render`，加上一些Vue本身沒有暴露出來的底層API去執行。

[底層模組setupStatefulComponent](https://github.com/vuejs/core/blob/af60e3560c84e44136f950fc3d0e39b576098c6c/packages/runtime-core/src/component.ts#L750):

主要功能是將組件實例和setup帶有的資料作結合，看github是歸在瀏覽器運行runtime core模組。

在`瀏覽器運行渲染函式(runtime phase)`時調用`setupStatefulComponent`，將setup返回的變數丟入組件，和渲染函式結合，讓資料在樣板上流動。

`渲染函式(__sfc__.render = render)`會被賦值給組件對象，並在 Vue 的渲染過程中被調用。當渲染函式執行時，它使用 $setup 和 $props 來生成對應的虛擬 DOM，並將這些虛擬 DOM 更新到瀏覽器真實的DOM 上。


初學者跟我一樣源碼看得很辛苦，當作通識理解一下有這段就行囉:)。

`Compiler phase- 編譯核心運行完的產物 = render function + setup()`



-----

## 問題

- `<script>`也有正常版的，也可以和`<script setup>`在SFC文件中一起使用嗎?


雖然目前實務百分99%沒用過，不過.vue文件中`<script>`和 `<script setup>`確實可以放在同份檔案下。

在Vue官方有一份叫做[意見修正稿的神奇文件(rfc)](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)，裡面主要是收集當初Vue開發那些feature最終有被納入，那些又被廢棄，也有滿多應用解釋的。

- 一般`<script>`主要處理全局可以使用的方法，或僅在組元件創建時使用一次的邏輯。
- `<script setup>` - 則聚焦在處理響應式資料供給模板使用。

```
<script>
  performGlobalSideEffect()

  // this can be imported as `import { named } from './*.vue'`
  export const named = 1
</script>

<script setup>
  import { ref } from 'vue'

  const count = ref(0)
</script>
```


-----

- `Composition API` 和 `Optional API` 盡量別混著用~!

在同一個元件中同時使用 `<script>` 和 `<script setup>` 定義變數的話，兩邊的變數是分開的作用域，通常情況下不會直接混在一起。

但是這樣的設計會讓代碼難以理解，特別是在變數名稱相同或相似時，會引起混淆和潛在的邏輯錯誤，開發時盡量風格保持一致囉。

```
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0 
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};
</script>

<script setup>
import { ref } from 'vue';

const count = ref(0); 

function increment() {
  count.value++;
}
</script>
```
compiler編譯後:

```
import { ref } from 'vue';


const __default__ = {
  data() {
    return {
      count: 0 
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};

const __sfc__ = /*@__PURE__*/Object.assign(__default__, {
  __name: 'App',
  setup(__props, { expose: __expose }) {
  __expose();

const count = ref(0); 

function increment() {
  count.value++;
}
```



-----

## 總結

今天的內容和單純讀官網有人引導感覺很不一樣，從實務應用性變得有點偏十萬個為什麼XD，也需要自己內化組織吸收後才能破解自己的疑問，困難度增加滿多的，不過理解很多Vue當初為什麼要這麼設計，慢慢加上一些實務經驗有點釐清什麼才是正確的用法。



-----
## 學習資源

1. https://ithelp.ithome.com.tw/m/articles/10296330 (以前鐵人賽Vue的好文章)
2. https://www.youtube.com/watch?v=77yGP5K_Lt8 (Vue setup 短片回顧)
3. https://fe-blog.workplus.io/vue3-script-setup (關於一些元件使用composition api 介紹)
4. https://github.com/vuejs/rfcs/blob/master/active-rfcs/0040-script-setup.md (Vue的官方意見修正稿-歷史的軌跡)
5. ttps://www.cnblogs.com/heavenYJJ/p/18032347
6. https://www.explainthis.io/en/swe/what-is-arrow-function (Explain this複習一下this)
7. https://www.cythilya.tw/2018/10/18/lexical-scope/  (lexical scope)
