import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Spinner } from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import GoogleButton from "../components/GoogleButton";
import { signInFailure, signInInit, signInStart, signInSuccess } from "../redux/user/userSlice";

export default function Signin() {
  const [formData, setFormData] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(signInInit());
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const formHandle = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    try {
      if (!formData.email || !formData.password) {
        return dispatch(signInFailure("All fields are required"));
      }
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const resData = await res.json();
      if (!res.ok) {
        dispatch(signInFailure(resData.message));
      } else {
        dispatch(signInSuccess(resData));
        navigate("/");
      }
    } catch (e) {
      dispatch(signInFailure(e.message));
    }
  };

  return (
    <div className="min-h-[92vh] mt-5 flex items-center w-[100vw]">
      <div className="flex mx-auto flex-col md:flex-row items-center justify-center p-10 w-[100%]">
        <div className="flex flex-col px-10">
          <Link to="/" className="font-bold text-4xl">
            <h1>ALESTER</h1>
          </Link>
          <h1  className="mt-5">
            Explore the work of Alester Davis, a passionate fullstack developer
            committed to crafting dynamic, user-friendly web experiences. Dive
            into my projects, where creativity meets code, and read my blog for
            tips, tutorials, and the latest trends in web development. Join me
            on this exciting journey of continuous learning and innovation!
          </h1>
        </div>
        <div className="flex mt-5 flex-col justify-center min-w-[100%] md:min-w-[50%] px-10">
          <form className="flex flex-col gap-4" onSubmit={formHandle}>
              <Input
                type="email"
                placeholder="Email"
                id="email"
                onChange={changeHandler}
                variant="bordered"
                className=""
              />
              <Input
                type="password"
                placeholder="Password"
                id="password"
                onChange={changeHandler}
                variant="bordered"
                fullWidth
              />
            <Button color="primary" type="submit" disabled={loading} fullWidth>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign in"
              )}
            </Button>
            <GoogleButton />
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Didn't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign up
            </Link>
          </div>
          {/* <div>
            {error && <Alert type="error" className="mt-5">{error}</Alert>}
          </div> */}
        </div>
      </div>
    </div>
  );
}
