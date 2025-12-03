const Fibonacci = (n) => {
  let fib = [0, 1];

  //   debugger;
  for (let i = 2; i < n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib;
};

console.log(Fibonacci(10));
