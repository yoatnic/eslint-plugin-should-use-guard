function f() {
  if (false) {
    console.log("foo func1");
  }
}

const x = () => {
  if (false) {
    console.log("foo func1");
  } else {
    console.log("hoge func1");
  }
};

const y = () => {
  if (false) {
    console.log("foo func2");
  }
};

const z = () => {
  if (false) {
    console.log("foo func3");
  }
  console.log("exp");
};

[1].forEach(() => {
  if (true) {
    console.log("higher function");
  }
});

class Foo {
  method1() {
    if (false) {
      console.log("foo method1");
    }
  }

  method2() {
    if (false) {
      console.log("foo2 method1");
    } else {
      console.log("hoge method");
    }
  }

  method3() {
    if (false) {
      console.log("foo method3");
    }
    console.log("exp");
  }
}
