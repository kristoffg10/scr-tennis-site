module.exports = {
  apps: [
    {
      name: 'InLife Benefits V1 - CMS',
      port: 7072,
      exec_mode: 'cluster',
      instances: '2',
      max_memory_restart: '200M',
      script: '.output/server/index.mjs',
    },
  ]
};
