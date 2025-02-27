import { cleanup } from "./pure";

// If we're running in a test runner that supports afterEach
// or teardown then we'll automatically run cleanup afterEach test
// this ensures that tests run in isolation from each other.
// If you don't like this then either import the `pure` module
// or set the STL_SKIP_AUTO_CLEANUP env variable to 'true'.
// @ts-ignore
if (typeof process === "undefined" || !process.env.STL_SKIP_AUTO_CLEANUP) {
    // @ts-ignore
    if (typeof afterEach === "function") {
        // @ts-ignore
        afterEach(cleanup);
        /* v8 ignore next 5 */
        // @ts-ignore
    } else if (typeof teardown === "function") {
        // @ts-ignore
        teardown(cleanup);
    }
}

export { render, renderHook, testEffect, cleanup } from "./pure";

export * from "@testing-library/dom";
