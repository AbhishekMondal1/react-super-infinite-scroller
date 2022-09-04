import React, { useRef, useEffect, useState, useCallback } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import axios from "axios";
import IntersectionObserverMock from "../__mocks__/IntersectionObserver";
import responseData from "../__fixtures__/responseData";
import InfiniteScroll from "../index";

const { resultsData, totalData } = responseData;
const resultPage1 = resultsData.slice(0, 10);
const resultPage2 = resultsData.slice(10, 20);
const resultPage3 = resultsData.slice(20, 30);
const resultPage4 = resultsData.slice(30, 40);
const resultPage5 = resultsData.slice(40, 50);

afterEach(() => {
  jest.resetAllMocks();
});

describe("<Infinite Scroll/> render", () => {
  it("should render infinite scroll component", () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    function App() {
      const rootRef = useRef(null);
      return (
        <div ref={rootRef}>
          <InfiniteScroll
            hasMorePages={false}
            setPage={() => {}}
            showLoader={false}
            rootElement={rootRef}
          >
            <div />
          </InfiniteScroll>
        </div>
      );
    }
    const container = render(<App />);
    expect(container.container).toBeInTheDocument();
  });

  it("should render without custom root element", () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    function App() {
      return (
        <div>
          <InfiniteScroll
            hasMorePages={false}
            setPage={() => {}}
            showLoader={false}
          >
            <div />
          </InfiniteScroll>
        </div>
      );
    }
    const container = render(<App />);
    expect(container.container).toBeInTheDocument();
  });

  it("should render with custom root margin value", () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    function App() {
      const rootRef = useRef(null);
      return (
        <div ref={rootRef}>
          <InfiniteScroll
            hasMorePages={false}
            setPage={() => {}}
            showLoader={false}
            rootElement={rootRef}
            rootMarginValue={100}
          >
            <div />
          </InfiniteScroll>
        </div>
      );
    }
    const container = render(<App />);
    expect(container.container).toBeInTheDocument();
  });

  it("should render infinite scroll component with 5 elements", () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const names = ["Javascript", "ReactJS", "Nodejs", "ExpressJS", "MongoDB"];
    function App() {
      const rootRef = useRef(null);
      return (
        <div ref={rootRef}>
          <InfiniteScroll
            hasMorePages={false}
            setPage={() => {}}
            showLoader={false}
            rootElement={rootRef}
          >
            {names.map((name) => (
              <div key={name} className="child-elements">
                {name}
              </div>
            ))}
          </InfiniteScroll>
        </div>
      );
    }
    const { container } = render(<App />);
    expect(screen.getByText("ReactJS")).toBeInTheDocument();
    expect(container.querySelectorAll(".child-elements").length).toBe(
      names.length,
    );
  });

  it("should show loading status before fetching data", async () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const spyAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: { results: resultPage1, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage2, total: totalData },
      });

    function App() {
      const [pokemons, setPokemons] = useState<{ name: number }[]>([]);
      const [page, setPage] = useState(0);
      const [loading, setLoading] = useState(true);
      const [hasMorePages, setHasMorePages] = useState(false);
      const rootRef = useRef(null);

      const fetchesData = useCallback(async () => {
        setLoading(true);
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${page * 10}&limit=10`,
        );
        const { results } = data;
        const total = 20;
        if (results !== undefined && results !== null) {
          setPokemons((prevState) => {
            if (prevState.length) {
              setHasMorePages(results.length + prevState.length < total);
            }
            return [...prevState, ...results];
          });
        }
      }, []);

      useEffect(() => {
        fetchesData();
      }, [page]);

      return (
        <div id="mainview">
          <div
            id="viewPort"
            ref={rootRef}
            className="viewPort"
            style={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <InfiniteScroll
              setPage={setPage}
              hasMorePages={hasMorePages}
              rootElement={rootRef}
              showLoader={loading}
            >
              {pokemons.map((pokemon) => (
                <div key={pokemon.name}>{pokemon.name}</div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      );
    }

    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText("Loading more ...")).toBeInTheDocument();
    });

    expect(spyAxios).toHaveBeenCalledTimes(1);
    expect(spyAxios).toHaveBeenNthCalledWith(
      1,
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10",
    );
  });

  it("should fetch data and render when scroll down", async () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const spyAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: { results: resultPage1, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage2, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage3, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage4, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage5, total: totalData },
      });

    function App() {
      const [pokemons, setPokemons] = useState<{ name: number }[]>([]);
      const [page, setPage] = useState(0);
      const [hasMorePages, setHasMorePages] = useState(true);
      const rootRef = useRef(null);

      const fetchesData = useCallback(async () => {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${page * 10}&limit=10`,
        );
        const { results } = data;
        const total = 50;
        if (results !== undefined && results !== null) {
          setPokemons((prevState) => {
            if (prevState.length) {
              setHasMorePages(results.length + prevState.length < total);
            }
            return [...prevState, ...results];
          });
        }
      }, []);

      useEffect(() => {
        fetchesData();
      }, [page]);

      return (
        <div id="mainview">
          <div
            id="viewPort"
            ref={rootRef}
            className="viewPort"
            style={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <InfiniteScroll
              setPage={setPage}
              hasMorePages={hasMorePages}
              rootElement={rootRef}
              showLoader={false}
            >
              {pokemons.map((pokemon, i) => (
                <div key={pokemon.name}>{`${i + 1} ${pokemon.name}`}</div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      );
    }

    await act(async () => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByText("10 caterpie")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20 raticate")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30 nidorina")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("40 wigglytuff")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("50 diglett")).toBeInTheDocument();
    });
    expect(spyAxios).toHaveBeenCalledTimes(5);
    expect(spyAxios).toHaveBeenNthCalledWith(
      1,
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10",
    );
  });

  it("should fetch data and render when reverse scroll up", async () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const spyAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: { results: resultPage1, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage2, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage3, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage4, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage5, total: totalData },
      });

    function App() {
      const [pokemons, setPokemons] = useState<{ name: number }[]>([]);
      const [page, setPage] = useState(0);
      const [hasMorePages, setHasMorePages] = useState(true);
      const rootRef = useRef(null);

      const fetchesData = useCallback(async () => {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${page * 10}&limit=10`,
        );
        const { results } = data;
        const total = 50;
        if (results !== undefined && results !== null) {
          setPokemons((prevState) => {
            if (prevState.length) {
              setHasMorePages(results.length + prevState.length < total);
            }
            return [...prevState, ...results];
          });
        }
      }, []);

      useEffect(() => {
        fetchesData();
      }, [page]);

      return (
        <div id="mainview">
          <div
            id="viewPort"
            ref={rootRef}
            className="viewPort"
            style={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <InfiniteScroll
              setPage={setPage}
              hasMorePages={hasMorePages}
              rootElement={rootRef}
              showLoader={false}
              reverse
            >
              {pokemons
                .map((pokemon, i) => (
                  <div key={pokemon.name}>{`${i + 1} ${pokemon.name}`}</div>
                ))
                .reverse()}
            </InfiniteScroll>
          </div>
        </div>
      );
    }

    await act(async () => {
      render(<App />);
    });
    await waitFor(async () => {
      expect(await screen.findByText("10 caterpie")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20 raticate")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30 nidorina")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("40 wigglytuff")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("50 diglett")).toBeInTheDocument();
    });

    expect(spyAxios).toHaveBeenCalledTimes(5);
    expect(spyAxios).toHaveBeenNthCalledWith(
      1,
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10",
    );
  });

  it("should stop fetch data and render when hasmore become false", async () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const spyAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: { results: resultPage1, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage2, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage3, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage4, total: totalData },
      })
      .mockResolvedValueOnce({
        data: { results: resultPage5, total: totalData },
      });

    function App() {
      const [pokemons, setPokemons] = useState<{ name: number }[]>([]);
      const [page, setPage] = useState(0);
      const [hasMorePages, setHasMorePages] = useState(true);
      const rootRef = useRef(null);

      const fetchesData = useCallback(async () => {
        const { data } = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/?offset=${page * 10}&limit=10`,
        );
        const { results } = data;
        const total = 30;
        if (results !== undefined && results !== null) {
          setPokemons((prevState) => {
            if (prevState.length) {
              setHasMorePages(results.length + prevState.length < total);
            }
            return [...prevState, ...results];
          });
        }
      }, []);

      useEffect(() => {
        fetchesData();
      }, [page]);

      return (
        <div id="mainview">
          <div
            id="viewPort"
            ref={rootRef}
            className="viewPort"
            style={{ overflowY: "scroll", maxHeight: "300px" }}
          >
            <InfiniteScroll
              setPage={setPage}
              hasMorePages={hasMorePages}
              rootElement={rootRef}
              showLoader={false}
            >
              {pokemons.map((pokemon, i) => (
                <div key={pokemon.name}>{`${i + 1} ${pokemon.name}`}</div>
              ))}
            </InfiniteScroll>
          </div>
        </div>
      );
    }

    await act(async () => {
      render(<App />);
    });
    await waitFor(async () => {
      expect(await screen.findByText("10 caterpie")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20 raticate")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30 nidorina")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.queryByText("40 wigglytuff")).not.toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.queryByText("50 diglett")).not.toBeInTheDocument();
    });

    expect(spyAxios).toHaveBeenCalledTimes(3);
    expect(spyAxios).toHaveBeenNthCalledWith(
      1,
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10",
    );
  });
});
