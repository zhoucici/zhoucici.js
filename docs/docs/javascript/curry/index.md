---
{
    title:'函数柯里化',
    description:'函数柯里化实现方式、手搓函数柯里化'
}
---
# 函数柯里化

## 啥是柯里化（curry）
在数学和计算机科学中，柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

举例来说，一个接收3个参数的普通函数，在进行柯里化后，柯里化版本的函数接收一个参数并返回接收下一个参数的函数，该函数返回一个接收第三个参数的函数。最后一个函数在接收第三个参数后，将之前接收到的三个参数应用于原普通函数中，并返回最终结果。
```javascript
// 数学和计算科学中的柯里化：

//一个接收三个参数的普通函数
function sum(a,b,c) {
    console.log(a+b+c)
}

//用于将普通函数转化为柯里化版本的工具函数
function curry(fn) {
  //...内部实现省略，返回一个新函数
}

//获取一个柯里化后的函数
let _sum = curry(sum);

//返回一个接收第二个参数的函数
let A = _sum(1);
//返回一个接收第三个参数的函数
let B = A(2);
//接收到最后一个参数，将之前所有的参数应用到原函数中，并运行
B(3)    // print : 6
```
而对于Javascript语言来说，我们通常说的柯里化函数的概念，与数学和计算机科学中的柯里化的概念并不完全一样。

在数学和计算机科学中的柯里化函数，一次只能传递一个参数；

而我们Javascript实际应用中的柯里化函数，可以传递一个或多个参数。

来看这个例子：
```javascript
//普通函数
function fn(a,b,c,d,e) {
  console.log(a,b,c,d,e)
}
//生成的柯里化函数
let _fn = curry(fn);

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5
```
对于已经柯里化后的 _fn 函数来说，当接收的参数数量与原函数的形参数量相同时，执行原函数；当接收的参数数量小于原函数的形参数量时，返回一个函数用于接收剩余的参数，直至接收的参数数量与形参数量一致，执行原函数。

当我们知道柯里化是什么了的时候，我们来看看柯里化到底有什么用？

## 柯里化的用途
柯里化实际是把简答的问题复杂化了，但是复杂化的同时，我们在使用函数时拥有了更加多的自由度。
而这里对于函数参数的自由处理，正是柯里化的核心所在。
柯里化本质上是降低通用性，提高适用性。来看一个例子：

我们工作中会遇到各种需要通过正则检验的需求，比如校验电话号码、校验邮箱、校验身份证号、校验密码等，
这时我们会封装一个通用函数 checkByRegExp ,接收两个参数，校验的正则对象和待校验的字符串

```javascript
function checkByRegExp(regExp,string) {
    return regExp.test(string);  
}

checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
```
上面这段代码，乍一看没什么问题，可以满足我们所有通过正则检验的需求。 但是我们考虑这样一个问题，如果我们需要校验多个电话号码或者校验多个邮箱呢？

我们可能会这样做：
```javascript
checkByRegExp(/^1\d{10}$/, '18642838455'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13109840560'); // 校验电话号码
checkByRegExp(/^1\d{10}$/, '13204061212'); // 校验电话号码

checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@qq.com'); // 校验邮箱
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@gmail.com'); // 校验邮箱
```
我们每次进行校验的时候都需要输入一串正则，再校验同一类型的数据时，相同的正则我们需要写多次，这就导致我们在使用的时候效率低下，并且由于 checkByRegExp 函数本身是一个工具函数并没有任何意义一段时间后我们重新来看这些代码时，如果没有注释，我们必须通过检查正则的内容，我们才能知道我们校验的是电话号码还是邮箱，还是别的什么。

此时，我们可以借助柯里化对 checkByRegExp 函数进行封装，以简化代码书写，提高代码可读性。`
```javascript
//进行柯里化
let _check = curry(checkByRegExp);
//生成工具函数，验证电话号码
let checkCellPhone = _check(/^1\d{10}$/);
//生成工具函数，验证邮箱
let checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

checkCellPhone('18642838455'); // 校验电话号码
checkCellPhone('13109840560'); // 校验电话号码
checkCellPhone('13204061212'); // 校验电话号码

checkEmail('test@163.com'); // 校验邮箱
checkEmail('test@qq.com'); // 校验邮箱
checkEmail('test@gmail.com'); // 校验邮箱
```
再来看看通过柯里化封装后，我们的代码是不是变得又简洁又直观了呢经过柯里化后，我们生成了两个函数 `checkCellPhone` 和 `checkEmail`，`checkCellPhone` 函数只能验证传入的字符串是否是电话号码，
checkEmail 函数只能验证传入的字符串是否是邮箱，它们与 原函数 checkByRegExp 相比，从功能上通用性降低了，但适用性提升了。柯里化的这种用途可以被理解为：参数复用
我们再来看一个例子
假定我们有这样一段数据：
```javascript
let list = [
    {
        name:'lucy'
    },
    {
        name:'jack'
    }
]
```
我们需要获取数据中的所有 name 属性的值，常规思路下，我们会这样实现:
```javascript
let names = list.map(function(item) {
  return item.name;
})
```
看到这里，可能会有疑问，这么简单的例子，仅仅只是为了获取 name 的属性值，为何还要实现一个 prop 函数呢，这样太麻烦了吧。

我们可以换个思路，prop 函数实现一次后，以后是可以多次使用的，所以我们在考虑代码复杂程度的时候，是可以将 prop 函数的实现去掉的。

我们实际的代码可以理解为只有一行 let names = list.map(prop('name'))

这么看来，通过柯里化的方式，我们的代码是不是变得更精简了，并且可读性更高了呢。

## 如何封装柯里化工具函数
接下来，我们来思考如何实现 curry 函数。

回想之前我们对于柯里化的定义，接收一部分参数，返回一个函数接收剩余参数，接收足够参数后，执行原函数。

我们已经知道了，当柯里化函数接收到足够参数后，就会执行原函数，那么我们如何去确定何时达到足够的参数呢？

我们有两种思路：

- 通过函数的 length 属性，获取函数的形参个数，形参的个数就是所需的参数个数
- 在调用柯里化工具函数时，手动指定所需的参数个数

我们将这两点结合以下，实现一个简单 curry 函数：

```javascript
/**
 * 将函数柯里化
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数，默认为原函数的形参个数
 */
