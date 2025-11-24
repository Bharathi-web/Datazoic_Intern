
// Stack Memory

let name="Bharathi";
let anothername=name;
anothername="priya";
console.log("The name ",name);
console.log("The another name",anothername);

console.log("-----------");


// Heap Memory

let userone={
    email:"bharathi@gmail.com",
    name: "Bharathi"
}
let usertwo=userone;
usertwo.email="yoga@gmail.com";
console.log("userone", userone);
console.log("usertwo", usertwo);

console.log("-----------");


let arr=[1,2,3];
let arr2=arr;
arr2.push(4);
console.log(arr);
console.log(arr2);

console.log("-----------");


//Assign the obj val to another obj, the changes in one obj won't affect another

let arr3=[1,2,3];
let copy=[...arr3];      // shallow copy
arr3.push(4);
console.log(arr3);
console.log(copy);
copy.push(5);
console.log(copy);

console.log("-----------");



let obj1={
    name:"john",
    address:{
        city:"wonderla"
    }
};
let deepcopy=JSON.parse(JSON.stringify(obj1));
obj1.address.city="new wonderla";
console.log(obj1);
deepcopy.address.city="newyork";
console.log(deepcopy);

console.log("-----------");
// closure example

function counter(){
    let count=0;
    return function(){
        count++;
        console.log(count);
    }

}
const myclosure=counter();
myclosure();
myclosure();
myclosure();

console.log("-----------");
//another closure
let count1=0;
function add(){
    count1+=1;
    return count1;
}
console.log(add());
console.log(add());
console.log(add());

console.log("-----------");
function add() {
  let counter = 0;
  function plus() {counter += 1;}
  plus();   
  plus();
  return counter;
}

console.log("-----------");

function myCounter() {
  let counters = 0;
  return function() {
    counters++;
    return counters;
  };
}
const adding = myCounter();
console.log(adding());
console.log(adding());
console.log(adding());

