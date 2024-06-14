import { MultyDataloader } from "../src/index";

describe("MultyDataloader", () => {
  const batchFnMock = jest.fn();
  let loader: MultyDataloader<string>;

  beforeEach(() => {
    const exampleBatchLoadFn = (params) =>
      batchFnMock.mockImplementation(async (keys) => {
        return keys.map(
          (key) => `Data for ${key} with params ${JSON.stringify(params)}`
        );
      });

    loader = new MultyDataloader<string>(exampleBatchLoadFn);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should load data correctly with parameters", async () => {
    const params = { param1: "value1", param2: "value2" };
    const result = await loader.load("key1", params);
    expect(result).toStrictEqual(
      'Data for key1 with params {"param1":"value1","param2":"value2"}'
    );
  });

  it("should load data correctly without parameters", async () => {
    const result = await loader.load("key1");
    expect(result).toStrictEqual("Data for key1 with params undefined");
  });

  it("should cache data loaders based on parameters", async () => {
    const params1 = { param1: "value1", param2: "value2" };
    const params2 = { param1: "value1", param2: "value3" };

    const result1 = await loader.load("key1", params1);
    expect(result1).toStrictEqual(
      'Data for key1 with params {"param1":"value1","param2":"value2"}'
    );

    const result2 = await loader.load("key1", params2);
    expect(result2).toStrictEqual(
      'Data for key1 with params {"param1":"value1","param2":"value3"}'
    );

    const result3 = await loader.load("key1", params1);
    expect(result3).toStrictEqual(
      'Data for key1 with params {"param1":"value1","param2":"value2"}'
    );

    expect(batchFnMock).toHaveBeenCalledTimes(2);
  });

  it("should generate the same key for the same parameters in different order", () => {
    const params1 = { param1: "value1", param2: "value2" };
    const params2 = { param2: "value2", param1: "value1" };

    const key1 = (loader as any).objectToKey(params1);
    const key2 = (loader as any).objectToKey(params2);

    expect(key1).toStrictEqual(key2);
  });

  it("should create a new data loader for different parameters", async () => {
    const params1 = { param1: "value1", param2: "value2" };
    const params2 = { param1: "value3", param2: "value4" };

    const dataloader1 = (loader as any).getDataloader("key1", params1);
    const dataloader2 = (loader as any).getDataloader("key2", params2);

    expect(dataloader1).not.toStrictEqual(dataloader2);
  });
});
