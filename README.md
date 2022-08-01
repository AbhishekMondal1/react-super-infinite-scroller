# react-super-infinite-scroller

An Infinite Scroll component for React using Intersection Observer API.

[![React](https://img.shields.io/badge/MADE%20WITH-REACT-blue?style=for-the-badge&logo=appveyor)](https://reactjs.org)
[![MIT License](https://img.shields.io/badge/LICENSE-MIT-orange?style=for-the-badge&logo=appveyor)](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/main/LICENSE)

## Installation

```bash
  npm install --save react-super-infinite-scroller
```

## Usage

```jsx
import InfiniteScroll from "react-super-infinite-scroller";

<InfiniteScroll setPage={setPage} hasMorePages={hasMorePages} loading={loading}>
  {children}
</InfiniteScroll>;
```

## props

| name         | type     | required | description                                    |
| ------------ | -------- | -------- | ---------------------------------------------- |
| setPage      | function | yes      | set page useEffect function to set page number |
| hasMorePages | boolean  | yes      | whether more items are there to be loaded.     |
| loading      | boolean  | yes      | it tells if data is fetching                   |
| children     | element  | yes      | items you need to scroll                       |

## License

[MIT](https://github.com/AbhishekMondal1/react-super-infinite-scroller/blob/main/LICENSE)
