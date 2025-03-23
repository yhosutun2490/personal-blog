---
title: Vue-插槽(slot)的認識、slot props的實際案例 
date: 2024-09-28
description: 認識defineProps針對基本的props類型檢查。
image: /iron/day15/iron-day15-logo.png
alt: Vue-Slot-And-SlotProps-1
ogImage: /iron/day15/iron-day15-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue-插槽(slot)的認識、slot props的實際案例 

元件可以接受 props，而 props 通常是 JavaScript 資料型別(物件或一般型別)。
但在某些情況下，我們可能會希望將一段模板片段(template)傳遞給子元件，並讓子元件在其自己的模板中渲染這個片段。
這樣的設計能夠保持子元件的靈活性，同時讓父元件在不同情境下決定子元件的顯示邏輯，一種鬆耦合的特徵。

## 今日學習目標

1. `slot`靜態和具名插槽認識、元件render scope觀念
2. 利用 `slot props` 將子元件插槽資料與父元件做溝通
3. `slot props` 實際應用案例-(slot props use case)


-----




## slot - 開啟父元件操作子元件顯示的主控權

在 Vue 中如果真的需要擴展子元件顯示的方式，來實現不同的商業邏輯，像是丟客制化樣板進去當作子元件參數，並且將一些更新事件主導權給父元件，基本上可以使用`插槽（slots)`來實現。

`基本 slot（或默認 slot）`是一個在子元件裡面的標籤佔位符號，允許父元件向子元件插入樣板內容，只需要定義一個 `slot`，父元件便可以將內容插入到這個`slot`中。



-----

## 元件內可以有多個具名插槽 slot

元件內的插槽可以有多個，並且可以具名(named)，這樣你就可以元件中定義多個插槽區域，讓父元件在開發上可以根據需要傳遞不同的模板片段到指定的具名插槽，去做顯示位置的定義。


像是下方範例 `MyComponent.vue` 定義了三個插槽：`header`、`default（預設插槽）`和 `footer`。

父元件可以使用 `v-slot `指令將模板片段傳遞到這些具名插槽，像是 `v-slot:header` 和 `v-slot:footer`，以及直接放置在預設插槽的位置。



-----

## Render Scope 概念

在`slot`定義好的樣板或是接收到的JavaScript表達式，`只有父元件才能跟它溝通和控制資料，子元件僅能負責接收樣板並負責顯示`，並不會接觸動用到父層透過slot傳入的樣板資料。

其實可以視為`每一個元件經過Vue編譯後，都有自己的資料和樣板結構作用域(scope)`。

> Expressions in the parent template only have access to the parent scope; expressions in the child template only have access to the child scope.


- **使用場景：**

當插入的內容是靜態樣板時的或完全由父元件控制渲染資料時，基本 `slot` 是滿適合的選擇。
可用於簡單的組件，例如一個`對話框組件`，父元件可以將對話框的標題和正文內容作為 `slot` 插入。

對於一些內容排版比較固定的 UI layout元件，我們可以用基本 slot來設定。


```
<!-- 子元件 MyComponent.vue -->
<template>
  <div>
    <header><slot name="header"></slot></header>
    <main><slot></slot></main>
    <footer><slot name="footer"></slot></footer>
  </div>
</template>
```

```
<!-- 父元件 -->
<template>
  <MyComponent>
    <!--message 由父組件資料流控制-->
    <template v-slot:header>這是標題 {{ message }}</template>
    這是正文內容
    <template v-slot:footer>這是頁腳</template>
  </MyComponent>
</template>

<script setup>
import {ref} from 'vue'
const message = ref('Hello world')
</script>
```

## 常見slot開發的 UI-Modal 圖例

像是實務上拿到樣式稿分析時常出現的`Modal彈窗元件`，就會習慣用`slot`來分配欄位名稱來開發製成共用元件，像下面版型其實會是由一個共用Modal包裝出來的。

