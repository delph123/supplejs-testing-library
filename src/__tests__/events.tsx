import { createRef, Dynamic } from "supplejs";
import { render, fireEvent } from "..";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";

const eventTypes = [
    {
        type: "Clipboard",
        events: ["copy", "paste"],
        elementType: "input",
    },
    {
        type: "Composition",
        events: ["compositionEnd", "compositionStart", "compositionUpdate"],
        elementType: "input",
    },
    {
        type: "Keyboard",
        events: ["keyDown", "keyPress", "keyUp"],
        elementType: "input",
        init: { keyCode: 13 },
    },
    {
        type: "Focus",
        events: ["focus", "blur"],
        elementType: "input",
    },
    {
        type: "Form",
        events: ["focus", "blur"],
        elementType: "input",
    },
    {
        type: "Focus",
        events: ["input", "invalid"],
        elementType: "input",
    },
    {
        type: "Focus",
        events: ["submit"],
        elementType: "form",
    },
    {
        type: "Mouse",
        events: [
            "click",
            "contextMenu",
            "dblClick",
            "drag",
            "dragEnd",
            "dragEnter",
            "dragExit",
            "dragLeave",
            "dragOver",
            "dragStart",
            "drop",
            "mouseDown",
            "mouseEnter",
            "mouseLeave",
            "mouseMove",
            "mouseOut",
            "mouseOver",
            "mouseUp",
        ],
        elementType: "button",
    },
    {
        type: "Selection",
        events: ["select"],
        elementType: "input",
    },
    {
        type: "Touch",
        events: ["touchCancel", "touchEnd", "touchMove", "touchStart"],
        elementType: "button",
    },
    {
        type: "UI",
        events: ["scroll"],
        elementType: "div",
    },
    {
        type: "Wheel",
        events: ["wheel"],
        elementType: "div",
    },
    {
        type: "Media",
        events: [
            "abort",
            "canPlay",
            "canPlayThrough",
            "durationChange",
            "emptied",
            "encrypted",
            "ended",
            "error",
            "loadedData",
            "loadedMetadata",
            "loadStart",
            "pause",
            "play",
            "playing",
            "progress",
            "rateChange",
            "seeked",
            "seeking",
            "stalled",
            "suspend",
            "timeUpdate",
            "volumeChange",
            "waiting",
        ],
        elementType: "video",
    },
    {
        type: "Image",
        events: ["load", "error"],
        elementType: "img",
    },
    {
        type: "Animation",
        events: ["animationStart", "animationEnd", "animationIteration"],
        elementType: "div",
    },
    {
        type: "Transition",
        events: ["transitionEnd"],
        elementType: "div",
    },
];

function event(el: HTMLElement, name: string, spy: Mock) {
    el.addEventListener(name, spy);
}

eventTypes.forEach(({ type, events, elementType, init }) => {
    describe(`${type} Events`, () => {
        events.forEach((eventName) => {
            const eventProp = eventName.toLowerCase();

            it(`triggers ${eventProp}`, () => {
                let ref = createRef<HTMLElement>();
                const spy = vi.fn();

                render(() => <Dynamic component={elementType} ref={ref} />);
                event(ref.current, eventProp, spy);

                // @ts-ignore
                fireEvent[eventName](ref.current, init);

                expect(spy).toHaveBeenCalledTimes(1);
            });
        });
    });
});

test("onInput works", async () => {
    const handler = vi.fn();

    const {
        container: { firstChild: input },
    } = render(() => <input type="text" onInput={handler} />);

    await userEvent.type(input! as Element, "a");

    expect(handler).toHaveBeenCalledTimes(1);
});

test("calling `fireEvent` directly works too", () => {
    const handleEvent = vi.fn();

    const {
        container: { firstChild: button },
    } = render(() => <button onClick={handleEvent} />);

    const event = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
    });

    fireEvent(button!, event);

    expect(handleEvent).toHaveBeenCalledWith(event);
});
