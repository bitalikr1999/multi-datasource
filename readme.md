  MultyDataloader

MultyDataloader
===============

MultyDataloader is a utility class that provides dynamic creation and caching of DataLoader instances based on different parameters. This allows for efficient batching and caching of data loading requests, reducing duplicate queries and optimizing data fetching.

Installation
------------

To install MultyDataloader using npm:

    npm install multydataloader
    

Or using yarn:

    yarn add multydataloader
    

Usage
-----

### Basic Example

First, import the necessary modules and types:

    import DataLoader from "dataloader";
    import MultyDataloader, { MultyDataloaderBatchLoadFn } from "multydataloader";
    

Define a batch loading function that uses the provided parameters and keys to load data. Then, create an instance of `MultyDataloader` and use it to load data with different parameters:

    const exampleBatchLoadFn: MultyDataloaderBatchLoadFn = (params) => async (keys) => {
      // Use params and keys to load data
      return keys.map(key => `Data for ${key} with params ${JSON.stringify(params)}`);
    };
    
    const loader = new MultyDataloader(exampleBatchLoadFn);
    
    (async () => {
      const data1 = await loader.load('key1', { param1: 'value1', param2: 'value2' });
      console.log(data1); // Output: "Data for key1 with params {"param1":"value1","param2":"value2"}"
    })();
    

API
---

### `MultyDataloader<R>`

#### Constructor

    constructor(batchLoadFn: MultyDataloaderBatchLoadFn<R>)
    

*   `batchLoadFn`: A function that generates a batch load function for DataLoader instances. It takes an optional `params` object and returns a `DataLoader.BatchLoadFn`.

#### Methods

##### `load(mpid: unknown, params?: Params): Promise<R>`

Loads data using the specified `mpid` and optional `params`.

*   `mpid`: The key to be loaded by the DataLoader.
*   `params`: Optional parameters to customize the DataLoader instance.

##### `private getDataloader(key: string, params?: Params): DataLoader<unknown, R>`

Gets an existing DataLoader instance or creates a new one based on the provided `key` and `params`.

##### `private objectToKey(obj: Params): string`

Generates a unique key string from the provided `params` object by sorting its keys and creating a SHA-256 hash.

License
-------

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.