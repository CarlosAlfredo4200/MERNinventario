const handleHttpError = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    res.json({ error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
     });
     
  };
  
  module.exports = handleHttpError;