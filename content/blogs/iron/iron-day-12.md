---
title: Vue 監聽器副作用的清除
date: 2024-09-25
description: 清理過期副作用(clean up invalidate effect)。
image: /iron/day12/iron-day12-logo.png
alt: Vue-cleanup-invalid-side-effect
ogImage: /iron/day12/iron-day12-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue 監聽器副作用的清除

## 今日學習重點:

1. 認識watch 回調函式中`onCleanUp`的功能
2. 如何清除過期的副作用，避免api競態狀況
3. Vue 3.5 新推出的`onWatcherCleanup`


-----

## 監聽器清除上一次副作用的回調(onCleanup)

在 `watch`中，`onCleanup`函數是為第三個參數傳遞並可以傳給watch的回調函數(call back)作為清理副作用。

這個 onCleanup 函數允許你在監聽器或效果停止時執行清理操作。例如，你可以使用它來清除訂閱、移除事件監聽器或取消 API 請求，確保應用程序資源不會被浪費。它的作用是讓開發者在某些狀況下能夠妥善處理副作用。

```
watch(id, (newId, oldId, onCleanup) => {
  // ...
  onCleanup(() => {
    // cleanup logic
  })
})
```
`watchEffect`中`onCleanup`則是第一個參數，可以直接傳入回調函數(call back)作為清理副作用。。
```
watchEffect((onCleanup) => {
  // ...
  onCleanup(() => {
    // cleanup logic
  })
})
```


-----
## 不清除不必要副作用會有什麼問題?

來看一下範例應該會比較清楚，下面有一個輸入框可以在裡面輸入數字，我們用watch 監聽輸入框得值，有變動的話會呼叫api獲取新的圖片，用`Promise`和`setTimeout`延遲一下回傳時間為3秒。

如果我們不利用`onCleanup`和預設一個`expired`標誌，作為api資料過期依據，在反覆輸入過程中應該會陸續看到多張圖片重疊更換的現象，也就是受到不必要的副作用干擾影響，發出去的request請求沒有適時處理清除掉，因為前面發出去的請求不一定會先回傳資料，會有所謂`api競態狀況(race condition)問題`。

有看到別篇文章很深入的解說源碼，其實`onCleanup`簡單來說有點類似註冊放在另一個`閉包(closure)作用域`。 當watch 真正的回調函式執行前，先去執行上一次註冊在onCleanup 內的函式，把上一個執行環境內的expired改成true，如果api回應時間還在等待，後續就不會進到image.value = res。

```
watch(message, async (newVal, oldVal, onInvalidate) => {
  let expired = false
  let data = ''
  onInvalidate(() => expired = true)
  
  try {
    let res = await new Promise((resolve) => {
      setTimeout(() => {
        console.log('call api')
        const id = Math.floor(Math.random() * 10) + 1
        resolve(`https://picsum.photos/id/${id}/300/300`)
      }, 3000)
    })
    
    if (!expired) {
      image.value = res
    }
  } catch (error) {
    console.error('Error:', error)
  }
})
```

-----

`onCleanup` + `Abort Signal` 引入JavaScript fetch 達到取消請求，也是另一種作法。

```
import { ref, watch } from 'vue'

const message = ref('')
const image = ref('https://picsum.photos/200/300/')

watch(message, async (newVal, oldVal, onCleanUp) => {
  
  const controller = new AbortController()
  const signal = controller.signal


  onCleanUp(() => {
    console.log('onInvalidate triggered')
    controller.abort() // 取消請求
  })
  
  try {
    const id = Math.floor(Math.random() * 10) + 1
    // fetch 方法 接收abort signal會中斷請求
    const response = await fetch(`https://picsum.photos/id/${id}/300/300`, { signal })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // 如果请求未被取消 會更新圖片
    image.value = response.url
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch request was aborted')
    } else {
      console.error('Fetch error:', error)
    }
  }
})
```


-----
## Vue 3.5 推出的onWatcherCleanUp

屬於還滿新的Vue版本更新功能，官方給的案例如下，不過看起來好像只是把清理函式，換個方式抽出監聽器另外註冊，官方給的範例看不太出差異~

```
import { watch, onWatcherCleanup } from 'vue'

