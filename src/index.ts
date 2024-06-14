import DataLoader from "dataloader";
import * as crypto from "crypto";

type Params = Record<string, any>;
type MultyDataloaderBatchLoadFn<R> = (
  params?: Params
) => DataLoader.BatchLoadFn<unknown, R>;

/**
 * MultyDataloader is a utility class that provides dynamic creation and caching of DataLoader instances
 * based on different parameters. This allows for efficient batching and caching of data loading requests,
 * reducing duplicate queries and optimizing data fetching.
 *
 * @template R - The type of the data to be loaded.
 *
 * Usage:
 * const exampleBatchLoadFn: MultyDataloaderBatchLoadFn<string> = (params) => async (keys) => {
 *   // Use params and keys to load data
 *   return keys.map(key => `Data for ${key} with params ${JSON.stringify(params)}`);
 * };
 *
 * const loader = new MultyDataloader<string>(exampleBatchLoadFn);
 *
 * (async () => {
 *   const data1 = await loader.load('key1', { param1: 'value1', param2: 'value2' });
 *   console.log(data1); // Output: "Data for key1 with params {"param1":"value1","param2":"value2"}"
 * })();
 */

export class MultyDataloader<R> {
  private dataloaders: Record<string, DataLoader<unknown, unknown>> = {};

  constructor(private readonly batchLoadFn: MultyDataloaderBatchLoadFn<R>) {}

  public async load(mpid, params?: Params) {
    const key = params ? this.objectToKey(params) : "default";
    const dataLoader = this.getDataloader(key, params);

    return dataLoader.load(mpid);
  }

  private getDataloader(key: string, params?: Params) {
    const exist = this.dataloaders[key];
    if (exist) return exist;

    const dataloader = new DataLoader(this.batchLoadFn(params));

    this.dataloaders[key] = dataloader;

    return dataloader;
  }

  private objectToKey(obj: Params): string {
    const sortedObj = Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {} as Record<string, any>);

    return crypto
      .createHash("sha256")
      .update(JSON.stringify(sortedObj))
      .digest("hex");
  }
}
