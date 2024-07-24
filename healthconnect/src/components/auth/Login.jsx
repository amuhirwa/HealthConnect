import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import CreateAxiosInstance from "../../features/axios";
import toast, { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { addUserLogin } from "../../features/SharedData";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const instance = CreateAxiosInstance();
    const [remember, setRemember] = useState(true);
    const dispatch = useDispatch();
    const goto = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .required("Required"),
    }),
    onSubmit: (values) => {
      instance
        .post("/login", values)
        .then((response) => {
            console.log(response, remember)
          if (remember) {
              dispatch(addUserLogin(response.data));
          } else {
              sessionStorage.setItem("access", response.data.access);
          }
          goto('/dashboard')
        })
        .catch((error) => {
            console.log(error)
            if (error.response.data.non_field_errors) {
              toast.error('Invalid credentials.');
            }
            else{
                toast.error('Unexpected error occurred. Please try again later.');
            }
        });
    },
  });
  return (
    <div>
      <Toaster />
      <div className="logo my-[4vh] mt-[2vh] text-center sm:text-left">
        <span className="text-2xl text-[#12B536] sm:ml-10">
            <span className="text-[#2F4AD6]">Health</span>Connect
        </span>
        </div>
    <div className="main sm:flex">
      <div className="left w-1/2 mx-auto">
        <img src="/HealthConnect landing image.png" alt="" />
      </div>
      <div className="right sm:w-1/2">
      <div className="title">
        <h1 className="text-2xl sm:mt-[14vh] text-center font-semibold text-[#404660]">
          Sign In
        </h1>
        <p className="text-center text-[#40466088]">
          Welcome back to HealthConnect.
        </p>
      </div>
      <form
        id="form"
        className="flex flex-col w-full items-center justify-center text-[#404660] mx-auto"
        onSubmit={formik.handleSubmit}
      >
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          className="input-field w-2/3"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.errors.email && formik.touched.email ? 
          <p className="text-red-600 mt-[-8px]">{formik.errors.email}</p>
          : null}
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="input-field w-2/3"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
        {formik.errors.password && formik.touched.password ? 
          <p className="text-red-600 mt-[-8px]">{formik.errors.password}</p>
          : null}
      </form>
      <div className="terms text-center mt-[3vh]">
        <input type="checkbox" name="agree" id="agree" onClick={() => setRemember(!remember)} defaultChecked="true" className="" /> Remember me
      </div>
      <button
        className="bg-[#2F4AD6] w-2/3 hover:bg-blue-900 transition duration-300 text-white font-semibold py-2 px-4 rounded rounded-md mx-auto block mt-[2vh] mb-[3vh]"
        type="submit"
        form="form"
      >
        Sign In
      </button>
      <p className="text-center">
        Don't have an account?{" "}
        <Link className="text-[#2F4AD6]" to="/register">
          Sign Up
        </Link>
      </p>
      </div>
      </div>
    </div>
  );
}
