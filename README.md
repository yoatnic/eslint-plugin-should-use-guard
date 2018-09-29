# should-use-guard

This is detect should use guard program for ESLint plugin.

```js
// NG
function f() {
  if (condition) {
    something();
  }
}
```

```js
// OK
function f() {
  if (!condition) return;

  something();
}
```
