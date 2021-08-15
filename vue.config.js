module.exports = {
    pages: {
        index: {
            entry: './src/index/main.js',
            template: './public/index.html',
            filename: "index.html",
            title: 'Index',
            chunks: ["chunk-vendors","chunk-common","index"],
        },
        board: {
            entry: './src/board/main.js',
            template: './public/board.html',
            filename: 'board.html',
            title: 'Simulator',
            chunks: ["chunk-vendors","chunk-common","board"],
        }
    }
}
