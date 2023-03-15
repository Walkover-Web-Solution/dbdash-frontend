import { React, useContext, createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import PropTypes from "prop-types";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithPopup,
  getAdditionalUserInfo
} from "firebase/auth";
import { signUpUser, loginUser } from "../api/userApi"
import { useNavigate } from "react-router-dom";
import { saveUser } from "../store/user/userThunk.js";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({});

const navigate=useNavigate();
const dispatch = useDispatch();

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userInfo = await signInWithPopup(auth, provider);
      if ((getAdditionalUserInfo(userInfo))?.isNewUser) {
        const displayName = userInfo?.user?.displayName;
        const email = userInfo?.user?.email;
        const dataToSend = {
          "email": email,
          "first_name": displayName.split(" ")[0],
          last_name: displayName.split(" ")[1] || " ",
        }
        const token = await signUpUser(dataToSend)
        localStorage.setItem('accessToken', token.data.data)
        await dispatch(saveUser());
        navigate("/dashboard")
        return;
      }
      const token = await loginUser({ email: userInfo?.user?.email });
      if (token.data.data) {
        localStorage.setItem("accessToken", token.data.data);
        await dispatch(saveUser());
        navigate("/dashboard")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signUp = async (email, password, firstName, lastName) => {
    try {
      const userInfo = await createUserWithEmailAndPassword(auth, email, password);
      if (userInfo) {
        const dataToSend = {
          "email": email,
          "first_name": firstName,
          "last_name": lastName
        }
        const token = await signUpUser(dataToSend)

        localStorage.setItem('accessToken', token.data.data)
        await dispatch(saveUser());
        navigate("/dashboard")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const token = await loginUser({ email: email });
      if (token.data.data) {
        localStorage.setItem('accessToken', token.data.data);
        await dispatch(saveUser());
        navigate("/dashboard")
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  const logOut = () => {
    signOut(auth);
    localStorage.removeItem('accessToken');
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      setUser(currentUser);
    });
    return async () => {
      await unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, signUp, logOut, signIn, googleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const res= useContext(AuthContext);
  return res;
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

