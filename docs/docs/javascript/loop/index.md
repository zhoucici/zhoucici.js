---
{
  "title": "JS中的最快的循环",
  'description': "JS中的最快的循环"
}
---
# JS中的最快的循环
无论使用哪种编程语言，循环都是一种内置功能。JavaScript 也不例外，它提供了多种实现循环的方法，偶尔会给开发人员带来困惑：哪一种循环才是最快的？

以下是Javascript中可以实现循环的方法：
- For Loop
- While Loop
- Do-While Loop
- For-Of Loop
- ForEach Loop
- Map Loop
- Filter Loop
- Reduce Loop
- Some Loop
- Every Loop
- Find Loop
  
我们将对这些循环方法进行测试，以确定哪种方法最快。

为了比较每个循环的性能，我们将使用 `console.time()` 和 `console.timeEnd()` 方法来测量它们的执行时间。

用于测试的任务是：将 5000 万个项目从一个数组转移到另一个数组。

为确保公平比较，我们将异步运行每个循环。
```javascript
(async () => {
  const numbersList = [...Array(5000000).keys()];
  await usingForLoop(numbersList);
  await usingWhile(numbersList);
  await usingDoWhile(numbersList);
  await usingForOf(numbersList);
  await usingForEach(numbersList);
  await usingMap(numbersList);
  await usingFilter(numbersList);
  await usingReduce(numbersList);
  await usingSome(numbersList);
  await usingEvery(numbersList);
  await usingFind(numbersList);
})()
```
## For Loop

```javascript
const usingForLoop = async (array) => {
  console.time('FOR LOOP');
  const newNumbersList = [];
  for (let i = 0; i < array.length; i++) {
    newNumbersList.push(array[i]);
  }
  console.timeEnd('FOR LOOP');
}
```

## While Loop
```javascript
const usingWhile = async (array) => {
 console.time('WHILE');
 let i = 0;
 const newNumbersList = [];
 while (i < array.length) {
   newNumbersList.push(array[i]);
   i++;
 }
 console.timeEnd('WHILE');
}
```

## Do-While Loop
```javascript
const usingDoWhile = async (array) => {
  console.time('DO-WHILE');
  let i = 0;
  const newNumbersList = [];
  do {
    newNumbersList.push(array[i]);
    i++;
  } while (i < array.length);
  console.timeEnd('DO-WHILE');
}
```

## For-Of Loop
```javascript
const usingForOf = async (array) => {
  console.time('FOR OF');
  const newNumbersList = [];
  for (const item of array) {
    newNumbersList.push(item);
  }
  console.timeEnd('FOR OF');
}
```

## ForEach Loop

```javascript
const usingForEach = async (array) => {
  console.time('FOR EACH');
  const newNumbersList = [];
  array.forEach((item) => newNumbersList.push(item));
  console.timeEnd('FOR EACH');
}

```

## Map Loop

```javascript
const usingMap = async (array) => {
  console.time('MAP');
const newNumbersList = array.map((item) => item);
  console.timeEnd('MAP');
}
```

## Filter Loop

```javascript
const usingFilter = async (array) => {
  console.time('FILTER');
  const newNumbersList = array.filter((item) => item >= 0);
  console.timeEnd('FILTER');
}
```

## Reduce Loop

```javascript
const usingReduce = async (array) => {
  console.time('REDUCE');
  const newNumbersList = array.reduce((acc, item) => {
    acc.push(item);
    return acc;
  }, []);
  console.timeEnd('REDUCE');
}
```

## Some Loop

```javascript
const usingSome = async (array) => {
 console.time('SOME');

 const newNumbersList = [];
 array.some((item) => {
   newNumbersList.push(item);
   return false;
 });

 console.timeEnd('SOME')
}

```

## Every Loop

```javascript
const usingEvery = async (array) => {
  console.time('EVERY');

  const newNumbersList = [];
  array.every((item) => {
    newNumbersList.push(item);
    return true;
  });

  console.timeEnd('EVERY')
}

```

## Find Loop

```javascript
const usingFind = async (array) => {
  console.time('FIND');
  const newNumbersList= [];
  array.find((item) => {
    newNumbersList.push(item);
    return false;
  });
  console.timeEnd('FIND')
}

```

## 测试结果

其中一次结果如下
- FOR LOOP: 51.766845703125 ms
- WHILE: 40.76416015625 ms
- DO-WHILE: 69.847900390625 ms
- FOR OF: 64.572021484375 ms
- FOR EACH: 55.0419921875 ms
- MAP: 28.60400390625 ms
- FILTER: 57.072021484375 ms
- REDUCE: 64.758056640625 ms
- SOME: 84.6650390625 ms
- EVERY: 61.161865234375 ms
- FIND: 55.049072265625 ms

从多次结果可以看出，前5名分别是:

- 1.Map
- 2.For Loop(浮动)
- 3.While(浮动)
- 4.Do While(浮动)
- 5.For Each

## 结论
从测试结果看Map和For Loop的循环效率相差不大，大家可以根据需要做选择。map 无法中途退出，但可以返回一个新的数组。