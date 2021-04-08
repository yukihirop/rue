// rue/packages
import { Config$Base as Config } from '@rue/config';

// builtin
import path from 'path';
import fs from 'fs';

// third party
import globby from 'globby';
import pkgDir from 'pkg-dir';

// types
import type * as t from './types';

const projectRoot = pkgDir.sync() || process.cwd();
const mockServer = Config.backend.mock_server;

export class Generator$MockServer$Base {
  static projectRoot: string = projectRoot;
  private data: t.MockServerData[];

  static async generateDB() {
    const instance = new Generator$MockServer$Base();
    return instance.generateDB();
  }

  static async generateRoutes() {
    const instance = new Generator$MockServer$Base();
    return instance.generateRoutes();
  }

  private async loadData() {
    const { loadData } = mockServer;

    const paths = await globby(loadData, {
      cwd: projectRoot,
      gitignore: true,
    });

    const { dist } = mockServer;
    const distDBDirPath = path.dirname(dist.db);
    const distRoutesDirPath = path.dirname(dist.routes);

    if (!fs.existsSync(distDBDirPath)) fs.mkdirSync(distDBDirPath, { recursive: true });
    if (!fs.existsSync(distRoutesDirPath)) fs.mkdirSync(distRoutesDirPath, { recursive: true });

    const result = [] as t.MockServerData[];
    paths.forEach((filePath) => {
      const fullPath = path.resolve(projectRoot, filePath);
      const mockData: t.MockServerData | t.MockServerData[] = require(fullPath);

      if (Array.isArray(mockData)) {
        mockData.forEach((item) => {
          result.push(item);
        });
      } else {
        result.push(mockData);
      }
    });

    this.data = result;
  }

  private async generateDB() {
    if (!this.data) await this.loadData();

    const { dist } = mockServer;
    const db = this.data.map(this.transformToAgreedData.bind(this));
    const distDBPath = path.join(projectRoot, dist.db);
    const relativeDistDBPath = path.relative(projectRoot, distDBPath);
    fs.writeFile(distDBPath, JSON.stringify(db), (err) => {
      if (err) throw err;
      console.log(`✨[Rue] '${relativeDistDBPath}' updated.`);
    });
  }

  private async generateRoutes() {
    if (!this.data) await this.loadData();

    const routes = {} as t.MockServerRoutes;
    this.data.forEach(
      ({ resource, request }: { resource: string; request: t.MockServerData['request'] }) => {
        const { method, path: requestPath, query, pathRegexp, queryRegexp } = request;

        // update count
        let pathWithQueryRegexp = pathRegexp;

        if (queryRegexp) pathWithQueryRegexp = `${pathRegexp}?${queryRegexp}`;
        if (routes[method]) {
          if (routes[method][pathWithQueryRegexp]) {
            routes[method][pathWithQueryRegexp].count =
              routes[method][pathWithQueryRegexp].count + 1;
          } else {
            routes[method][pathWithQueryRegexp] = { count: 1, paths: [], resource };
          }
        } else {
          routes[method] = { [pathWithQueryRegexp]: { count: 1, paths: [], resource } };
        }

        let pathWithQuery;
        if (query) {
          pathWithQuery = `${requestPath}?${Generator$MockServer$Base.paramsToQueryString(
            query
          )}`;
        } else {
          pathWithQuery = requestPath;
        }

        // update paths
        routes[method][pathWithQueryRegexp].paths.push(pathWithQuery);
      }
    );

    const { dist } = mockServer;
    const distRoutesPath = path.join(projectRoot, dist.routes);
    const relativeDistRoutesPath = path.relative(projectRoot, distRoutesPath);
    fs.writeFile(distRoutesPath, JSON.stringify(routes), (err) => {
      if (err) throw err;
      console.log(`✨[Rue] '${relativeDistRoutesPath}' updated.`);
    });
  }

  private transformToAgreedData(data: t.MockServerData): t.MockServerAgreedData {
    return {
      request: {
        path: data.request.path,
        method: data.request.method,
        query: this.transformValueToString(data.request.query),
        body: data.request.body,
      },
      response: {
        headers: data.response.headers,
        body: data.response.body,
      },
    };
  }

  private static paramsToQueryString(params): string {
    return Object.entries(params)
      .map((e) => `${e[0]}=${e[1]}`)
      .join('=');
  }

  /**
   * The query string should be a string, not a number.
   */
  private transformValueToString(params: Record<string, any>) {
    const isNumber = function (value) {
      return typeof value === 'number' && isFinite(value);
    };

    if (params) {
      return Object.keys(params).reduce((acc, key) => {
        let value = params[key];
        if (isNumber(value)) value = String(value);

        acc[key] = value;

        return acc;
      }, {});
    } else {
      return params;
    }
  }
}
