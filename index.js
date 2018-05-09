var InputStream = require('./instream');
var TokenStream = require('./tokenstream');
var parse = require('./parse');

var a = `

sum = lambda(a, b) {
  #if (2.34 > 1) then 2.45 else 3.909;
  a + b + 3 * 4 + 4 * 5 + 6;
};

#hahahah

#string = "xxxxx        \\\\\\\\\'       ";


print(sum(1, 2));


`;
var bbb = InputStream(a);

var ccc = TokenStream(bbb);

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
console.log(ddd);