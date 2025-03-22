---
title: JavaScript事件循環、宏任務和微任務 
date: 2024-09-23
description: 認識JavaScript事件循環(Event Loop)和非同步特性 。
image: /iron/day10/iron-day10-logo.png
alt: JavaScript-Event-Loop
ogImage: /iron/day10/iron-day10-logo.png
tags: ['JavaScript','鐵人賽']
published: true
---
# JavaScript事件循環、宏任務和微任務 

# 今日學習重點:

1. JavaScript單線程(Single Thread)和瀏覽器提供的非同步環境
2. 理解事件循環(Event Loop)核心觀念
3. 宏任務和微任務
4. 利用微任務實現批次更新(batch update)



-----

## Javascript其實是單線程(Single Thread)同步的程式語言

單線程顧名思義，JavaScript程式碼在讀取和執行過程中，同一時間只能做一件事，當有多個任務時，只能乖乖排隊按照上一順序的程式碼完成後，再執行下一個。

**- Call Stack 堆疊** 

另一個注意的重點是Call stack堆疊模式，當JavaScript讀取完函式或變數，存到記憶體的資料結構是堆疊(Stack)模式，這種資料結構具有`後進先出(LIFO, Last in First out)`的處理性質。而在每一次呼叫函式時，會把這個函式添加到堆疊的最上方，待執行完後才將函式從上方記憶體抽離。

至於當初設計者為什麼用單線程– 因為JavaScript主執行緒(main thread)是多線程的，可能會帶來很復雜的同步問題

– 比方說假定JavaScript同時有兩個線程，一個線程在某個DOM節點上添加內容，另一個線程刪除這個節點，這時瀏覽器應該以哪個線程為準？所以為瞭避免復雜性，JavaScript從誕生起就是單線程且同步執行。

-也因為是單線程，如果某段程式碼函式或迴圈需要執行的時間比較久，就會造成後面程式碼塞車而無法執行，造成所謂的`阻塞(blocking)`。

