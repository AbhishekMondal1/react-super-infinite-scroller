import React, { useRef, useEffect, useState, useCallback } from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import axios from "axios";
import IntersectionObserverMock from "../__mocks__/IntersectionObserver";
import InfiniteScroll from "../index";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Intersection Observer", () => {
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
            loading={false}
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
            loading={false}
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

  it("should fetch data and render when scroll down", async () => {
    const intersectionObserverMock = new IntersectionObserverMock();
    intersectionObserverMock.mock();
    const spyAxios = jest
      .spyOn(axios, "get")
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "1" },
            { name: "2" },
            { name: "3" },
            { name: "4" },
            { name: "5" },
            { name: "6" },
            { name: "7" },
            { name: "8" },
            { name: "9" },
            { name: "10" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "11" },
            { name: "12" },
            { name: "13" },
            { name: "14" },
            { name: "15" },
            { name: "16" },
            { name: "17" },
            { name: "18" },
            { name: "19" },
            { name: "20" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "21" },
            { name: "22" },
            { name: "23" },
            { name: "24" },
            { name: "25" },
            { name: "26" },
            { name: "27" },
            { name: "28" },
            { name: "29" },
            { name: "30" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "31" },
            { name: "32" },
            { name: "33" },
            { name: "34" },
            { name: "35" },
            { name: "36" },
            { name: "37" },
            { name: "38" },
            { name: "39" },
            { name: "40" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "41" },
            { name: "42" },
            { name: "43" },
            { name: "44" },
            { name: "45" },
            { name: "46" },
            { name: "47" },
            { name: "48" },
            { name: "49" },
            { name: "50" },
          ],
          total: 50,
        },
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
              loading={false}
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
      expect(screen.getByText("10")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("40")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument();
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
        data: {
          results: [
            { name: "1" },
            { name: "2" },
            { name: "3" },
            { name: "4" },
            { name: "5" },
            { name: "6" },
            { name: "7" },
            { name: "8" },
            { name: "9" },
            { name: "10" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "11" },
            { name: "12" },
            { name: "13" },
            { name: "14" },
            { name: "15" },
            { name: "16" },
            { name: "17" },
            { name: "18" },
            { name: "19" },
            { name: "20" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "21" },
            { name: "22" },
            { name: "23" },
            { name: "24" },
            { name: "25" },
            { name: "26" },
            { name: "27" },
            { name: "28" },
            { name: "29" },
            { name: "30" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "31" },
            { name: "32" },
            { name: "33" },
            { name: "34" },
            { name: "35" },
            { name: "36" },
            { name: "37" },
            { name: "38" },
            { name: "39" },
            { name: "40" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "41" },
            { name: "42" },
            { name: "43" },
            { name: "44" },
            { name: "45" },
            { name: "46" },
            { name: "47" },
            { name: "48" },
            { name: "49" },
            { name: "50" },
          ],
          total: 50,
        },
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
              loading={false}
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
    await waitFor(async () => {
      expect(await screen.findByText("10")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("40")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("50")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });

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
        data: {
          results: [
            { name: "1" },
            { name: "2" },
            { name: "3" },
            { name: "4" },
            { name: "5" },
            { name: "6" },
            { name: "7" },
            { name: "8" },
            { name: "9" },
            { name: "10" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "11" },
            { name: "12" },
            { name: "13" },
            { name: "14" },
            { name: "15" },
            { name: "16" },
            { name: "17" },
            { name: "18" },
            { name: "19" },
            { name: "20" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "21" },
            { name: "22" },
            { name: "23" },
            { name: "24" },
            { name: "25" },
            { name: "26" },
            { name: "27" },
            { name: "28" },
            { name: "29" },
            { name: "30" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "31" },
            { name: "32" },
            { name: "33" },
            { name: "34" },
            { name: "35" },
            { name: "36" },
            { name: "37" },
            { name: "38" },
            { name: "39" },
            { name: "40" },
          ],
          total: 50,
        },
      })
      .mockResolvedValueOnce({
        data: {
          results: [
            { name: "41" },
            { name: "42" },
            { name: "43" },
            { name: "44" },
            { name: "45" },
            { name: "46" },
            { name: "47" },
            { name: "48" },
            { name: "49" },
            { name: "50" },
          ],
          total: 50,
        },
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
              loading={false}
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
    await waitFor(async () => {
      expect(await screen.findByText("10")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("20")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.getByText("30")).toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.queryByText("40")).not.toBeInTheDocument();
    });
    intersectionObserverMock.simulate({ intersectionRatio: 1 });
    await waitFor(() => {
      expect(screen.queryByText("50")).not.toBeInTheDocument();
    });

    expect(spyAxios).toHaveBeenCalledTimes(3);
    expect(spyAxios).toHaveBeenNthCalledWith(
      1,
      "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=10",
    );
  });
});
