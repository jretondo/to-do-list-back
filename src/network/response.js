const success = (props) => {
    props.res.status(props.status || 200).json({
        error: false,
        body: props.body || ""
    });
};

const error = (props) => {
    props.res.status(props.status || 500).json({
        error: true,
        body: props.body || ""
    });
};

module.exports = {
    success,
    error
}