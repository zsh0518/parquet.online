import * as duckdb from "@duckdb/duckdb-wasm";

// 定义单例引用
let dbInstance: Promise<duckdb.AsyncDuckDB> | null = null;

// 使用 JSDelivr CDN 加载 Wasm 文件，避免 Next.js Webpack 复杂配置
const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();

export const getDuckDB = async () => {
  // 如果已经初始化过，直接返回
  if (dbInstance) {
    return dbInstance;
  }

  // 初始化 Promise
  dbInstance = (async () => {
    // 1. 选择最佳的 Wasm 包（根据浏览器支持情况自动选择 eh 或 mvp 版本）
    const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

    // 2. 创建 Worker
    const worker_url = URL.createObjectURL(
      new Blob([`importScripts("${bundle.mainWorker!}");`], {
        type: "text/javascript",
      })
    );

    // 3. 实例化 Worker
    const worker = new Worker(worker_url);
    const logger = new duckdb.ConsoleLogger();
    const db = new duckdb.AsyncDuckDB(logger, worker);

    // 4. 实例化 Wasm
    await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

    // 5. 释放 URL 对象
    URL.revokeObjectURL(worker_url);

    return db;
  })();

  return dbInstance;
};

// 工具函数：处理 BigInt 序列化问题 (Parquet 中很多数字是 BigInt)
export const jsonStringifyWithBigInt = (data: any) => {
  return JSON.stringify(data, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
};
