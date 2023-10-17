const validatorRegisterlUser = (req, res, next) => {
    const body = req.body;


    const { name, email, password } = body;


    //Validations
    if (!name) {
      const error = new Error('Name required!');
      return res.status(404).json({ msg: error.message });
    }

    if (!email) {
      const error = new Error('Email required');
      return res.status(404).json({ msg: error.message });
    }

    if (!password) {
      const error = new Error('Password required');
      return res.status(404).json({ msg: error.message });
    }

    if (password.length < 6) {
      const error = new Error('Password must be up to 6 characters');
      return res.status(400).json({ msg: error.message });

    }

    next();
     
  };


  const validatorLoginlUser = (req, res, next) => {
    const body = req.body;


    const { email, password } = body;


    //Validations
   
    if (!email) {
      const error = new Error('Email required');
      return res.status(404).json({ msg: error.message });
    }

    if (!password) {
      const error = new Error('Password required');
      return res.status(404).json({ msg: error.message });
    }

    if (password.length < 6) {
      const error = new Error('Password must be up to 6 characters');
      return res.status(400).json({ msg: error.message });

    }

    next();
     
  };
  
  module.exports = {
    validatorRegisterlUser,
    validatorLoginlUser
  };