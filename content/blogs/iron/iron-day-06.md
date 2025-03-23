---
title: Vue 的響應式系統- Ref 
date: 2024-09-19
description: 認識 Vue 提供的響應式資料API-ref()。
image: /iron/day6/iron-day6-logo.png
alt: Vue-ref
ogImage: /iron/day6/iron-day6-logo.png
tags: ['Vue','鐵人賽']
published: true
---
# Vue 的響應式系統- Ref 

## 今日學習重點 :

`ref()`使用時為什麼總是要加.value?

`ref()`可以針對一般型別(primitive)和物件型態資料使用

`樣板(template)`對於ref資料自動解構的限制


-----

## Vue ref -內部運作機制

ref() 本身可以針對`一般類型資料(字串或數字等)`，進行響應式資料綁定，當我們要對資料更新時，需要以`.value`呼叫，Vue才有辦法偵測到我們綁定的資料需要更新。

官方其實有提及，在標準JS語言中，對於一般型態資料並沒有任何機制能夠偵測到異動，除了使用物件definePropert或Proxy代理物件。

[官方文件](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#why-refs)給了一段psudeo code，使用ref裝入資料時，我們在對ref取值或是賦予新值時，會有類似getter/seter 屬性操作攔截器的功能，虛擬碼大概像下面這樣。

```
// pseudo code, not actual implementation
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

不過有興趣了解的話，真正`ref`的實現本質上是一個類別 (class)，而不是單純透過物件的 getter 和 setter 來管理其值。

`ref` 在Vue的實作上是透過一個創建 `RefImpl` 的class類別來實作，它內部封裝了 value屬性，當讀取或修改這個 value 時，是透過觸發對應的getter/setter function，之後才會連動 Vue 的響應式系統。
如果使用console.log去打印`ref`，應該內部也會出現`RefImpl` 這個實例物件的蹤跡。

```
class RefImpl<T = any> {
  _value: T
  private _rawValue: T

  dep: Dep = new Dep()

  public readonly [ReactiveFlags.IS_REF] = true
  public readonly [ReactiveFlags.IS_SHALLOW]: boolean = false

  constructor(value: T, isShallow: boolean) {
    this._rawValue = isShallow ? value : toRaw(value)
    this._value = isShallow ? value : toReactive(value)
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }

  get value() {
    if (__DEV__) {
      this.dep.track({
        target: this,
        type: TrackOpTypes.GET,
        key: 'value',
      })
    } else {
      this.dep.track()
    }
    return this._value
  }

  set value(newValue) {
  // 略
  }
}

```

不過為什麼`ref`選擇以`RefImpl `物件getter/setter實現，而不使用`Proxy代理物件`? 自己理解後大概有以下原因:

ref 主要是用來封裝`一般原始值(primitive value）`的成為響應式物件。它在封裝時只需要追蹤一個簡單的值或對象。

因為主要封裝的是單一值，就不需要 Proxy 來攔截對象中的每個屬性訪問，因為不像物件有新增屬性的可能，使用普通的物件 (object) 來封裝值更簡單，比起動用Proxy 的操作，應該也更節省效能些。

`ref` 的主體應該主要是彌補`reactive`對於一般型別資料不能作用的限制，負責封裝原始值的響應性，而不是處理複雜對象的深層監控，這樣的選擇既簡化了實現，也優化了性能。

-----
## ref() 也提供給物件類型資料使用，並且也具有深層響應的特性

> Non-primitive values are turned into reactive proxies via reactive()

[官方文件(Deep Reactivity)](https://vuejs.org/guide/essentials/reactivity-fundamentals.html#deep-reactivity)有提到，如果是非原始值資料傳入，`ref()` 內會透過 `reactive`，利用遞歸方式處理並掛上proxy，達成深層響應式，就可以達到下面程式碼ref()物件內部屬性資料變動時，畫面也會更新。

```
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // these will work as expected.
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```
ref 內部其實是透過`createRef()`，去產生RefImpl 物件實例。

每次調用cretaeRef時都會先經過`toReacitve`去判斷帶入的資料是否為`物件`，是的話則會產生`reactive`，若是原始值的話就產生剛剛的`RefImpl`就行。

[原始碼出處](https://github.com/vuejs/core/blob/main/packages/reactivity/src/ref.ts#L55)

大概看一下摘要重點流程:

我們使用的ref其實會呼叫另一個`createRef()`

```
export function ref(value?: unknown) {
  return createRef(value, false)
}
```
createRef()建構子每次產生refImpl時會經過`toReactive`
```
function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}
```
產生`RefImpl`實例後`toReactive`中判斷是否為物件，是的話產生reactive物件
```
  constructor(value: T, isShallow: boolean) {
    this._rawValue = isShallow ? value : toRaw(value)
    this._value = isShallow ? value : toReactive(value)
    this[ReactiveFlags.IS_SHALLOW] = isShallow
  }
  // toReactive
  export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value
```



-----
## ref響應式資料的自動解包限制(unwrapping limitation)

Vue 會自動解包那些作為模板上下文中的，**頂層屬性的 ref**，`但如果 ref 是嵌套在物件或數組中，則不會自動解包，你需要手動使用 .value 來獲取其值。`

`頂層的意思:`

如果以setup編譯後作用域來說，就是setup裡面所有定義ref的頂層變數，Vue template會自動將.value解析出來，如果是包在物件或陣列裡面則無法自動解包，會直接得到RefImpl物件。

像是範例程式碼object物件裡面包著`ref` ，因為第一層不是ref ，放到樣板後無法直接轉換提取當中.value數值，就被樣板編譯以`JS隱性轉型方式轉成字串[object Object]`呈現在畫面中。

```
const count = ref(0)
const object = { id: ref(1) }

{{ object.id + 1 }} // 樣板中會變 [object Object]1 JS轉型變字串

const { id } = object // 解構賦值成為頂層ref
{{ id }} // 可以直接在樣板中調用，因為已經將內部ref提取出變成頂層了
```



-----
## 總結:

很多人剛開始接觸Vue一定會疑惑， ref做到的事情，為什麼還要用reactive之類的謎因，不過正如很多討論或文章得到的結論，不要因為開發工具的功能侷限自己使用上的選擇，而是根據團隊訂定的開發規範取捨使用囉。

我平常是比較常使用ref，但透過深入理解才知道原理底層和reactive相關，彼此間也都有一些細節上使用限制，所以理解兩者差異和設計模式在初期熟悉Vue上我覺得是必要的~



-----

## 學習資源:

1. https://blog.hinablue.me/vue3-mei-tian-lai-yi-dian-lei (ref vs reactive 小總結)
2. https://vuejs.org/guide/essentials/reactivity-fundamentals.html#ref (官方文件其實細節很多，細細品嘗會不一樣)


