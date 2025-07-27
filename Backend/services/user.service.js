import userModel from '../models/user.model.js';

const createUser = async ({ firstname, lastname, email, password }) => {
    const user = await userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
    });
    return user;
};

export default createUser;
