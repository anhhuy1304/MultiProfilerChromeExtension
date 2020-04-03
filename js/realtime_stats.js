window.RealtimeStats = {
    refresh: function (cb) {
        setTimeout(() => {
            cb();
        }, 500)
    }
};