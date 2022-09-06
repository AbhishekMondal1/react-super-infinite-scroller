# react-super-infinite-scroller

An Infinite Scroll component for React using Intersection Observer API.

[![npm version](https://img.shields.io/npm/v/react-super-infinite-scroller.svg?style=flat-square&logo=npm)](https://www.npmjs.com/package/react-super-infinite-scroller)
[![coverage](https://img.shields.io/codecov/c/github/AbhishekMondal1/react-super-infinite-scroller?style=flat-square&logo=codecov&token=XPQH5LI3U2)](https://codecov.io/gh/AbhishekMondal1/react-super-infinite-scroller)
![minified dize](https://img.shields.io/bundlephobia/min/react-super-infinite-scroller?style=flat-square&logo=javascript)
[![snyk](https://img.shields.io/snyk/vulnerabilities/npm/react-super-infinite-scroller?style=flat-square&logo=snyk)](https://snyk.io/test/github/AbhishekMondal1/react-super-infinite-scroller)
[![MIT License](https://img.shields.io/github/license/AbhishekMondal1/react-super-infinite-scroller?style=flat-square&)](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/master/LICENSE)

<p align="center">
<img src="https://user-images.githubusercontent.com/71382408/188681956-dc0586b9-40c7-4fc8-bc3f-4470daa84e93.gif" width="600">
</p>

## ⚙️ Installation

npm

```bash
  npm install --save react-super-infinite-scroller
```

yarn

```bash
  yarn add react-super-infinite-scroller
```

## 🎉 Features

- 🖱️ **Infinite Scrolling** - Uses Intersection Observer API (no need to use scroll event listener)
- 🔝 **Reverse Scroll** - Chat history like scrolling (scroll to top to load more, i.e., reverse scrolling)
- 🎨 **Customizable Loading Component** - You can use your own loader component
- 📜 **TypeScript Support** - Written in TypeScript
- 📦 **Tiny Bundle** - 1.2 kB (minified) size

## 📖 Usage

Basic example

```jsx
import InfiniteScroll from "react-super-infinite-scroller";

<InfiniteScroll
  setPage={setPage}
  hasMorePages={hasMorePages}
  showLoader={loading}
>
  {items.map((item, index) => (
    <div key={index}>
      <h1>{item}</h1>
    </div>
  ))}
</InfiniteScroll>;
```

Real World example

```jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import InfiniteScroll from "react-super-infinite-scroller";

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await axios.get(
        `https://dummyjson.com/products?skip=${page - 1}&limit=10`,
      );
      setItems((prev) => [...prev, ...res.data.products]);
      setHasMorePages(items.length < res.data.total);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  return (
    <div className="App">
      <InfiniteScroll
        setPage={setPage}
        showLoader={loading}
        hasMorePages={hasMorePages}
      >
        {items.map((p) => (
          <div className="product" key={p.id}>
            <img src={p.images[0]} />
            <div className="data">
              <p>{p.title}</p>
              <p>{p.price}$</p>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default App;
```

## 🚀 Demo

### Live Example 🧑‍💻

Infinite scroll with 100 elements <br>
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/w0wtup)

Reverse scroll <br>
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/t7g5oc)

## 🎛️ Props

| name              | type        | required | description                                                                                                                                              |
| ----------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setPage`         | function    | ✅ yes   | useState function to set the page number.                                                                                                                |
| `hasMorePages`    | boolean     | ✅ yes   | If there are more items to load.                                                                                                                         |
| `showLoader`      | boolean     | ✅ yes   | It tells if data is fetching. When new items are fetching loading state is set to true                                                                   |
| `children`        | Node        | ✅ yes   | Items you need to scroll.                                                                                                                                |
| `loader`          | Node        | ❌ no    | Custom loader component.                                                                                                                                 |
| `reverse`         | boolean     | ❌ no    | Scroll and load items in reverse from top.                                                                                                               |
| `thresholdValue`  | number      | ❌ no    | Value (between 0.0 and 1.0), representing the percentage target element is visible to trigger the callback.                                              |
| `rootElement`     | HTMLElement | ❌ no    | Root element of the observer. The element that is used as the viewport for checking visibility of the target. Default is document viewport.              |
| `rootMarginValue` | string      | ❌ no    | Margin around the target element. `rootMarginValue` represents the margin around the target element that must be in view in order to trigger a callback. |

## License 📜

[MIT](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/master/LICENSE)