function curry(fn,len = fn.length) {
    return _curry.call(this,fn,len)
}

/**
 * 中转函数
 * @param fn    待柯里化的原函数
 * @param len   所需的参数个数
 * @param args  已接收的参数列表
 */
function _curry(fn,len,...args) {
    return function (...params) {
        let _args = [...args,...params];
        if(_args.length >= len){
            return fn.apply(this,_args);
        }else{
            return _curry.call(this,fn,len,..._args)
        }
    }
}
```
我们来验证一下：
```javascript
let _fn = curry(function(a,b,c,d,e){
    console.log(a,b,c,d,e)
});

_fn(1,2,3,4,5);     // print: 1,2,3,4,5
_fn(1)(2)(3,4,5);   // print: 1,2,3,4,5
_fn(1,2)(3,4)(5);   // print: 1,2,3,4,5
_fn(1)(2)(3)(4)(5); // print: 1,2,3,4,5
```
我们常用的工具库 lodash 也提供了 curry 方法，并且增加了非常好玩的 placeholder 功能，通过占位符的方式来改变传入参数的顺序。

比如说，我们传入一个占位符，本次调用传递的参数略过占位符，占位符所在的位置由下次调用的参数来填充，比如这样：

直接看一下官网的例子：
![alt text](img.png)

接下来我们来思考，如何实现占位符的功能。

对于 lodash 的 curry 函数来说，curry 函数挂载在 lodash 对象上，所以将 lodash 对象当做默认占位符来使用。

而我们的自己实现的 curry 函数，本身并没有挂载在任何对象上，所以将 curry 函数当做默认占位符

使用占位符，目的是改变参数传递的顺序，所以在 curry 函数实现中，每次需要记录是否使用了占位符，并且记录占位符所代表的参数位置。

直接上代码：

```javascript
/**
 * @param  fn           待柯里化的函数
 * @param  length       需要的参数个数，默认为函数的形参个数
 * @param  holder       占位符，默认当前柯里化函数
 * @return {Function}   柯里化后的函数
 */
function curry(fn,length = fn.length,holder = curry){
    return _curry.call(this,fn,length,holder,[],[])
}
/**
 * 中转函数
 * @param fn            柯里化的原函数
 * @param length        原函数需要的参数个数
 * @param holder        接收的占位符
 * @param args          已接收的参数列表
 * @param holders       已接收的占位符位置列表
 * @return {Function}   继续柯里化的函数 或 最终结果
 */
function _curry(fn,length,holder,args,holders){
    return function(..._args){
        //将参数复制一份，避免多次操作同一函数导致参数混乱
        let params = args.slice();
        //将占位符位置列表复制一份，新增加的占位符增加至此
        let _holders = holders.slice();
        //循环入参，追加参数 或 替换占位符
        _args.forEach((arg,i)=>{
            //真实参数 之前存在占位符 将占位符替换为真实参数
            if (arg !== holder && holders.length) {
                let index = holders.shift();
                _holders.splice(_holders.indexOf(index),1);
                params[index] = arg;
            }
            //真实参数 之前不存在占位符 将参数追加到参数列表中
            else if(arg !== holder && !holders.length){
                params.push(arg);
            }
            //传入的是占位符,之前不存在占位符 记录占位符的位置
            else if(arg === holder && !holders.length){
                params.push(arg);
                _holders.push(params.length - 1);
            }
            //传入的是占位符,之前存在占位符 删除原占位符位置
            else if(arg === holder && holders.length){
                holders.shift();
            }
        });
        // params 中前 length 条记录中不包含占位符，执行函数
        if(params.length >= length && params.slice(0,length).every(i=>i!==holder)){
            return fn.apply(this,params);
        }else{
            return _curry.call(this,fn,length,holder,params,_holders)
        }
    }
}

```
验证一下：
```javascript
let fn = function(a, b, c, d, e) {
    console.log([a, b, c, d, e]);
}

let _ = {}; // 定义占位符
let _fn = curry(fn,5,_);  // 将函数柯里化，指定所需的参数个数，指定所需的占位符

_fn(1, 2, 3, 4, 5);                 // print: 1,2,3,4,5
_fn(_, 2, 3, 4, 5)(1);              // print: 1,2,3,4,5
_fn(1, _, 3, 4, 5)(2);              // print: 1,2,3,4,5
_fn(1, _, 3)(_, 4,_)(2)(5);         // print: 1,2,3,4,5
_fn(1, _, _, 4)(_, 3)(2)(5);        // print: 1,2,3,4,5
_fn(_, 2)(_, _, 4)(1)(3)(5);        // print: 1,2,3,4,5
```
至此，我们已经完整实现了一个 curry 函数~~