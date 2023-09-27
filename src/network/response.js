const success = (props) => {
    props.res.status(props.status || 200).json({
        error: false,
        status: props.status || 200,
        body: props.body || ""
    });
};

const error = (props) => {
    console.log('props :>> ', props);
    props.res.status(props.status || 500).json({
        error: true,
        status: props.status || 500,
        body: props.body || ""
    });
};

module.exports = {
    success,
    error
}