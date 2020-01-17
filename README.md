# react-use-promise-hook

## Installation

Using npm:

```sh
$ npm install --save react-use-promise-hooks
```

Using yarn:

```sh
$ yarn add react-use-promise-hooks
```

## Intro
you can use this hook to wrap call back styled component(i.e modal) into promise, to avoid unwanted shift of context.

## API

```js
const [
  promiseCreator, // a function that will create a promise
  promiseResolver, // a function that will resolve the promise created by promiseCreator
  promiseRejector, // a function that will reject the promise created by promiseCreator
] = usePromise(
  () => someFunc, // things you need to do in the start of the created promise
  [deps], //dependencies
);
```

## Usage

```js
import React, { useState } from 'react';
import FormModal from './FormModal';
import usePromise from 'react-use-promise-hook';

function Example() {
  const [showModal, toggleModal] = useState(false);
  const [collectFormData, resolvePromise, rejectPromise] = usePromise(() => () => {
    toggleModal(true);
  });

  const handleClick = async () => {
    const formData = await collectFormData();
  };

  return (
    <div>
      <FormModal
        isOpen={showModal}
        onRequestClose={() => {
          toggleModal(false);
          rejectPromise();
        }}
        onSubmitted={(result) => {
          toggleModal(false);
          resolvePromise(result);
        }}
      />
      <button onClick={handleClick}>
        collect form data
      </button>
    </div>
  );
}
```
