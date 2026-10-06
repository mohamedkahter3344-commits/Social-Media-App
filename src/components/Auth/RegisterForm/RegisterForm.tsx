import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  toast,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { schema, type RegisterFormSchema } from "../../../schema/register";
import type { RegisterFormData } from "../../../interfaces/authRegister";
import axios, { isAxiosError } from "axios";
import {  useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<RegisterFormSchema>({
    mode: "all",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "male",
      password: "",
      rePassword: "",
    },
    resolver: zodResolver(schema),
  });

  async function onSubmit(dataValues: RegisterFormData) {
    
    try {
      const { data } = await axios.post(
        "https://route-posts.routemisr.com/users/signup",
        dataValues,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(data);
      toast.success(data.message);
      navigate("/auth/login");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        toast.danger(error?.response?.data.message);
      } else {
        toast.danger("Somthing Went Wrong");
      }
    }
  }

  return (
    <div className="register">
      <div className="title">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Create a new account
        </h2>
        <p className="py-2 text-sm text-slate-500">It is quick and easy.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} action="" className="space-y-3">
        <Input
          fullWidth
          aria-label="Full Name"
          {...register("name")}
          type="text"
          placeholder="Enter your name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.name.message}
          </p>
        )}

        <Input
          {...register("username")}
          fullWidth
          aria-label="username"
          placeholder="Enter your username"
          type="text"
        />
        {errors.username && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.username.message}
          </p>
        )}

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

        <Input
          {...register("rePassword")}
          fullWidth
          aria-label="Confirm Password"
          placeholder="Enter confirm password"
          type="password"
        />
        {errors.rePassword && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.rePassword.message}
          </p>
        )}

        <Input
          {...register("dateOfBirth")}
          fullWidth
          aria-label="Date of Birth"
          placeholder="Enter your birthDay"
          type="date"
        />

        {errors.dateOfBirth && (
          <p className="text-red-600 text-sm font-bold mb-2">
            {errors.dateOfBirth.message}
          </p>
        )}

        <div className="flex flex-col gap-4">
          <RadioGroup name="gender" orientation="horizontal">
            <Radio {...register("gender")} value="male">
              <Radio.Content>
                <Radio.Control className="border border-slate-400">
                  <Radio.Indicator />
                </Radio.Control>
                Male
              </Radio.Content>
              {/* <Description>For side projects</Description> */}
            </Radio>

            <Radio {...register("gender")} value="female">
              <Radio.Content>
                <Radio.Control className="border border-slate-400">
                  <Radio.Indicator />
                </Radio.Control>
                Female
              </Radio.Content>
            </Radio>
          </RadioGroup>
          {errors.gender && (
            <p className="text-red-600 text-sm font-bold mb-2">
              {errors.gender.message}
            </p>
          )}
        </div>

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
              Create New Account
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;
