[![CircleCI](https://circleci.com/gh/ashhitch/expaaand.svg?style=svg)](https://circleci.com/gh/ashhitch/expaaand)

# expaaand

Expand Anything, a simple JavaScript Library that will will allow you to add an active class (defaults is-active) to a target element on click.

## Features Include:

- Simple API
- Data attribute overrides
- Grouping of elements (e.g for accordions)
- Optional toggling
- Optional additional close button
- Responsive toggling
- Event system

## Some use cases

- Menus
- Accordions
- Popups
- Modals

## Docs

First import the module

`import { Expaaand } from 'expaaand';`

Initialise Expaaand

```js
const myButtonElm = document.querySelector('.js-my-button');
new Expaaand(myButtonElm);
```

Add markup to button

```html
<button type="button" class="js-my-button" data-expaaand="#js-target" data-expaaand-toggle="true">Toggle</button>

<div class="target" id="js-target">
  Target elm
</div>
```

More docs coming soon...

## Examples

See [examples.html](examples.html) for more examples (note the example is using R for module loading)

## TODO

- Write tests
- Update docs
- import examples
- Demo site
