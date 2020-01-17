# react-use-promise-hooks

## Installation

Using npm:

```sh
$ npm install --save react-use-promise-hooks
```

Using yarn:

```sh
$ yarn add react-use-promise-hooks
```

## why this is created
when play with modals, we normally need to handle our business in the call back of a modal(i.e onRequestClose).
but some times this call back style procedure could be fussy, image you have a component displays a list of items.
each item have a 'rename' button.
the general steps to rename a item are as below

1. click the rename button on a item
2. a modal pops up for the user to enter a new name
3. click 'OK',and the item is renamed

you can get the item id as argument in the the rename button call back,
and you can get the user entered new name in the modal call back.
to call the rename api, you need both item id and the new name.
but these two information is in two different call back, so how do you access item id in the modal callback?
I would normally store the id in component state then I can get the id from state in the modal callback.sure this approach works, but wouldn't be nice if we wrap this call back styled procedure into a promise.

## Usage

### before

```js
import React, { useState } from 'react';
import RecordNameModal from './RecordNameModal';

function Example() {
  const [showModal, toggleModal] = useState(false);
  const [operatingItemId, setOperatingItemId] = useState(null);

  const handleRename = (itemId) => {
    setOperatingItemId(itemId);
    toggleModal(true);
  }

  const handleSubmitted = (newName) => {
    toggleModal(false);
    renameAPI({
      id: operatingItemId,
      newName,
    });
  }

  return (
    <div>
      <RecordNameModal
        isOpen={showModal}
        onRequestClose={() => {
          toggleModal(false);
        }}
        onSubmitted={handleSubmitted}
      />
      <Item onRename={handleRename} />
      <Item onRename={handleRename} />
      <Item onRename={handleRename} />
    </div>
  );
}
```

### after

```js
import React, { useState } from 'react';
import RecordNameModal from './RecordNameModal';
import usePromise from 'react-use-promise-hook';

function Example() {
  const [showModal, toggleModal] = useState(false);
  const [recordNewName, resolvePromise, rejectPromise] = usePromise(() => () => {
    // open the modal when the promise is created
    toggleModal(true);
  });

  const handleRename = async (itemId) => {
    // no context switch, whole process handled in one callback
    const newName = await recordNewName();
    renameAPI({
      id: itemId,
      newName,
    });
  };

  return (
    <div>
       <RecordNameModal
         isOpen={showModal}
         onRequestClose={() => {
           toggleModal(false);
           rejectPromise();
         }}
         onSubmitted={(newName) => {
           toggleModal(false);
           resolvePromise(newName);
         }}
       />
       <Item onRename={handleRename} />
       <Item onRename={handleRename} />
       <Item onRename={handleRename} />
    </div>
  );
}
```


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

