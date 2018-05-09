var InputStream = require('./instream');
var TokenStream = require('./tokenstream');
var parse = require('./parse');
var Environment = require('./interpreter').Environment;
var evaluate = require('./interpreter').evaluate;

var a = `

sum = lambda(a, b) {
  #if (2.34 > 1) then 2.45 else 3.909;
  a + b + 3 * 4 + 4 * 5 + 6;
  a + 12;
  123.001;
};

#hahahah

string = "xxxxx        \\\\\\\\\'       ";
print(string);

print(sum(1, 2));

`;
var bbb = InputStream(a);

var ccc = TokenStream(bbb);


/*
* 测试tokenstream
*/

// function con() {
//   var temp;
//   while(temp = ccc.next()) {
//     if (temp) {
//       console.log(temp);
//     }
//   }
// }
// con()

var ddd = parse(ccc);

/*
 * 查看解析之后的ast
 */
console.log(JSON.stringify(ddd));

/*
 * 开始构建上下文
 */
var env = new Environment();

// built-in function
env.def('print', function(txt) {
	console.log(txt);
});

// 开始eval
evaluate(ddd, env);