![img](https://thecodest.co/app/uploads/2024/05/stack.gif)
([圖片出處](https://thecodest.co/blog/asynchronous-and-single-threaded-javascript-meet-the-event-loop/))

所以當類似下面程式碼我們在一個函式裡面遞迴(recursive)呼叫時，因為程式碼不知道中止結束的時刻，而造成`記憶體一直推積外溢造成錯誤(Maximum call stack size exceeded)`。
```
function foo() {
    foo()
}
foo()
```



-----
## 非同步處理(Asynchronous)

由於 JavaScript 是單執行緒語言，一次只能執行一項任務，當某個任務運行過久時，可能會導致整個程式的阻塞問題。為了解決這個問題，JavaScript 本身需要依賴「其他機制」的協助，這些機制來自於 JavaScript 的「執行環境」，例如瀏覽器（Browser）或 Node.js 等等。這些環境提供了`非同步(Asynchronous) API` 幫我們解決問題:

以常見瀏覽器Web API為例:

**XMLHttpRequest(XHR)/Promise**：

像是利用串接第三方API資料，在等待資料回傳的過程中，如果整個網頁文件都在等他載入，那網頁畫面渲染可能就卡住。

**- setTimeout：**

視窗(Window)提供的 setTimeout函式， 去處理要晚一點發生的事情， setTimeout 會等待你所指定的時間，等到時間到了，再將需要發生的事件丟回 Javascript，讓 Javascript 知道說有這個事情排隊著要來觸發了。

**事件監聽器(Event lisenter)**：

使用`event.addEventListner`去獲得你要操作的 DOM 其實也是瀏覽器提供的API，會在使用者點擊或滑鼠摸過等指定事件才觸發供後續功能。



-----



## 事件循環(Event Loop)
> 概觀來說，所謂的 Event Loop，就是事件任務在 Call Stack 與 Callback Queue 間，非同步執行的循環機制。

1. 當原有的主線程式在執行過程中遇到非同步請求時，會將非同步任務交由 JavaScript 執行環境的瀏覽器 API 處理。
2. 主線的程式繼續執行，而每個非同步請求則各自進行處理，非同步的事件會在瀏覽器 API 中完成它們的工作。完成後，這些事件會將其對應的`回調函式（Callback Function）`放入`「任務佇列」（Task Queue）`中排隊等待。

**- 以 setTimeout和Axios為例：**

它的非同步機制是設定一個計時器，當時間到達指定秒數後，回調函式會被放入任務佇列中等待執行。類似地，使用 Axios 發送非同步請求時，在伺服器回應資料後，.then() 裡的回調函式也會被放入任務佇列中。

```
axios.get(`https://jsonplaceholder.typicode.com/todos/${num}`)
.then(res => res.data).catch(err => 'error') //call back function丟入任務佇列排隊的部分
```

同樣地，事件監聽器（addEventListener）也會在事件觸發時將回調函式放入 Web APIs 進行處理，然後在完成後回到任務佇列。
```
element.addEventListener("click", function(event) {
  console.log("Clicking the button!");  // call back function丟入任務佇列排隊的部分
});
```

## 小結:

JavaScript 的事件循環（Event Loop），是指透過瀏覽器引擎提供的環境，負責協調執行同步代碼、處理異步任務（如定時器、Promise 回調、I/O 操作等），並確保用戶界面在合適的時機更新。

`這些非同步請求的回調函式會在任務佇列中等待，等到「呼叫堆疊」（Call Stack）中的同步任務都完成後，才會逐一被放回到 Call Stack 中執行，這就是「事件循環」（Event Loop）運作的核心綱要。`

![](https://thecodest.co/app/uploads/2024/05/callback-queue.gif)
([圖片出處](https://thecodest.co/blog/asynchronous-and-single-threaded-javascript-meet-the-event-loop/))



-----

## 宏任務(MacroTask)和微任務(MicroTask)

實際上在每一次事件循環(Event loop)過程間還安插`微任務(MicroTask)`，相對於事件循環中的主要`宏任務(MacroTask)`兩種分類。

- **宏任務（MacroTask)：**

setTimeout
setInterval
DOM 事件（例如點擊事件）
XMLHttpRequest 回調事件


- **微任務（MicroTask）:**

微任務則是一些較小且執行優先級比宏任務高，主要包括：

promise.then() 後面接的回調函式
MutationObserver (偵測網頁DOM元素變化)
queMicroTask



-----

> A microtask is a short function which is executed after the function or program which created it exits and only if the JavaScript execution stack is empty, but before returning control to the event loop being used by the user agent to drive the script’s execution environment.

在MDN解釋中，微任務是一個短小的函數，會等到當前的 JavaScript 執行堆疊清空（即所有同步代碼執行完成），確保沒有其他代碼在執行時，才會執行微任務。

`另一個特點，優先於事件循環中宏任務(Macro Task)執行`：

指得是微任務會在控制權返回給事件循環（Event Loop）之前執行。也就是說，在事件循環開始下一個宏任務（如 setTimeout 回調）之前，所有的微任務會被先行執行。

比較好奇的是官方形容並沒有將微任務（Micro Task）併入事件循環的部分，而是用在返回下一次事件循環前，將JS執行的控制權順序先轉移給微任務，定義上先不用將微任務納入事件循環的一部分。

![https://ithelp.ithome.com.tw/upload/images/20240923/20145251tyT5HSr4pO.png](https://ithelp.ithome.com.tw/upload/images/20240923/20145251tyT5HSr4pO.png)
([圖片出處](https://ithelp.ithome.com.tw/articles/10222737?source=post_page))

我們來牛刀小試練習一下，下面的範例根據定義就能很清楚理解打印順序:

```
setTimeout(() => alert("timeout"));

Promise.resolve()
  .then(() => alert("promise"));

alert("global ex. context");

// 打印順序 global ex. context -> promise -> timeout
```



-----

## 微任務(MicroTask)的特性 - 清空當下任務佇列中的所有任務，不會等到下次事件循環

- **微任務（Micro Task）的特性在於：**

當它開始執行時，會清空當下「微任務佇列」（Micro Task Queue）中的所有任務。這與宏任務（例如 setTimeout）有所不同。

在事件循環（Event Loop）中，每次宏任務執行完畢後，會立即檢查是否有任何微任務，不同於宏任務需要等待下一次事件循環才能執行。

`微任務中的任務會在當前事件循環結束後立即提取並全部執行完畢。換句話說，微任務不會像 setTimeout 那樣延遲到下一次循環，而是會在當前循環內迅速清空微任務佇列。`


用個案例來說，假設有兩筆Promise同時被排入微任務，打印順序應該是下圖，不會有穿梭在setTimeout 宏任務中現象:

`setTimeout` 這類宏任務會將回調函數放入宏任務隊列，需要等待當前的所有微任務和同步代碼執行完畢，並且事件循環進入下一個宏任務階段時才會執行。

而 `promise.then()`、`queMicroTask`的回調會在當前同步代碼執行完後立即被執行，不會有宏任務彼此的等待時間，因此執行時機更快。

![https://ithelp.ithome.com.tw/upload/images/20240923/20145251qHmEbDqREg.png](https://ithelp.ithome.com.tw/upload/images/20240923/20145251qHmEbDqREg.png)

```
console.log('Script start');

// 宏任務
setTimeout(() => {
  console.log('setTimeout 1'); // 這是一個宏任務
}, 0);

// 微任務
Promise.resolve().then(() => {
  console.log('Promise 1'); // 這是一個微任務
});

Promise.resolve().then(() => {
  console.log('Promise 2'); // 這是一個微任務
});

console.log('Script end');

// 宏任務
setTimeout(() => {
  console.log('setTimeout 2'); // 這是一個宏任務
}, 0);
```



-----
## 微任務MicroTask批次更新應用(Batching operations)

在需要快速響應或高頻率操作的場景下，微任務擁有更高的執行優先級能夠在事件循環中的當前宏任完成後立刻被執行，而不必等到下一個事件循環的開始，因此適合用來處理需要快速反應的小型任務：

像是我們已經很熟悉的promise包裝過的網路請求fetch或axios，能夠一次發送多個請求同時，當response回傳資料也能夠迅速接收更新。

另一個是MDN提到微任務可以應用其中的一個案例，`批次更新(batch update)`:

這邊案例是使用`queMicroTask`去作微任務排程使用:

```
const queuedToSend = [];

function sendData(data) {
  queuedToSend.push(data);

  if (queuedToSend.length === 1) {
    queueMicrotask(() => {
      const stringToSend = JSON.stringify(queuedToSend);
      queuedToSend.length = 0;

      fetch("/endpoint", stringToSend);
    });
  }
}

sendData('msg1');
sendData('msg2');
sendData('msg3');
// "Processing batch: ['msg1', 'msg2', 'msg3']" 最終fetch只會呼叫api一次
```

- 說明:

微任務使用「先註冊，後收集」的運作方式

- **註冊微任務：**

當第一次有data資料輸入時，這意味著資料陣列剛剛開始累積資料。同時間，使用`queMicroTask`註冊一個微任務回調來處理這批消息。

- **收集資料：**

隨著後續的`sendData`調用，更多的消息會被推入 `queuedToSend`中。
因為微任務屬於非同步程式碼部分還沒有執行，這個推入動作還屬於同步操作，所以這些新的消息都會被順利地累積到同一個 queuedToSend 中。

- **微任務的批次更新：**

一旦所有的同步代碼完成，JavaScript 引擎會開始執行註冊的微任務。此時，queMicroTask 中的回調會開始執行，批量處理收集到的所有消息。

這樣`微任務回調將所有累積的訊息一併發送`，達到`批次更新(batch update)`的效果，這種設計非常適合需要合併多次操作以減少資源消耗和提升響應速度的場景。



-----

## Vue 的響應式資料批次更新

當你執行 `count.value++ `三次時，count 的值從 0 依次變為 1、2、3。

但是這些變更會被 Vue 的批次處理機制記錄下來，並不會馬上更新Virtual DOM 或多次觸發 watch 監聽器的回調，造成不必要的多次畫面渲染浪費。

- **批次更新：**

簡單的模式，Vue 會利用一個微任務佇列，來統一紀錄和處理所有這些變更，然後一次性觸發 watch 回調或是響應資料更新，這就是為什麼最後畫面顯示結果，是所有變更完成後的資料狀態。

批次更新，白話來說就是一次性觸發回調和更新，後續有下列流程：

- 收集追蹤本次要更動的數據資料。
- 一次性觸發 watch 回調，並傳入最新的響應式數據狀態。
- 將虛擬 DOM 的變更應用到真實 DOM。

因此，畫面顯示的結果是所有變更完成後的最終資料狀態，而不是每次變更時的中間狀態。這種做法避免了多次無效的 DOM 更新，優化了效能，使 Vue 的響應式系統更加高效。

```
import { ref, watch } from 'vue';

const count = ref(0);

// watch 監測 count 的變化
watch(count, (newVal) => {
  console.log('Count updated:', newVal);
});

count.value++; // 不會立即觸發 DOM 更新
count.value++; // 還是不會立即觸發
count.value++; // 直到微任務執行時，統一處理
```



-----

## 學習資源

1. https://yu-jack.github.io/2020/02/03/javascript-runtime-event-loop-browser/ (渲染模式)
2. https://thecodest.co/blog/asynchronous-and-single-threaded-javascript-meet-the-event-loop/) (理解事件循環)
2. https://ithelp.ithome.com.tw/articles/10222737?source=post_page
3. https://html.spec.whatwg.org/#microtask-queue
4. https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide

