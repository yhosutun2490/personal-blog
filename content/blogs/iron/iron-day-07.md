---
title: Vue的計算屬性-Computed 
date: 2024-09-20
description: 認識Vue的計算屬性-Computed 和設計思維。
image: /iron/day7/iron-day7-logo.png
alt: Vue-Computed
ogImage: /iron/day7/iron-day7-logo.png
tags: ['Vue','鐵人賽']
published: true
---

# Vue的計算屬性-Computed 

#### 本日學習重點:

1. Vue computed 的設計核心思想和基本特性
2. computed 單向資料流原則 
3. computed 使用注意事項和案例



-----
## Computed 主要核心功能

我們來看一下官方提供的[案例](https://vuejs.org/guide/essentials/computed.html#basic-example)，並且摘要說明一下`computed`的幾個特點:

**1. 自動依賴追蹤**

`computed` 屬性能夠自動追蹤其依賴的數據(包括ref、reactive)屬性。

當你在 `computed` 屬性中使用其他數據屬性時，Vue會自動收集這些依賴。當這些依賴的數據發生變化時，computed 屬性會重新計算其值。


**2. 緩存計算結果(cache)**

`computed` 屬性會根據它所依賴的響應式物件進行緩存。只有當依賴的響應式物件數據發生變化時，`compute` 屬性才會重新計算其值。
如果依賴數據未改變，`computed` 屬性會返回上次計算的結果，這樣可以避免不必要的計算，提高性能。

**3. 簡化模板和邏輯**

`computed`屬性使得樣板中的邏輯更加簡單和可讀，因為有時候我們在樣板上寫太多JavaScript表達式(JavaScript Expression)反而顯得過於冗長。

可以將複雜的計算邏輯提取到 computed 屬性中，以保持模板的簡潔，讓模板專注於數據的顯示，而不是處理複雜的計算。

```
<p>Has published books:</p>
<span>{{ author.books.length > 0 ? 'Yes' : 'No' }}</span>

// 改用computed
<tempalte>
    <span>{{ hasBook }}</span>
</template>

const hasBook = computed(()=> author.books.length > 0 ? 'Yes' : 'No')

```

**4. 預設的只讀特性(read only with getter)**

在這個例子中，fullName 是一個只讀屬性，它通過計算 firstName 和 lastName 來生成一個完整的名字。你無法直接對 fullName 進行賦值操作，因為它沒有對應的 setter。

通常呼叫`computed`預設行為`只有可讀取getter返回的計算過的資料`，但是某些特殊情況下可以在內部設置`setter`來攔截賦值時的操作，例外性的開放操作下面待會會做解釋。

```
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Note: we are using destructuring assignment syntax here.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```



**5. computed 回傳的新的 ref 響應式物件**

`computed` 返回的是一個新的值，這個值是根據依賴的響應式數據計算出來的。如果你使用 computed 返回一個引用類型（如對象或陣列），`該引用將自動包裝為 ref 物件，使得它具有響應性`，白話來說，`computed` 也可以視為某項響應式資料的衍伸物件。

**6. 必須要有回傳值**

因為會形成新響應性`ref`物件，給樣板渲染或其給他資料當作依賴來源，沒有返回值的 `computed` 屬性可能會導致Vue無法正常運行。因為 Vue 無法追蹤它應該返回的值，也無法響應數據的變化，我記得通常在開發環境時應該會有警示提示。

- 特別是`computed`條件式返回時要確保每一項條件都有返回值。

```
const condition = ref(false);

const computedA = computed(() => {
  if (condition.value) {
    return 'A';
  }
  // 如果 condition 為 false，什麼都不返回
});
```


-----

## Computed單向資料流的設計思維(One-Way-Data-Flow)

從`computed`主要核心功能我們大概可以觀察到，`computed` 屬性在 Vue的設計中，主要是以體現單向資料流的思想為主:

![https://ithelp.ithome.com.tw/upload/images/20240920/201452512qkZtc5l7X.png](https://ithelp.ithome.com.tw/upload/images/20240920/201452512qkZtc5l7X.png)

- 單向的數據依賴：

`computed`本身是由其他響應式數據進行計算，因此數據流是單向(由上而下)的：
從原始數據（data）流向 `computed` 屬性，預設行為不會反過來影響原始數據。

- 只讀的默認行為：

預設情況下`computed`只讀行為，讓它們僅用於讀取和計算基於原始數據的結果，而不會直接修改原始數據。這種只讀性進一步強化了單向資料流的設計，避免了雙向數據綁定可能帶來的複雜性和潛在問題。



-----

## Computed的例外案例:

- 可選的雙向資料操作:

雖然 `computed ` 主要建議以單向資料流的設計思維，去讀取計算後的響應式資料並忠實呈現。

`但在某些情況下，你可以通過定義 setter 來實現一些副作用(side effect)`。例如，當你定義一個 `computed ` 時，可以同時定義 get 和 set 方法，這樣當你修改`computed ` 屬性時，它會影響到其它依賴的原始數據。

很明顯地，因為修改操作到上游其他資料源的副作用(side effect)產生，通常這麼做的會比較有不可預期狀況產生，會盡量不要使用。

除非像下方案例，有一種輸入框input輸入使用者全名，上面綁定的姓和名稱也會變動的邏輯。

```
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // Note: we are using destructuring assignment syntax here.
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

## Computed getter 應該避免副作用(side effect)

`computed`的 getter 取值作用不應該有副作用，即它只應該基於響應式數據進行計算，不能改變其他的狀態或引發非預期的行為。這樣的設計能夠確保 computed 屬性可以可靠地被緩存和重新計算，並且能夠提高應用的可預測性和維護性。

像下面的案例，doubledCount是`computed`回傳值，會根據`count`資料有變化進行追蹤和重新執行計算，但這項重複計算過程也會在內部修改別的變數，麼做更動其它數據源會造成資料難以追蹤。


```
<template>
  <div>
    <p>計算後的數值：{{ doubledCount }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 定義響應式數據
const count = ref(1);
const log = ref([]);

// 定義 computed 屬性，但這裡有副作用
const doubledCount = computed(() => {
   // 進行其它資料源的賦值操作 這樣vue 會冒side effect警示
  log.value.push('computed 被調用'); // 副作用：修改了 log 陣列
  return count.value * 2;
});
</script>


```



-----

## Computed使用注意事項和實例

理解`computed`設計思維和使用方法後來看一些自己實務上目前遇到或看到的案例:

### 盡量避免循環依賴

當`computed`屬性之間相互依賴時，可能會導致循環依賴的問題。這不僅會引發錯誤，還可能會造成性能問題，因為層層依賴中間過程可以導致數據來源越來越複雜，應該要盡量降低彼此嵌套依賴性。

訪問 `a.value` 時，Vue 會觸發計算 a 的 getter，但它又需要 `b.value`。

但是 `b.value` 又需要`a.value`才能計算，這就形成了循環依賴。這種情況會導致無法完成計算，因為每個 computed 屬性都依賴於另一個 computed 的結果，導致永無止境的相互依賴。

```
const a = computed(() => b.value + 1);
const b = computed(() => a.value + 1); // 會將導致循環依賴

// 因該有個固定響應式資料數據源基礎
import { ref, computed } from 'vue';

const baseValue = ref(1);

const a = computed(() => baseValue.value + 1);
const b = computed(() => a.value + 1);
```


-----

### 真的需要將複雜計算邏輯抽離，要注意合理的依賴管理

有時候我們真的要對單個或多個數據源，進行一些比較耗能或複雜的計算邏輯，可能需要分解複雜邏輯而形成computed依賴，`應確保每個computed都能忠實反映數據源和保持連貫性，避免造成資料流斷鍊`。

像是下單後常見的產品售價和折價計算案例，是一段流程且有一些商業邏輯計算:

```
 // 計算產品原價
  const originalPrice = computed(()=> {
    return this.product.basePrice * this.product.quantity;
  })
  
 // 計算折扣，確保折扣計算正常進行
  const discountAmount = computed(()=> {
    if (this.discount && this.discount > 0) {
      return this.originalPrice * (this.discount / 100);
    }
    return 0;
  })

  // 計算稅額，確保稅率存在時才計算
  const taxAmount = computed(()=> {
    if (this.taxRate && this.taxRate > 0) {
      return (this.originalPrice - this.discountAmount) * (this.taxRate / 100);
    }
    return 0;
  })
  
  // 計算最終價格，忠實反映數據源
  const finalPrice() = computed(()=> {
    return this.originalPrice - this.discountAmount + this.taxAmount;
  })
```



-----

### 避免在 computed 中執行非同步行為

`computed`初衷目的是基於其他響應式數據進行同步計算並返回結果，它預期返回一個值。

如果數據源沒有辦法被穩定的追蹤，或可能有不可預期狀況產生(例如api錯誤，導致沒有資料回傳)，這樣沒辦法保證computed 能夠正常運作。

另外，如果數據源頻繁更動，`api非同步得請求之間得競態情況發生(race condition)`，回傳資料的重疊性也會造成`computed`數據來源不正確性。

```
// computed 非同步請求錯誤
const fetchData = computed(() => {
 axios.get('/api/data').then(response => {
 data.value = response.data;
 });
});
// 推薦：將請求邏輯放在其它async function或onMounted中
function fetchData () {
 axios.get('/api/data').then(response => {
 data.value = response.data;
 });
};


```


-----

###　適當地在computed 內捕捉錯誤，並預設回傳值確保資料不會斷鍊

假設`computed`內我們需要執行一段過濾函式，比方說找出某位會員id = 100的someMethod 函式，結果因為這個函式可能突然變動邏輯出現錯誤，導致computed 也接收到錯誤無法返回ref物件。

比較穩健做法可以善用try/catch，並定義好錯誤情況發生時的回傳值。

```
const safeCalculation = computed(()=>{
try {
      return someData.someMethod();
    } catch (error) {
      console.error('Error in computation:', error);
      return null; // 返回一個默認值
    }
  }
}) 
```



-----

### 只有響應式資料(ref/reactive)才會被computed 當作追蹤數據源

常見的問題像是元件內顯示時間，Date 物件產生出來的時間資料，放到`computed`以為它會隨著系統時間更新而自動響應。

`new Date()`在`computed`中只會在元件初始化(onMounted)時被計算一次，因此 currentTime 不會隨著時間自動更新。

```
 const currentTime = computed(()=> {
    return new Date().toLocaleTimeString(); // 這樣的計算不會自動更新
  })
```

我們必須將new Date() 定義至響應式物件ref中，自己設置個計時器去更新數據源，讓computed追蹤後更新到畫面上，程式碼可能用比較多組合式概念(composable)，理解響應式資料(ref/reactive)才會被computed當作追蹤數據源，一般普通物件資料是不會被追蹤，這個觀念就行囉。

```
import { ref, computed, onMounted, onUnmounted } from 'vue';

// 將時間管理邏輯提取為一個函數
export function useCurrentTime() {
  const currentTime = ref(new Date()); // 儲存當前時間

  // 定時更新時間
  const updateTime = () => {
    currentTime.value = new Date();
  };

  // 設置和清除定時器
  let intervalId;

  onMounted(() => {
    intervalId = setInterval(updateTime, 1000); // 每秒更新一次
  });

  onUnmounted(() => {
    clearInterval(intervalId); // 清除定時器
  });

  // 使用 computed 來格式化時間
  const formattedTime = computed(() => {
    return currentTime.value.toLocaleTimeString();
  });

  return {
    formattedTime
  };
}
```


-----

## 總結:

1. computed 能幫我們自動聲明式地(declarative)，追蹤單個或多個響應式數據來源，並且執行一些計算，同時能夠`具有緩存(cache) 計算結果`，並免過多計算邏輯在樣板上。

2. computed 核心設計理念為忠實反應數據來源，並且`預設單向資料導向去取得數據做計算(default getter)`，可以視為響應式數據的衍伸，`返回值為ref物件`。

3. 但也有一些缺點和限制，例如`不能放置非同步邏輯(呼叫api等)`，想要監測依賴數據源其中某一來源，並且作對應操作，甚至執行大量副作用會比較不適合，這就比較適合之後會談到的watch 、watchEffect 囉。



-----

## 學習資源:

https://vuejs.org/guide/essentials/computed.html (官方文件)


