onst jwtValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const register = async (req, res) => {
    try {
        const result = Joi.validate(req.body, userSchema);
        if (result.error) {
            return res.status(400).send({ message: result.error.details[0].message });
        }
        const user = await db().collection(tableName).findOne({ email: req.body.email })
        if (user) {
            return res.status(400).send({ message: 'User already exist' })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            DOB: req.body.DOB,
            mobile: req.body.mobile
        }
        const result2 = await db().collection(tableName).insertOne(newUser);
        if (result2.insertedCount === 0) {
            return res.status(400).send({ message: 'User already exist' })
        }
        return res.status(200).send({ message: 'User created successfully' })
    } catch (err) {
        return res.status(400).send({ message: err })
    }
}

const login = async (req, res) => {
    try {
        const result = Joi.validate(req.body, jwtValidationSchema);
        if (result.error) {
            return res.status(400).send({ message: result.error.details[0].message });
        }
        const user = await db().collection(tableName).findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)

=======

const jwtValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await db().collection(tableName).findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid Credentials' });
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid Credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY);
    return res.status(200).json({
        message: 'Login Successfully',
        token,
        user
    });
}

const register = async (req, res) => {
    const { name, email, password, DOB, mobile } = req.body;
    const user = await db().collection(tableName).findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db().collection(tableName).insertOne({
        name,
        email,
        password: hashedPassword,
        DOB,
        mobile
    });
    return res.status(201).json({
        message: 'User registered successfully',
        result,
        user: {
            name,
            email,
            DOB,
            mobile
        }
    });
}

const getAll = async (req, res) => {
    const users = await db().collection(tableName).find({}).toArray();
    return res.status(200).json({
        message: 'Users fetched successfully',
        users
    });
}

const getById = async (req, res) => {
    const { id } = req.params;
    const user = await db().collection(tableName).findOne({

=======

const jwtValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const loginValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const updateValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
    DOB: Joi.string().isoDate().required(),
    mobile: Joi.number().max(20).min(6)
})

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const comparePassword = async (password, hashPassword) => {
    return await bcrypt.compare(password, hashPassword);
}

const create = async (user) => {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    return await db().collection(tableName).insertOne(user);
}

const findByEmail = async (email) => {
    return await db().collection(tableName).findOne({ email });
}

const findById = async (id) => {
    return await db().collection(tableName).findOne({ _id: ObjectId(id) });
}

const update = async (id, user) => {
    const hashedPassword = await hashPassword(user.password);
    user.password = hashedPassword;
    return await db().collection(tableName).updateOne({ _id: ObjectId(id) }, { $set: user });
}

const remove = async (id) => {
    return await db().collection(tableName).deleteOne({ _id: ObjectId(id) });
}

=======

const jwtValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required(),
})

const getUser = async (id) => {
    const collection = await db().collection(tableName);
    return collection.findOne({ _id: ObjectId(id) });
}

const getUserByEmail = async (email) => {
    const collection = await db().collection(tableName);
    return collection.findOne({ email: email });
}

const getUserByEmailAndPassword = async (email, password) => {
    const collection = await db().collection(tableName);
    const user = await collection.findOne({ email: email });
    if (!user) return null;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;
    return user;
}

const createUser = async (user) => {
    const collection = await db().collection(tableName);
    const { password, ...userWithoutPassword } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userWithPassword = { ...userWithoutPassword, password: hashedPassword };
    await collection.insertOne(userWithPassword);
    return userWithPassword;
}

const updateUser = async (id, user) => {
    const collection = await db().collection(tableName);
    const { password, ...userWithoutPassword } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userWithPassword = { ...userWithoutPassword, password: hashedPassword };
    await collection.updateOne({ _id: ObjectId(id) }, { $set: userWithPassword });
    return userWithPassword;
}

const deleteUser = async (id) => {
    const collection = await db().collection(tableName);
    await collection.deleteOne({ _id: ObjectId(id) });
}

const login = async (email, password) => {
    const user = await getUserByEmailAndPassword(email, password);

=======

const jwtValidationSchema = Joi.object({
    email: Joi.string().min(10).max(100).required(),
    password: Joi.string().min(8).max(100).required()
})

const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validatePassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return re.test(String(password));
}

const validate = async (decoded, req) => {
    try {
        const user = await db().collection(tableName).findOne({ email: decoded.email });
        if (user.email === decoded.email) {
            req.token = decoded;
            return { isValid: true }
        }

        return { isValid: false }
    } catch (err) {
        console.log(err);
        return { isValid: false, errorMessage: 'Something wrong try again later' };

    }
}

const signup = async (req, h) => {
    const { error } = Joi.validate(req.payload, userSchema);
    if (error) {
        return h.response({
            status: 400,
            message: error.details[0].message,
            data: null
        }).code(400);
    }

    const { name, email

=======