![https://ithelp.ithome.com.tw/upload/images/20240928/20145251QavMBctQAu.png](https://ithelp.ithome.com.tw/upload/images/20240928/20145251QavMBctQAu.png)

-----


## slot props 是什麼?

這是Vue官方有提及的一項插槽間資料的溝通，不過一開始接觸會覺得很玄的觀念，希望能在這次文章中探究清楚囉~~~

![https://ithelp.ithome.com.tw/upload/images/20240928/20145251Spmv4blw1m.png](https://ithelp.ithome.com.tw/upload/images/20240928/20145251Spmv4blw1m.png)

### 定義使用

來看一下定義:

`Scoped Slots` 觀念是基本上 `slot` 的一種擴展，允許子元件將自己的資料或方法暴露給父元件，因為上面有提到元件間的render scope觀念彼此的資料流是不能互相觸及的。

`使得父元件可以基於子元件的數據來決定渲染內容，父元件可以利用slot Props訪問子元件在 slot 中提供的變數，並且重新在父元中設計插槽內提供的樣式。`

不過比較常用的情境是，通常子元件是比較通用`靜態基礎的顯示UI`，顯示資料透過`父元件資料層以props`傳入:


- 子元件接收到`props資料`後，綁定資料到`slot`插槽上
- 父元件再用`v-slot`，將`子組件slot綁定的資料提取出來到父組件樣板中使用`。

看到這段用法一定會有很多黑人問號????，那為什麼不直接user資料直接丟到父元件slot template中渲染，有必要到子元件過個水再拋回來???

```
// 子元件
<!-- <MyComponent> template -->
<div>
  <slot :text="props.greetingMessage" :count="1"></slot>
</div>

// 父元件使用
<MyComponent v-slot="slotProps">
  {{ slotProps.text }} {{ slotProps.count }}
</MyComponent>
```


-----

### slot props 實際案例

來看到蒐集到的文章範例，應該會對`slot props` 特殊用法的情境會有更深刻理解:

### Data Table列表(v-for)-每一列內容排版會根據資料內容變換渲染

假設你要製作一個Table表單元件，會提供每行數據的細節，`希望父元件能夠根據每行數據的狀態(可能是圖案，或是隨商業邏輯變換)進行不同的UI渲染`，子組件在拆分可能會以`v-for列表`渲染設計並置入`slot`插槽:
![https://ithelp.ithome.com.tw/upload/images/20240928/20145251qfRPcUwFRq.png](https://ithelp.ithome.com.tw/upload/images/20240928/20145251qfRPcUwFRq.png)

[範例](https://play.vuejs.org/#eNqNVM1u00AQfpXBlxQpTtMWLpYbqUAPcChV6Q1zWOJxuq2za+2u01SRLwiJigMVVy5QqYIT6okKAU+DKG1P8AjMrhM7UaE0ysGeb+abb/488layrDXI0Qu80GA/S5nBTiQAwnvMsE32NEUIlNzVy5GXcMFEl7PUQpEHA1+n0hAwAvKAIvJcJMWauDNyxpZgfYSiCOfJVIEQdFOmLeWokUnNDR9gI3D+A5bmCB1oN6EhsMcuQSG060QA4zQlVhQTc3jD9+Fs/+Ts0/MfX09+vvpwun9y/vH96euX5/svLg6Pz46+XDw7OP92DL5fcYU6Y4Kq4gkpmxZjthTqLZnGlPj7m3e/Ph+E89b3UiSmGju/3x4dzuCzxU86E1OnpzsTzlcdp3cy19OgV91VPDOg0eQZWXg/k8oAMWECBSRK9qFBY2xUUD0+B0Zeq+a3A488y9uVQhuYGSwsW9K5x1bTCHgcwEIT7BgDaGzgAAVlaYJrDUG32/Rrgi2G8MX24pLfXqB/A4pmzbBYMawOMxQadU3hX49iqaJYQwPrSibcTOmwHP8gicSTm3Wt1SzHdZaR5EAjcz3ueE3PaHJOeK+1raWg0xhZHZHXlf2Mp6geZoYTWeQF4BCLsTSVuw+czagcnXIXs4Xdnb/Yt/XQ2iJvnfSgGtBAKsww1UNTwquP1nBIzxXYl3GekvcV4AZqmeZWY+l2JxcxyZ7yc2rvu03horepV4eGxjIpygq1nmX/I4/W5e4Vpddyl1q3XFwkCurizL5d/sCY8aqXd6HofBKpyssDLuyNUBoIdnBvfI7c3l99cvTtcZ+mEiWIJki2+ujU+K4mif5zUzHSHSBtVqbnXG1WQQArSrE9KmhmRYo/LaC8LQ==)

- **子元件設計:**

可以看到子元件的架構很簡單，就是單純渲染傳入的資料，通常這種UI因為很單純沒有太多奇怪商業邏輯，共用性會很高。

```

<!-- DataTable.vue -->
<template>
  <table>
    <tr v-for="row in rows" :key="row.id">
      <slot :row="row"></slot>
    </tr>
  </table>
</template>

<script setup>
const props = defineProps({
  rows: {
    type: Array,
  }
}
)
</script>
```

- **父元件設計**-

你可以根據每行數據的內容來決定如何渲染，是像`數據超過某過值顯示不同UI內容`，因為每行數據渲染內容很多變，避免未來業務需求增加，寫一堆判斷式疊加破壞子元件已經設計好的邏輯的話很適用。

```
<!-- Parent.vue -->
<template>
  <DataTable :rows="financialData" v-slot="{ row }">
    <td>{{ row.name }}</td>
    <td :class="{'positive': row.value > 0, 'negative': row.value < 0}">
      {{ row.value }}
     <!--這裡如果定義在子組件內的slot裡面 會使得子組件共用性降低，
      因為可能未來UI渲染顯示又不一樣-->
      <span v-if="row.value > threshold">⚠️</span>
      <span v-else>🤡</span>
      <!--可以根據每一個父組件邏輯去增加設定，子組件脫離耦合性-->
    </td>
    <td>{{ row.date }}</td>
  </DataTable>
</template>

<script setup>
import {ref} from 'vue
const financialData = ref([
        { id: 1, name: 'Revenue', value: 150000, date: '2023-01-01' },
        { id: 2, name: 'Expenses', value: -50000, date: '2023-01-01' },
        { id: 3, name: 'Net Profit', value: 100000, date: '2023-01-01' }
      ],
    };)
const threshold = ref(100000)
</script>
```



-----

### input表單不同欄位的順序抽換

當你構建一個通用的表單組件時，可能需要根據不同的輸入類型來渲染對應輸入元素，slot顯示內容順序也不是那麼固定的話。

使用 `slot Props`，父元件可以接收子元件傳遞的輸入數據和狀態，並且能夠靈活更動表單的UI組合順序，可以一次滿未來不同業務UI上調動的需求~!。

[範例](https://play.vuejs.org/#eNqNVMtu2zAQ/JUFL26BRA7anlQnQFqkQHtog6a3qgfZWjlMaJIgKT9g6N+7S4pKDDttbuLu7IPDGe3FtbXFukNRilnAlVV1wKtKA8y+GLf6bFbWaNQBylaiavxlJZo61EU6VSJCCZxLYX3ulQllwG0g7B4iEPoRSVipbRcg7CwSgoGVgJKqF3hvVIOOorGqUPUcFSWnecr0YMMTYxf3uHicm+2rRmcwj4+jXjt4Nj3ghmIHADr6hZM2gMfQWYpIQroAe4dtD60zK5gQ5ZMxcUh1AhSHQ/iNqGBhtA/ATwCXQO3e7PPd0ouU8DsHAPag6xWWMOk8Ov6cnEG82hCKaYoxHxTip5hAf3aige/mfKX58w53OQbBgMaNVxgCuqd+md8XetbLo31S6HCdXPmHPvq3kd1povdKnIngiZFWLosHbzRpONJBT0u0SYXuhw2SGKtECQNRlaiVMptvMRZch8NqgxxOxB88KaSkj1uHtOQaKzHmQu2WSPrl9M3d96jlMbkyTacI/Y/kT/RGdbxjgn3qdENrP8PFbb9GmUi9/OVvtgG1z5fiRRmZCK4EiYQV89LVn9Z9X3yIdZXuicUjpR3/DRq5JpO1ZnQnSD1ojv3ziLvRPfy+FFuo2vP/Inru3JnN09+Cm+V0kIFJutoPhk3mg76fTQmWK9jdUHLncQzLhEfHU45SI5IHgQejphb/sWcylXXGenJVg63UeMun5K7srIHGJM9r5+pdZJ05rDQpc9RlmhF2CoHkabGhSDHSkPo00tNCuxJahduPsUURqUjpjWzCfQnvLi7skKXu3JFaif4v963nYA==)

- **子元件設計:**

```
<template>
  <div v-for="field in fields" :key="field.name" class="input-row">
    <div class="title">{{ field.label }}</div>
    <slot :name="field.type" :field="field"></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  fields: {
    type: Array,
  }
}
)
</script>

<style scoped>
.input-row {
  display: flex;
}
.title {
  width: 200px;
}
</style>

```

- **父元件設計:**

```
<!-- ParentComponent.vue -->
<template>
  <FormComponent :fields="data.fields">
    <template v-slot:text="{ field }">
      <input type="text" :placeholder="field.label" />
    </template>
    <template v-slot:checkbox="{ field }">
      <input type="checkbox" :label="field.label" />
    </template>
  </FormComponent>
</template>

<script setup>
import {ref} from 'vue'
import FormComponent from './FormComponent.vue'
const data = ref({
      fields: [
        { name: 'username', label: 'user name', type: 'text' },
        { name: 'subscribe', label: 'Subscribe to newsletter', type: 'checkbox' },
        { name: 'age', label: 'user age', type: 'text' }
      ]
 })

</script>
```

### slot props 可以幫助元件間解耦

`slot props` 的應用場景非常適合那些需要根據`父元件的傳遞過來數據變化而動態渲染不同內容`的情況，由父層的資料來控制具體插槽內容的顯示邏輯或順序。

#### 父子元件間解耦： 

`父元件負責提供數據或狀態(Data provider component)、渲染邏輯(條件切換等)處理`，`子元件則專注負責畫面顯示UI-View上的設計`，這樣可以保持子元件的簡單性和通用性，降低彼此的耦合度。

這樣看起來父元件間即使有較複雜或變動性比較高的商業邏輯，就能使用，因為不用再更動已經設計好的基礎UI子元件，這裡也有一種元件有`商業資料邏輯處理層(Data)`和`一般畫面(View)` 切割開的概念~!

![https://ithelp.ithome.com.tw/upload/images/20240928/20145251GQ78rtExcx.png](https://ithelp.ithome.com.tw/upload/images/20240928/20145251GQ78rtExcx.png)

-----

## 總結:

1. 如果渲染邏輯是固定的或僅在少數情況下會變化，並且子元件不需要為不同的父元件提供不同的渲染邏輯，那麼直接在內部渲染slot內容是一個簡單而有效的解決方案 → `slot 靜態和具名插槽`。

2. 但是如果你的應用場景需要父元件根據不同的需求，特別是數據邏輯不同有不同呈現，去進行動態渲染，尤其是`v-for列表渲染` --> 使用 `slot props 會提供更大的靈活性和可重用性`。但一般情況下這麼用資料流會比較多拋接過程，程式碼可讀性比較低，UI很靜態的話就不要過度使用囉~



-----

## 學習資源:

1. https://blog.openreplay.com/slots-in-vue/?source=post_page-----4c4c9f63cd9c--------------------------------
2. https://www.youtube.com/watch?v=GWdOucfAzTo&embeds_widget_referrer=https%3A%2F%2Fmedium.com%2F&embeds_referring_euri=https%3A%2F%2Fcdn.embedly.com%2F&embeds_referring_origin=https%3A%2F%2Fcdn.embedly.com&source_ve_path=Mjg2NjY
3. https://guillaumebriday.fr/using-vue-js-in-backend-application-with-scoped-slots?source=post_page-----4c4c9f63cd9c--------------------------------
4. https://vuejs.org/guide/components/slots.html#slot-content-and-outlet
5. https://vuejs.org/guide/components/slots.html#fancy-list-example
