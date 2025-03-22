---
title: JavaScript物件常見的操作方法
date: 2024-09-17
description: 介紹JavaScript物件常見的操作方法，對於深入研究Vue的響應式系統(Reactive System)實現運作補強知識。
image: /iron/day4/iron-day4-logo.webp
alt: JavaScript-Object-Methods
ogImage: /iron/day4/iron-day4-logo.webp
tags: ['JavaScript','鐵人賽']
published: true
---

# JavaScript物件常見的操作方法

**今日學習重點:**
1. JavaScript 物件(Object)如何創建、定義屬性和複製?
2. 物件有哪一些操作方法?



-----
**Object.create()-**

```
Object.create(proto, propertiesObject)
```

**功能: 創造新物件的靜態方法，也能夠繼承其他物件的原型(prototype)。**

可以用來精確控制物件的原型prototype，例如，讓新物件繼承自另一個物件

```
const animal = {
  eats: true,
  walk() {
    console.log('Animal walks');
  }
};

const dog = Object.create(animal);
console.log(dog.eats); // true，從 animal 繼承
dog.walk(); // "Animal walks"，從 animal 繼承的方法
```

第二參數可以客製化設定創立的物件可以被`列舉 enumerable`、`重設參數configurable` 或`覆寫writable`。
一般用字面值創建物件const obj = {}，上述參數預設都是true，物件屬性可以複寫重設。

`註解: 
ES5 (ECMAScript 5)：引入了 Object.getPrototypeOf()，為開發者提供了一個標準且一致的方式來取得物件的原型。
 object.prototype.__proto__ 也可以使用，但目前MDN解釋已經逐漸棄用。`

```
const obj = {}; // 字面值創建物件
const obj2 = object.create(null)

// 讓物件繼承另一個物件原有的方法或屬性
const proto = { greeting: 'Hello' };
const obj = Object.create(proto);

console.log(obj.greeting); // 'Hello'

// 這邊用getPrototypeOf檢查原型 兩個物件會指向同一個
console.log(Object.getPrototypeOf(obj) === proto); // true
console.log(dog.__proto__ === animal); // true

// 像這樣一但設定創建後，就不能重新覆寫b這個屬性和重新配置參數
const obj = Object.create({}, {
  b: {
    value: 2,
    writable: false,
    enumerable: false,
    configurable: false
  }
});

```


-----

**Object.defineProperty-**

```
Object.defineProperty(obj, prop, descriptor)
```
**功能: 用來增加物件的新屬性，一樣有propertiesObject 參數可以設定被列舉 enumerable、重設參數configurable 或覆寫writable ，這些稱作`資料描述符（Data Descriptor）`**

另外有存取描述符（Accessor Descriptor），可以配置`get()/set()攔截器`，當對這項屬性取值(get)或賦予新值(set)時，會觸發對應function。


⚠️⚠️`需要注意資料描述符（Data Descriptor）和存取描述符（Accessor Descriptor）不能同時設定會導致錯誤產生`。

如果一開始設定configurable為false，那麼之後這個新增的屬性也不能被刪除，或附加新的get()/set()攔截器了，所以應該要小心地設置 configurable 屬性，關閉了該屬性就不能再被修改或刪除，除非重新創建一個新的物件。

```
const person = {};
Object.defineProperty(person, 'a', {
  value: 'name',
  writable: false,
  enumerable: false,
  configurable: true,
});

// 正確的存取描述符設定
Object.defineProperty(obj, 'prop', {
  get: function() { return 42; },
  set: function(value) { /* do something */ }
});

// 錯誤的描述符，會拋出異常，因為資料描述符和存取描述符不能同時設定
Object.defineProperty(obj, 'prop', {
  value: 42,
  get: function() { return 42; }
});
```


-----
**Object.assign-**

```
Object.assign(target, source1, source2, /* …, */ sourceN)
```

**功能: 用來複製或合併一個/多個物件可列舉enumerable屬性到目標物件(target)上，回傳值是`修改過的目標物件(modified object)`。**

