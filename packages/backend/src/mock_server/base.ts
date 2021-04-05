// rue packages
import { Config$Base as Config } from '@rue/config';

// third party
const AgreedServer = require('@agreed/server');

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
        return -1;
      } else {
        return 1;
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
}
