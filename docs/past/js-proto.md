---
title: Js原型和闭包
date: 2023-03-21 20:51
location: 长沙岳麓区中电软件园
tags:
- js
---
## 一切（引用类型）都是对象，对象是属性的集合

ECMAScript有6种简单数据类型（也称为原始类型）: Undefined、Null、Boolean、Number、String和Symbol。还有一种复杂数据类型叫Object（对象）。Object是一种无序名值对的集合
**Object.prototype**:
1. constructor：用于创建当前对象的函数。在前面的例子中，这个属性的值就是Object()函数。
2. hasOwnProperty（propertyName）：用于判断当前对象实例（不是原型）上是否存在给定的属性。要检查的属性名必须是字符串（如o.hasOwnProperty("name")）或符号。
3. isPrototypeOf（object）：用于判断当前对象是否为另一个对象的原型。（第8章将详细介绍原型。）
4. propertyIsEnumerable(propertyName)：用于判断给定的属性是否可以使用（本章稍后讨论的）for-in语句枚举。与hasOwnProperty()一样，属性名必须是字符串。
5. toLocaleString()：返回对象的字符串表示，该字符串反映对象所在的本地化执行环境。
6. toString()：返回对象的字符串表示。
7. valueOf()：返回对象对应的字符串、数值或布尔值表示。通常与toString()的返回值相同。

## 函数和对象的关系

对象是函数创建的，而函数却又是一种对象

对象被认为是某个特定引用类型的实例。新对象通过使用new操作符后跟一个构造函数（constructor）来创建。构造函数就是用来创建新对象的函数

## prototype原型

每个函数都默认有一个属性prototype，对象：（属性的集合）,prototype属性值为一个对象，称为函数原型对象，而原型对象默认的只有一个叫做constructor的属性，指向这个函数本身。

![](https://laix7-pic-bed-1318281615.cos.ap-nanjing.myqcloud.com/JsProto&Closure1.png)

## 隐式原型`_proto_`

每个函数function都有一个prototype，即原型。而每个对象都有一个`_proto_`，即为隐式原型。

每个对象都有一个`_proto_`属性，指向创建该对象的函数的prototype。

1）自定义函数的prototype本质上就是和 var obj = {} 是一样的，都是被Object创建，所以自定义函数原型（是一个对象）的`_proto_`指向的就是Object.prototype（因为是通过Object函数创建的）。

2）Object.prototype确实一个特例——它的`_proto_`指向的是null，切记切记

函数也是一种对象，函数也有`_proto_`，函数是被**Function**创建出来的，Function也是一个函数，函数是一种对象，也有`_proto_`属性。既然是函数，那么它一定是被Function创建。所以Function是被自身创建的。所以它的`_proto_`指向了自身的**Prototype**。

3）**Function.prototype**指向的对象，它的`_proto_`是不是也指向**Object.prototype**，因为这也是一个普通的被**Object**创建出来的对象

![](https://laix7-pic-bed-1318281615.cos.ap-nanjing.myqcloud.com/JsProto&Closure2.png)

## instanceof（表示的就是一种继承关系，或者原型链的结构）

对于值类型，你可以通过typeof判断,但是typeof在判断到引用类型的时候，返回值只有object/function

运算符的第一个变量是一个对象，暂时称为A；第二个变量一般是一个函数,暂称为B
Instanceof的判断队则是：沿着A的`_proto_`这条线来找，同时沿着B的**prototype**这条线来找，如果两条线能找到同一个引用，即同一个对象，那么就返回true。如果找到终点还未重合，则返回false。

```javascript
function Fn(){}
var f1=new Fn()
console.log(f1 instanceof Fn)
console.log(f1 instanceof Object)
console.log(Function instanceof Object)
console.log(Function instanceof Function)
console.log(Object instanceof Function)
//全都为true
```



## 继承

javascript中的继承是通过原型链来体现的，访问一个对象的属性时，先在基本属性中查找，如果没有，再沿着`_proto_`这条链向上找，这就是原型链。

hasOwnProperty（string|number|boolean）：在实际应用中如何区分一个属性到底是基本的还是从原型中找到的

```javascript
var obj1=new Object()
obj1.a='a'
console.log(obj1.hasOwnProperty("a"))   //  true
console.log(obj1.hasOwnProperty("hasOwnProperty"))  //false
```

对象的原型链是沿着`_proto_`这条线走的，因此在查找f1.hasOwnProperty属性时，就会**顺着原型链一直查找到Object.prototype。**

结论：

由于所有的对象的原型链都会找到Object.prototype，因此所有的对象都会有Object.prototype的方法。这就是所谓的**“继承”**。

所有函数都继承Function.prototype,而Function.prototype又继承自Object.prototype

![](https://laix7-pic-bed-1318281615.cos.ap-nanjing.myqcloud.com/JsProto&Closure3.png)

## 原型的灵活性

**对象属性**可以**随时改动**。对象或者函数，刚开始new出来之后，可能啥属性都没有。但是你可以这会儿加一个，过一会儿在加两个，非常灵活。

如果继承的方法不合适，可以直接修改原型对象，obj.prototype

```js
function Foo(){}
let a=new Foo()
Foo.prototype.toString=function(){
  console.log("我通过构造函数的prototype属性修改了原型对象")
}
a.toString()
/*a._proto_.toString=function(){
    console.log("我通过对象的_proto_属性修改了原型对象")
    好像不能这么做
}*/
```

如果你要添加内置方法的原型属性，最好做一步判断，如果该属性不存在，则添加。如果本来就存在，就没必要再添加了。