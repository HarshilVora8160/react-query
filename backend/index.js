const {app, startServer} = require('./app');

startServer().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`server is started on port ${process.env.PORT}`);
    })
})