# react-super-infinite-scroller

An Infinite Scroll component for React using Intersection Observer API.

[![React](https://img.shields.io/badge/MADE%20WITH-REACT-blue?style=for-the-badge&logo=appveyor)](https://reactjs.org)
[![MIT License](https://img.shields.io/badge/LICENSE-MIT-orange?style=for-the-badge&logo=appveyor)](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/master/LICENSE)

## Installation 📦

npm

```bash
  npm install --save react-super-infinite-scroller
```

yarn

```bash
  yarn add react-super-infinite-scroller
```

## Usage

Basic example

```jsx
import InfiniteScroll from "react-super-infinite-scroller";

<InfiniteScroll setPage={setPage} hasMorePages={hasMorePages} loading={loading}>
  {items.map((item, index) => (
    <div key={index}>
      <h1>{item.title}</h1>
      <p>{item.body}</p>
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
        loading={loading}
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

# Demo

### Live Example 🧑‍💻

Infinite scroll with 100 elements <br>
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/w0wtup)

Reverse scroll <br>
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/t7g5oc)

## props

| name              | type     | required | description                                                                                                                                              |
| ----------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setPage`         | function | ✅ yes   | useState function to set the page number.                                                                                                                |
| `hasMorePages`    | boolean  | ✅ yes   | If there are more items to load.                                                                                                                         |
| `loading`         | boolean  | ✅ yes   | it tells if data is fetching. When new items are fetching loading state is set to true                                                                   |
| `children`        | element  | ✅ yes   | Items you need to scroll.                                                                                                                                |
| `thresholdValue`  | number   | ❌ no    | Value (between 0.0 and 1.0), representing the percentage target element is visible to trigger the callback.                                              |
| `rootMarginValue` | string   | ❌ no    | Margin around the target element. `rootMarginValue` represents the margin around the target element that must be in view in order to trigger a callback. |

## License

[MIT](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/master/LICENSE)
