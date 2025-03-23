---
title: Vue元件Props和響應式物件資料的驗證(customRef) 
date: 2024-09-27
description: 認識defineProps針對基本的props類型檢查。
image: /iron/day14/iron-day14-logo.png
alt: Vue-Props-And-customRef
ogImage: /iron/day14/iron-day14-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue元件Props和響應式物件資料的驗證(customRef) 

Vue元件彼此溝通傳遞時，一定會用到的props參數，主要功能是將父組件的資料由上至下傳入子組件渲染。   
不過，開發實務上比較頭疼的是，有可能在專案規模越來越大時，多人協作上比較難管控傳遞的參數型態是否正確。  
當然也可以硬性選擇Typescript執行編譯上的靜態檢查，不過需要考慮團隊整體工程師是否都熟悉Typescript，  
或是舊專案本身的相容性等因素，直接冒然引入似乎不是最好的選擇。  
本篇來談談 defineProps 在相對複雜的資料(物件或陣列)，驗證上有沒有相對好的作法，而且不會讓對Typescript剛接觸或零經驗的工程師感到頭疼。

## 今日學習重點:

1. defineProps validate 驗證功能和原生一般物件驗證方法
2. Zod.js 創建schema協助物件props驗證
3. 如何利用 Zod.js 定義一般函式(function)輸入和輸出
4. 製作一個ref驗證響應式資料的型別檢查器-認識`customRef`



-----
## defineProps validate 驗證功能

Vue 3 元件開發時我們可以使用`defineProps`時，會針對每一個 props 屬性進行定義。這通常包括為每個 props 指定其數據類型（例如 String、Number 或 Object 等），同時也可以設置該 props 是否為必須傳入，提供預設值等。

針對複雜型的資料型態物件或陣列我們則可以使用`validate函式`，定義回傳值，如果驗證函式驗證後不合格返回false，在開發環境下瀏覽器會出現Vue warn黃色警示。

```
defineProps({
  title: {
    type: String,
    requiered: true,  // 必須傳入
    default: '123' // 未帶入組件時預設值
  }
  
  likes: Number
})
// 或是已經有特定範圍選項
  validator(value, props) {
      // The value must match one of these strings
      return ['success', 'warning', 'danger'].includes(value)
    }
```

比較複雜的物件，如果要確保內部屬性型別，驗證函式內容可以使用原生`typeof`來做驗證，不過顯得比較冗長些。

```
<script setup>
import { toRefs } from 'vue';

// 定義 props，這是 `defineProps` 語法糖
const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator(value) {
      // 驗證器來確保資料符合所需的結構
      return (
        typeof value.id === 'number' &&
        typeof value.name === 'string' &&
        typeof value.details === 'object' &&
        typeof value.details.description === 'string' &&
        typeof value.details.isActive === 'boolean'
      );
    },
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
});

</script>

```

那麼有更簡潔閱讀性比較高的類型檢查輔助工具(除了TypeScript)?

