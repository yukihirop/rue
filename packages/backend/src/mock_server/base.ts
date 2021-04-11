// rue packages
import { Config$Base as Config } from '@ruejs/config';

// third party
const AgreedServer = require('@agreed/server');
import chalk from 'chalk';

// builtin
import path from 'path';

// types
import type * as t from './types';

const projectRoot = require('pkg-dir').sync() || process.cwd();
const mockServer = Config.backend.mock_server;

export class Backend$MockServer$Base {
  /**
   * @see https://github.com/recruit-tech/agreed/blob/master/packages/server/index.js
   */
  static createServer(opts: t.AgreedServerOptions) {
    const fullPath = path.resolve(projectRoot, mockServer.dist.db);
    const merged = Object.assign(opts, {
      path: fullPath,
      enablePreferQuery: true,
    });
    AgreedServer(merged).createServer();
  }

  static printAvailableResources(opts: { port: number }) {
    const fullPath = path.resolve(projectRoot, mockServer.dist.routes);
    const routes = require(fullPath);

    let resourceMaxLen = 0;
    const availabes = Object.keys(routes).reduce((acc, method) => {
      const uriData = routes[method];
      Object.keys(uriData).forEach((uri: string) => {
        uriData[uri].paths.forEach((p: string) => {
          const resource = uriData[uri].resource as string;
          if (resource.length > resourceMaxLen) {
            resourceMaxLen = resource.length;
          }
          const urlWithQuery = `http://localhost:${opts.port}${p}`;
          const formatFn = this.formatResourceFn(resource, method, urlWithQuery);
          acc.push([resource, formatFn]);
        });
      });
      return acc;
    }, [] as any);

    const sortedAvailabes = availabes.sort((a, b) => {
      if (a[0] > b[0]) {
        return 1;
      } else {
        return -1;
      }
    });

    const space = '    ';
    const styledTitle = chalk.bold.underline('Resources');
    const formatedMessage = sortedAvailabes
      .map((r) => r[1])
      .map((formatFn) => formatFn(resourceMaxLen))
      .join(`\n${space}`);

    console.log(`
${space}${styledTitle}

${space}${formatedMessage}
    `);
  }

  static printTable(opts?: { method: string; resource: string }) {
    const fullPath = path.resolve(projectRoot, mockServer.dist.routes);
    const routes = require(fullPath);
    const isDisplayAllPath = !!opts.resource;

    const tableData = Object.keys(routes).reduce((acc, method) => {
      const uriData = routes[method];
      Object.keys(uriData).forEach((uri: string) => {
        if (isDisplayAllPath) {
          uriData[uri].paths.forEach((p: string) => {
            const route = {
              method: method as t.MockServerHttpMethod,
              resource: uriData[uri].resource as string,
              'uri pattern': uri,
              path: p,
            };
            acc.push(route);
          });
        } else {
          const route = {
            method: method as t.MockServerHttpMethod,
            resource: uriData[uri].resource as string,
            'uri pattern': uri,
            count: uriData[uri].count as number,
          };
          acc.push(route);
        }
      });
      return acc;
    }, [] as t.MockServerRoute[]);

    let sorted = tableData.sort((a, b) => {
      if (a.resource > b.resource) {
        return 1;
      } else {
        return -1;
      }
    });

    if (opts.method) {
      sorted = sorted.filter((r) => r.method === opts.method);
    }

    if (opts.resource) {
      sorted = sorted.filter((r) => r.resource === opts.resource);
    }

    console.table(sorted);
  }

  private static formatResourceFn(
    resource: string,
    method: string,
    urlWithQuery: string
  ): (padding: number) => string {
    // This is Swagger/UI(Editor) Color
    const methodColorMapFn = {
      GET: chalk.bgRgb(97, 175, 254)(chalk.white.bold('GET')),
      POST: chalk.bgRgb(73, 204, 144)(chalk.black.bold('POST')),
      PATCH: chalk.bgRgb(80, 227, 194)(chalk.black.bold('PATCH')),
      PUT: chalk.bgRgb(252, 161, 48)(chalk.black.bold('PUT')),
      DELETE: chalk.bgRgb(249, 62, 62)(chalk.white.bold('DELETE')),
    };
    return (padding: number) => {
      const styledResource = chalk.bold(resource.padStart(padding, ' '));
      const styledMethod = methodColorMapFn[method];
      // 6 is DELETE length
      const styledUrlWithQuery = `${' '.repeat(6 - method.length)}${urlWithQuery}`;
      return `${styledResource} | ${styledMethod} ${styledUrlWithQuery}`;
    };
  }
}
