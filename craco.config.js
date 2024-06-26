const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@/ui': path.resolve(__dirname, 'src/ui'),
            '@/lib': path.resolve(__dirname, 'src/lib'),
            '@/components': path.resolve(__dirname, 'src/components'),
        },
    },
};
