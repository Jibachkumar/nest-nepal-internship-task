import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

// helper function
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    console.log(accessToken, refreshToken)

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message
    );
    
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

  if (
    [name, email, password].some(
      (field) => typeof field === "string" && field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

    // check user already exit
    const existedUser = await User.findOne({ email });

    if (existedUser) {
      throw new ApiError(409, "User with email is already exits");
    }

    // create user
    const user = await User.create({
      name: name.toLowerCase(),
      email,
      password,
      role
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user"
      );
    }

    return res
      .status(201)
      .json({ createdUser, message: "User register Successfully " });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password ) {
    throw new ApiError(400, "email is required");
  }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Password is Incorrect");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    console.log("accessToken: ", accessToken, "refreshToken:" ,refreshToken)

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };
    
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: { loggedInUser, accessToken, refreshToken },
        message: "User logged In Successfully",
      });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};



export { registerUser, loginUser }