watch(id, (newId) => {
  const controller = new AbortController()

  fetch(`/api/${newId}`, { signal: controller.signal }).then(() => {
    // callback logic
  })

  onWatcherCleanup(() => {
    // abort stale request
    controller.abort()
  })
})
```

因為功能太新了，社群上還沒太多案例，不過有人分享[文章](https://codlin.me/blog-vue/vue-3-5-update-on-watcher-cleanup-with-the-forgotten-on-cleanup)如果`onWatcherCleanUp`做在`共用邏輯組合式函式(composable)`可能比較有使用上差異，composable觀念之後我們也會介紹~

#### 將原本獲取圖片的fetch函式改成用composable function改寫:

```
import { onWatcherCleanup, shallowRef, onBeforeUnmount } from 'vue'

export function useFetchPhoto() {
  const abortController = shallowRef();

  /** 元件解除前，自動取消請求 */
  onBeforeUnmount(() => {
    abortController.value?.abort()
  });

  /** getData 實際發送請求的主體 */
  function getData(id) {
    return new Promise((resolve, reject) => {
      const controller = new AbortController()

      fetch(
        `https://picsum.photos/id/${id}/300/300`,
        { signal: controller.signal }
      )
        .then((res) => res.json())
        .then((value) => resolve(value))
        .catch((error) => {
          // 忽略終止錯誤
          if (error.name === 'AbortError') return;
          reject(error);
        })

      // 只要在 watcher 範圍內會自動取消前一次請求
       
      onWatcherCleanup(() => {
        controller.abort()
      }, true)

      abortController.value = controller;
    })
  }

  return {
    getData   
 }
  
}
```
#### 元件引入使用

使用`onWatcherCleanUp`和原本在每一個`watch`監聽器需要自己設定`onCleanUp`清除副作用不一樣，只要引入`watch`或`watchEffct`，會自動在監聽器作用域(scope)內，每一次回調觸發時先自動執行清除函式。


```
<script setup>
import { ref, watch } from 'vue'
import { useFetchPhoto } from './useFetchPhoto.js';

const message = ref('')
const image = ref('')

const { getData } = useFetchPhoto(); // 呼叫取得相片資料

watch(id, async (newId) => {
  image.value = await getData(newId); 
  // 這裡就不用再引入onCleanUp getData定義好的onWatcherCleanUp會自動在watch作用域內清除
})

async function getData() {
  id.value = crypto.randomUUID();
}
</script>


<template>
  <div id="app">
    <input v-model.lazy='message'/>
    <p>
      Learn more with the
      <a
        href="https://vuejs.org/"
        target="_blank"
        rel="noopener"
      >Vue Docs &amp; Resources</a>.
    </p>
    <img :src="image" />
  </div>
</template>
```



-----
## 總結

1. `監聽器watcher副作用的清除`算是滿重要的小細節，因為它可以有效`防止內存洩漏`、`競態條件`造成的無效資料回傳造成的狀態更新等問題，特別是在處理異步操作（如 API 請求）或需要清理資源（如計時器、訂閱、DOM 操作）時。
2. Vue 3.5 推出`onWatcherCleanUp`能自動在監聽器作用域內，在每一次監聽器回調執行前進行清除的動作，不過使用起來還是比隱晦不易察覺，一般清理副作用動作可以用原本`onCleanUp`定義就行囉。

[watcher cleanUp flow流程圖](https://dev.to/alexanderop/vue-35s-onwatchercleanup-mastering-side-effect-management-in-vue-applications-9pn)
![https://ithelp.ithome.com.tw/upload/images/20240925/20145251wb1msbAIdy.png](https://ithelp.ithome.com.tw/upload/images/20240925/20145251wb1msbAIdy.png)


-----

## 學習資源

1. https://codlin.me/blog-vue/vue-3-5-update-on-watcher-cleanup-with-the-forgotten-on-cleanup
2. https://dev.to/alexanderop/vue-35s-onwatchercleanup-mastering-side-effect-management-in-vue-applications-9pn
3. https://blog.vuejs.org/posts/vue-3-5 (onWatchCleanUp)