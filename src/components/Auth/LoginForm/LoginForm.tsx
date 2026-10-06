import { Alert, Button, Input, Spinner, toast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { type LoginFormSchema, loginSchema } from "../../../schema/login";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LoginFormData } from "../../../interfaces/authLogin";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/TokenContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { saveUserToken } = useAuth();
  const [messageData, setMessageData] = useState("");

  useEffect(() => {
    if (!messageData) return;

    const timer = setTimeout(() => {
      setMessageData("");
    }, 5000);

    

    return () => clearTimeout(timer);
  }, [messageData]);

 
  
  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  async function Signin(dataValues: LoginFormData) {
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signin",
        dataValues,
      );

      console.log(data);
      console.log(dataValues);
      toast.success(data.message);
      saveUserToken(data.data.token);
      
      navigate("/");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setMessageData(error?.response?.data.message);
      } else {
        setMessageData("Somthing Went Wrong");
      }
    }
  }
  return (
    <div className="register">
      <div className="title">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Log in to Route Posts
        </h2>
        <p className="py-2 text-sm text-slate-500">
          Log in and continue your social journey.
        </p>
      </div>

      <form onSubmit={handleSubmit(Signin)} action="" className="space-y-4">
        <Input
          {...register("email")}
          fullWidth
          aria-label="Email"
          type="email"
          placeholder="Enter your email"
        />

        {errors.email && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.email?.message}
          </p>
        )}

        <Input
          {...register("password")}
          fullWidth
          aria-label="Password"
          placeholder="Enter your password"
          type="password"
        />

        {errors.password && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.password.message}
          </p>
        )}

        <Button
          type="submit"
          fullWidth
          className="rounded-xl hover:translate-y-1 transition-all font-extrabold py-6.25 duration-1000 hover:bg-[#052a86]  bg-[#0936a7]"
          isDisabled={!isValid || isSubmitting}
          isPending={isSubmitting}
        >
          {({ isPending }) => (
            <>
              {isPending ? <Spinner color="current" size="sm" /> : null}
              Sign In
            </>
          )}
        </Button>

        {messageData && (
          <Alert status="danger">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>{messageData}</Alert.Title>
            </Alert.Content>
          </Alert>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