因為有可能將原物件覆蓋掉，所以通做複製時會預設target = {}，合併複製後產生新的物件坐傳值，保持原始資料immutable，比較常用是用[展開運算子(spread operator)](https://vocus.cc/article/6545d0a3fd89780001c2ba3d)作物件合併。

`⚠️⚠️跟展開運算子很像，如果後面合併的物件有相同屬性名稱，後面順序同屬性的物件值會覆蓋掉前面的。`

```
const obj = { a: 1 };
// 不會直接使用原物件當作target，通常會給予空物件
const copy = Object.assign({}, obj); 
console.log(copy); // { a: 1 }

const obj1 = { b: 1}
const obj2 = { c: 2}
const obj3 ={...b,...c}
console.log(big3); // { b: 1, c: 2 }

// 有同屬性的物件，後面的物件會覆蓋掉前面同屬性的值
const o1 = { a: 1, b: 1, c: 1 };
const o2 = { b: 2, c: 2 };
const o3 = { c: 3 };

const obj = Object.assign({}, o1, o2, o3);
// 原有物件屬性c的資料被覆蓋了
console.log(obj); // { a: 1, b: 2, c: 3 } 
```



-----

#### 淺拷貝 vs 深拷貝

`Object.assign` 對物件的複製程度是`淺拷貝(swallow copy)`，對於嵌套在物件內部的物件或其他引用類型，Object.assign 只會複製其引用記憶體為位置(call by reference)。

近期JavaScript新版本特性，出了[structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone) 方法能夠深層複製物件，`不過IE瀏覽器不支援`，但有興趣還是可以來玩玩看。

![https://ithelp.ithome.com.tw/upload/images/20240917/20145251FaDPHJvBTO.png](https://ithelp.ithome.com.tw/upload/images/20240917/20145251FaDPHJvBTO.png)



-----
**Object.entries()-Object.keys()-Object.values 三兄弟**

#### Object.entries

因為物件是key-value pair形式的結構，Object.entries()會將物件key-value 所有轉成可列舉的 [key,value]陣列形式。

#### Object.keys

Object.keys() 是針對物件屬性(property)，轉成可列舉的 [key]陣列形式。

`⚠️⚠️特別的是，Object.keys 只處理字串形式的屬性，並返回這些key值的`。如果是數字屬性會被轉換為字串，這些字串會出現在 Object.keys 返回的陣列中，其它非字串或數字則不會出現在返回陣列中。

```
const obj = {
  [Symbol('sym')]: 'symbolValue',
  3: 'three',
  1: 'one',
  2: 'two'
};
// Symbol 則不出現在返回陣列中
console.log(Object.keys(obj)); // ['1', '2', '3'] (數字鍵被轉換為字串)
```

#### Object.values

Object.values()是針對物件值(value),轉成可列舉的 [value]陣列形式，小細節是轉成陣列的順序，`如果是數字屬性，排列順序會跟插入順序不太一樣，採數字由小到大升序排列`，使用上要稍微注意一下有沒有排序問題囉。

```
const obj = {
  a: 1,
  b: 2,
  c: 3
};
const obj1 = {
  3: 'three',
  1: 'one',
  2: 'two',
  a: 'alpha',
  b: 'beta'
};
console.log(Object.values(obj)); // [1,2,3]
console.log(Object.values(obj1));
// 返回值: ['one', 'two', 'three', 'alpha', 'beta']
// 數字鍵 1, 2, 3 按升序排列，字串鍵 a, b 按插入順序排列
```


-----
**Object.fromEntries()- ES2019(ES10)**

ES2019（ES10）引入的一個方法，可以接受一個可迭代對象（iterable）並將其轉換為一個物件。

這個可迭代對象通常是由一組鍵值對組成的數組。簡單來說，它能把一個 [key, value] 鍵值對的可迭代對象轉換為物件。

- [iterable-可迭代](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Iteration_protocols)

白話來說指的是任何可以被 for...of 循環遍歷的對象都是可迭代的，例如：`陣列（Array）`、`字串（String）`、`Map`和`Set`。

Map可以轉成物件很好用，但實務上使用Map不太會以這麼剛好[key, value]陣列這麼裝資料，但HashMap是可以直接利用轉成物件的。

```
// 簡單範例
const entries = [
  ['a', 1],
  ['b', 2],
  ['c', 3]
];

const obj = Object.fromEntries(entries);

console.log(obj); // { a: 1, b: 2, c: 3 }

// map 也可以轉
const map = new Map([
  ['x', 10],
  ['y', 20]
]);

const obj = Object.fromEntries(map);

console.log(obj); // { x: 10, y: 20 }

// 實務上比較常這麼使用
const myMap = new Map();
myMap.set('name', 'Alice');
myMap.set('age', 30);
myMap.set('city', 'New York');

const myObject = Object.fromEntries(myMap);

console.log(myObject); // { name: 'Alice', age: 30, city: 'New York' }
```

Object transformation 是MDN文件中比較有趣的用法，主要是很多陣列才有的prototype 方法(map,filter,forEach等)物件沒辦法用，所以可以先利用`Object.entries()` 先將資料轉成[key, value]陣列，再用`Object.fromEntries()` 乾坤大挪移變回物件。

同樣手法傳統for loop循環遍歷也是做得到的唷~magic😊😊😊

```
const object1 = { a: 1, b: 2, c: 3 };

const object2 = Object.fromEntries(
  Object.entries(object1).map(([key, val]) => [key, val * 2]),
);

console.log(object2);
// { a: 2, b: 4, c: 6 }


const obj = { a: 1, b: 2, c: 3 };
const newObj = {};

// 使用 for...in 循環遍歷物件的屬性
for (const key in obj) {
  if (obj.hasOwnProperty(key)) {
    newObj[key] = obj[key] * 2;
  }
}

console.log(newObj); // { a: 2, b: 4, c: 6 }
```



-----
**總結:**

大概是這幾個我自己實務比較常看到的物件操作手法，不一定常用但多少有耳聞，複習一下看看MDN的範例才有一種恍然大悟的感覺，有些感覺還滿有用的像是`物件和陣列互轉Object transformation`很常見，還有之前有看沒有懂的`defineProperty`，現在終於知道怎麼使用了。



-----
**學習資源:**

1. https://medium.com/youstart-labs/javascript-object-methods-every-developer-should-know-c68c132a658
2. https://www.digitalocean.com/community/tutorials/how-to-use-object-methods-in-javascript
3. https://www.cythilya.tw/2018/10/24/object/
4. https://javascript.info/object-methods (object this)
5. https://andyyou.github.io/2021/12/19/javascript-structured-clone-2021/#google_vignette (object deep copy)
6. https://ithelp.ithome.com.tw/articles/10250574 (鐵人賽文章ES新特性)
