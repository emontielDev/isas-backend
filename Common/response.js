module.exports.Created = (response, entity) => {
    return response.status(201).send(entity);
};

module.exports.BadRequest = (response, entity) => {
    return response.status(400).json(entity);
};

module.exports.NotFound = (response, mensaje) => {
    return response.status(404).json({ mensaje });
};

module.exports.Exception = (response, e) => {
    response.status(500).send(e);
};

module.exports.Ok = (response, object) => {
    return response.status(200).json(object);
};