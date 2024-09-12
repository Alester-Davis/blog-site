import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, Button, Spinner} from "@nextui-org/react";
import { useSelector } from "react-redux";
import GoogleButton from "../components/GoogleButton";
import toast, { Toaster } from "react-hot-toast";
import { Alert } from "flowbite-react";

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
      if(formData.username.length<7||formData.username.length>20){
        setLoading(false);
        return setError("Username length should be between 7 and 20");
      }
      if (formData.password !== formData.passwordConform) {
        setLoading(false);
        return setError("Passwords do not match");
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
        return navigate("/sign-in", { state: { successMessage: "Signed up successfully" } });
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
          <h1 className="mt-5">
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
              type="text"
              placeholder="Username"
              id="username"
              onChange={changeHandler}
              variant="bordered"
              fullWidth
            />
            <Input
              type="email"
              placeholder="Email"
              id="email"
              onChange={changeHandler}
              variant="bordered"
              fullWidth
            />
            <Input
              type="password"
              placeholder="Password"
              id="password"
              onChange={changeHandler}
              variant="bordered"
              fullWidth
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              id="passwordConform"
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
          {error && <Alert color="failure" className="mt-5">{error}</Alert>}
        </div>
      </div>
      {/* <Toaster position="bottom-right" reverseOrder={false} /> */}
    </div>
  );
}