我們來選擇[Zod.js](https://zod.dev/?id=introduction)用用看，是以TypeScript支援優先，但官網也提及如果是單純用JavaScript也可以支援，是一套`對資料先定義schema架構再做解析(parse)驗證的工具`~

使用步驟也滿簡單:

### - Zod Schema 定義：
我們使用 Zod 的 z.object({…}) 來定義 data 的結構，包括它的內部物件 details。

### - validator 函數：
在validator 函數中，我們使用 schema.safeParse(value) 方法來驗證傳入的 data 是否符合定義的 Zod 結構。

### - safeParse: 
```
.safeParse
.safeParse(data:unknown): { success: true; data: T; } | { success: false; error: ZodError; }
```
和另一個pare()解析方法不太一樣，驗證成功或失敗都會返回一個物件，避免拋出錯誤造成程式中斷，該物件包含成功訊息是布林值Boolean，如果失敗的話可以會有error物件。

看起來程式碼閱讀性上提升了不少:

```
<script setup>
import { z } from 'zod';

const DataSchema = z.object({
  id: z.number(),
  name: z.string(),
  details: z.object({
    description: z.string(),
    isActive: z.boolean(),
  }),
});

const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => DataSchema.safeParse(value).success,
  },
  isEditable: {
    type: Boolean,
    required: true,
  },
});
</script>
```


-----

### 一般函式(function) 參數和返回值驗證

既然提到了資料型別驗證和認識了Zod.js工具，一個組件除了props傳入的參數外，元件內部定義的funciton函式，帶有傳入的`參數(arguments)`和`返回值(return value)`，為了保持型別穩定度，其實也可以用Zod.js加強驗證，專案某些函式接收到`參數(arguments)是一個資料稍微複雜結構就滿實用的`，避免源頭傳入的參數不對，造成不必要錯誤。

### 複雜的物件schema檔案 
`schema.js`

```
import { z } from 'zod';

// 定義 User 的輸入資料結構
export const UserInputSchema = z.object({
  user: z.object({
    id: z.number().int(),
    name: z.string(),
    role: z.enum(['admin', 'user', 'guest']),
    details: z.object({
      age: z.number().int().positive(),
      email: z.string().email(),
    }),
  }),
  isActive: z.boolean(),
});

// 定義回傳值的結構
export const OutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  processedUserId: z.number().int().positive(),
});
```
### 元件component使用

不過就個人感覺來說，簡單的一般型別參數的函式基本上不太會全部引用`Zod.js`，畢竟撰寫的shema架構也是會讓專案變龐大，通常是對表單這種資料很多元又集中送出的元件，就可以考慮使用幫助驗證檢查。

```
<script setup>
import { ref } from 'vue';
import { UserInputSchema, OutputSchema } from './schemas';  // 引入 schema

// 定義內部的 function，並在 function 內進行參數驗證和回傳值驗證
function processUserData(input) {
  // 驗證參數
  const parseResult = UserInputSchema.safeParse(input);
  if (!parseResult.success) {
    return {
      success: false,
      message: '無效的輸入資料',
      processedUserId: -1,
    };
  }

  const userData = parseResult.data;

  const result = {
    success: true,
    message: `使用者 ${userData.user.name}（ID: ${userData.user.id}）資料已處理完畢`,
    processedUserId: userData.user.id,
  };

  const outputResult = OutputSchema.safeParse(result);
  if (!outputResult.success) {
    console.error('回傳值不符合預期的結構');
    return {
      success: false,
      message: '處理結果的結構不正確',
      processedUserId: -1,
    };
  }

  return outputResult.data;
}

// 測試數據
const input = ref({
  user: {
    id: 1,
    name: 'John Doe',
    role: 'admin',
    details: {
      age: 30,
      email: 'john@example.com',
    },
  },
  isActive: true,
});

const result = processUserData(input.value);
</script>
```


-----

## 響應式物件/陣列資料更動前傳入的資料的校驗

之前的文章已經認識`ref/reactive` Vue響應式資料綁定的API，不過使用開發上一定也出現過某些疑慮，我們對`ref/reactive`更新數值時，還沒辦法確定傳入的值100%資料型態都是正確的，即便我們可能一開始對響應式資料定義好物件或陣列結構。

可以同樣用`Zod.js`寫一個對響應式資料更動前的驗證function，確保帶入新的資料，和原本一開始定義的型態結構相同。

```
import { ref} from 'vue';
import { z } from 'zod';

// 定義 Zod Schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
});

// 創建一個響應式資料
const user = ref({
  name: 'John Doe',
  age: 30,
});

// 定義對響應式資料更新前的驗證函式
function handleUserChange(newUser) {
  // 檢驗傳入新值前的資料型態是否正確
  const {success, data} = userSchema.safeParse(newUser); // 解構賦值提取出解析訊息和資料
  
  if (!success) {
    console.error('Validation failed:', result.error.issues);
  } else {
    console.log('Validated user:', result.data);
    user.value = data  // 驗證schema通過才對響應式資料更新
  }
}

```



-----
### customRef

不過上面那種寫法發現還要自己掛監聽器，或事件來觸發型別檢查和響應式資料更新，後來發現Vue其實有提供一款進階API-`customRef` ([官方文件](https://cn.vuejs.org/api/reactivity-advanced.html#customref)):
 
> customRef用來創建自定義的 ref。其主要功能是允許開發者自定義 `getter` 和 `setter`，從而可以控制值的讀取和設置行為。
> Vue 通常會自動追蹤資料的變更並觸發更新，但 customRef 允許開發者手動控制這個過程。

`customRef`基本結構長這樣，主要關注在track()和trigger()這兩個動作的控制順序

- track()：手動告知 Vue 需要追蹤資料的讀取操作，以實現反應性。
- trigger()：當資料變更時手動觸發 Vue 的更新機制，更新相關的Virtual DOM 或計算屬性Computed資料

再複習一下Vue的響應式原理:

- get: 對響應式資料ref取值觸發
- set: 對響應式資料ref賦值觸發


`註: customRef 提供的get、set和track、trigger，其實官方有說明是利用工廠函式(factory)回傳值暴露給我們調用的~所以我們才能夠決定它們的執行擺放順序`

![https://ithelp.ithome.com.tw/upload/images/20240927/20145251NiO2ZNv82F.png](https://ithelp.ithome.com.tw/upload/images/20240927/20145251NiO2ZNv82F.png)


```

customRef((track, trigger) => {
    let value
    return {
      get() {
        track();  // 讓 Vue 追蹤這個 ref
        return value;  // 返回 value
      },
      set(newValue) {
        value = newValue;  // 更新 value
        trigger();  // 通知 Vue 更新
      }
  };

```

使用上有點像將你要置入的驗證邏輯或是計時器等功能，安插在`track()`、`trigger()`之前，自己定義在響應式資料更新前要處理那些操作。

### 常見用途: 響應式資料自訂義驗證、資料觸發定時器防抖(debounce)等

這麼寫的話邏輯就很明確，我們只要對響應式資料有變動時，在Vue畫面更新及賦值前會做一道驗證程序，來確保傳入資料的格式正確。

```
<script setup>
import { customRef } from 'vue';
import { z } from 'zod';

// 定義 Zod Schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be a positive number"),
});

// 定義一個 customRef 來封裝驗證邏輯
function useValidatedUser(initialValue) {
  return customRef((track, trigger) => {
    let value = initialValue;

    return {
      get() {
        track();  // 告知 Vue 追蹤這個變數的反應性
        return value;
      },
      set(newValue) {
        const result = userSchema.safeParse(newValue);

        if (result.success) {
          console.log('Validated user:', result.data);
          value = newValue;
          trigger();  // 通知 Vue 更新響應式資料
        } else {
          console.error('Validation failed:', result.error.issues);
        }
      },
    };
  });
}
```


-----

## 總結:

1. `defineProps` 的驗證功能適合基本的 props 類型檢查，而對於複雜結構，可以結合 Zod.js 來加強驗證，確保數據結構的正確性。
2. Zod.js 不僅可以用於 `props 驗證`，還能用來`定義函數的輸入/輸出`，提供強大的型別保證。
3. Vue `customRef` 允許創建自定義的 `ref`資料更新前附加攔截動作，並可以結合 Zod 來實現型別檢查與驗證，適合在響應式數據更新時進行即時驗證。



-----

## 學習資源:

1. https://ithelp.ithome.com.tw/m/articles/10271768 (一些TS基本概念，可以先理解，對於Zod使用上有幫助)
2. https://dev.to/jareechang/zod-the-next-biggest-thing-after-typescript-4phh#striking-the-right-balance
3. https://cn.vuejs.org/guide/components/props.html#prop-validation
4. https://cn.vuejs.org/api/reactivity-advanced.html#customref
