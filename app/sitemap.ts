import { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://ezparquet.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    // 首页
    "",
    // 查看与探索
    "/parquet-viewer",
    "/sql-editor",
    "/parquet-schema-viewer",
    // 导出转换
    "/parquet-to-json",
    "/parquet-to-csv",
    "/parquet-to-tsv",
    "/parquet-to-excel",
    "/parquet-to-sql-mysql",
    "/parquet-to-sql-postgres",
    // 创建构建
    "/csv-to-parquet",
    "/json-to-parquet",
    "/excel-to-parquet",
    // 开发者指南
    "/guides/python-read-parquet",
    "/guides/python-convert-parquet",
    "/guides/python-write-parquet",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));
}
