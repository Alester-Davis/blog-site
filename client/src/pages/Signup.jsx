import { Link, useNavigate } from "react-router-dom";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GoogleButton from "../components/GoogleButton";

export default function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

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
    setError(null);
    setLoading(true);

    try {
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        !formData.passwordConform
      ) {
        setLoading(false);
        return setError("All fields are required");
      }

      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const resData = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(resData.message);
      } else {
        navigate("/sign-in");
      }
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[92vh] mt-5 flex items-center w-[100vw]">
      <div className="flex mx-auto flex-col md:flex-row items-center justify-center p-10 w-[100%]">
        <div className="flex flex-col px-10">
          <Link to="/" className="font-bold text-4xl">
            <h1>ALESTER</h1>
          </Link>
          <p className="mt-5 text-sm">
            This is a demo project. You can sign up with email and password or
            with Google.
          </p>
        </div>
        <div className="flex mt-5 flex-col justify-center min-w-[100%] md:min-w-[50%] px-10">
          <form className="flex flex-col gap-4" onSubmit={formHandle}>
            <div>
              <Label value="Your username" />
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={changeHandler}
              />
            </div>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={changeHandler}
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={changeHandler}
              />
            </div>
            <div>
              <Label value="Confirm password" />
              <TextInput
                type="password"
                placeholder="Confirm Password"
                id="passwordConform"
                onChange={changeHandler}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              onClick={formHandle}
              disabled={loading}
              fullWidth
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <GoogleButton />
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-500">
              Sign in
            </Link>
          </div>
          {error && <Alert className="mt-5" color="failure">{error}</Alert>}
        </div>
      </div>
    </div>
  );
}
