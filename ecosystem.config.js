module.exports = {
    apps: [
        {
            name: 'AT-USSD-AIRTIME-STANBIC',
            script: '/var/webapps/ussd-airtime-stanbic/index.js',
            args: '',
            instances: 1,
            autorestart: true,
            watch: true,
            ignore_watch: ['node_modules', 'public', 'logfiles'],
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production' || 'development',
            },
            env_production: {
                NODE_ENV: 'production' || 'development',
            },
            exec_mode: 'cluster',
            error_file: './logfiles/error_file.log',
            out_file: './logfiles/output_file.log',
            ref: 'origin/main',
            repo: 'https://github.com/DaggieBlanqx/ussd-airtime-stanbic.git',
        },
    ],
};
