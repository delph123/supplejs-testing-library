<div align="center">
<h1>SuppleJS Testing Library</h1>
<p>Simple and complete Solid DOM testing utilities that encourage good testing practices.</p>

> Inspired completely by [solid-testing-library](https://github.com/solidjs/solid-testing-library)

</div>

---

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Installation](#installation)
- [Docs](#docs)
- [Issues](#issues)
- [Acknowledgement](#acknowledgment)

---

## The Problem

You want to write tests for your Solid components so that they avoid including implementation details, and are maintainable in the long run.

## The Solution

The Solid Testing Library is a very lightweight solution for testing Solid components. Its primary guiding principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106)

## Installation

This module is distributed via npm which is bundled with node and should be installed
as one of your project's `devDependencies`:

```sh
npm install --save-dev supplejs-testing-library
```

💡 If you are using Jest or vitest, you may also be interested in installing `@testing-library/jest-dom` so you can use
[the custom jest matchers](https://github.com/testing-library/jest-dom).

## Integration with Vite

A working Vite template setup with `supplejs-testing-library` and TypeScript support can be found [here](https://github.com/solidjs/templates/tree/main/ts-vitest).

## Docs

See the [docs](https://testing-library.com/docs/preact-testing-library/intro) over at the Testing Library website.

There are several key differences, though:

⚠️ The `render` function takes in a function that returns a SuppleJS Component, rather than simply the component itself.

```tsx
const results = render(() => <YourComponent />, options);
```

⚠️ SuppleJS does _not_ re-render, it merely executes side effects triggered by reactive state that change the DOM, therefore there is no `rerender` method. You can use global signals to manipulate your test component in a way that causes it to update.

SuppleJS reactive changes are pretty instantaneous, so there is rarely need to use `waitFor(…)`, `await findByRole(…)` and other asynchronous queries to test the rendered result, except for transitions, suspense, resources and effects.

⚠️ SuppleJS external reactive state does not require any DOM elements to run in, so our `renderHook` call to test hooks in the context of a component (if your hook does not require the context of a component, `createRoot` should suffice to test the reactive behavior; for convenience, we also have `testEffect`, which is described later) has no `container`, `baseElement` or queries in its options or return value. Instead, it has an `owner` to be used with `runWithOwner` if required. It also exposes a `cleanup` function, though this is already automatically called after the test is finished.

```ts
function renderHook<Args extends any[], Result>(
  hook: (...args: Args) => Result,
  options: {
    initialProps?: Args,
    wrapper?: Component<{ children: JSX.Element }>
  }
) => {
  result: Result;
  owner: Owner | null;
  cleanup: () => void;
}
```

This can be used to easily test a hook / primitive:

```ts
const { result } = renderHook(createResult);
expect(result).toBe(true);
```

If you are using a `wrapper` with `renderHook`, make sure it will **always** return `props.children` - especially if you are using a context with asynchronous code together with `<Show>`, because this is required to get the value from the hook and it is only obtained synchronously once and you will otherwise only get `undefined` and wonder why this is the case.

SuppleJS manages side effects with different variants of `createEffect`. While you can use `waitFor` to test asynchronous effects, it uses polling instead of allowing Solid's reactivity to trigger the next step. In order to simplify testing those asynchronous effects, we have a `testEffect` helper that complements the hooks for directives and hooks:

```ts
testEffect(fn: (done: (result: T) => void) => void, owner?: Owner): Promise<T>

// use it like this:
test("testEffect allows testing an effect asynchronously", () => {
  const [value, setValue] = createSignal(0);
  return testEffect(done => createEffect((run: number = 0) => {
    if (run === 0) {
      expect(value()).toBe(0);
      setValue(1);
    } else if (run === 1) {
      expect(value()).toBe(1);
      done();
    }
    return run + 1;
  }));
});
```

It allows running the effect inside a defined owner that is received as an optional second argument. This can be useful in combination with `renderHook`, which gives you an owner field in its result. The return value is a Promise with the value given to the `done()` callback. You can either await the result for further assertions or return it to your test runner.

## Acknowledgement

Thanks goes to [Kent C. Dodds](https://kentcdodds.com/) and his colleagues for creating testing-library and to the creators of [solid-testing-library](https://github.com/solidjs/solid-testing-library).
