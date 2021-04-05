module.exports = [
  {
    resource: 'task',
    request: {
      method: 'GET',
      path: '/api/v1/tasks',
      pathRegexp: '/api/v1/tasks',
    },
    response: {
      body: [
        { id: 1, content: 'Create @rue of web micro framework', status: 'wip', accountId: 1 },
        { id: 2, content: 'Update r2-oas gem', status: 'success', accountId: 1 },
        { id: 3, content: 'Work since morning', status: 'failure', accountId: 2 },
        { id: 4, content: 'Get it done to the end', status: 'wip', accountId: 2 },
      ],
    },
  },
  {
    resource: 'task',
    request: {
      method: 'GET',
      path: '/api/v1/tasks/1',
      pathRegexp: '/api/v1/tasks/:task_id',
    },
    response: {
      body: [{ id: 1, content: 'Create @rue of web micro framework', status: 'wip', accountId: 1 }],
    },
  },
  {
    resource: 'task',
    request: {
      method: 'GET',
      path: '/api/v1/tasks/2',
      pathRegexp: '/api/v1/tasks/:task_id',
    },
    response: {
      body: [{ id: 2, content: 'Update r2-oas gem', status: 'success', accountId: 1 }],
    },
  },
  {
    resource: 'task',
    request: {
      method: 'GET',
      path: '/api/v1/tasks/3',
      pathRegexp: '/api/v1/tasks/:task_id',
    },
    response: {
      body: [{ id: 3, content: 'Work since morning', status: 'failure', accountId: 2 }],
    },
  },
  {
    resource: 'task',
    request: {
      method: 'GET',
      path: '/api/v1/tasks/4',
      pathRegexp: '/api/v1/tasks/:task_id',
    },
    response: {
      body: [{ id: 4, content: 'Get it done to the end', status: 'wip', accountId: 2 }],
    },
  },
];
