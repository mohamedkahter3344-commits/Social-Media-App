import { Button, Spinner, toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios, { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  changePasswordSchema,
  type ChangePasswordFormSchema,
} from "../../schema/changePassword";

import { useAuth } from "../../Context/TokenContext";

type ChangePasswordResponse = {
  message?: string;
  token?: string;
  data?: {
    token?: string;
  };
};

const Settings = () => {
  const { saveUserToken } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ChangePasswordFormSchema>({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (formData: ChangePasswordFormSchema) => {
      const { password, newPassword } = formData;

      return axios.patch<ChangePasswordResponse>(
        "https://route-posts.routemisr.com/users/change-password",
        {
          password,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
            "Content-Type": "application/json",
          },
        },
      );
    },

    onSuccess: (response) => {
      const responseData = response.data;

      // Adjust this path to match the actual API response.
      const newToken = responseData.token ?? responseData.data?.token;

      // Replace the old token if the API returns a new one.
      if (newToken) {
        saveUserToken(newToken);
      }

      toast.success(responseData.message || "Password changed successfully");

      reset();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.danger(
          error.response?.data?.message ||
            "Failed to change password. Please try again.",
        );
      } else {
        toast.danger("Something went wrong");
      }
    },
  });

  function handleChangePassword(data: ChangePasswordFormSchema) {
    mutate(data);
  }

  return (
    <main className="min-w-0">
      <div className="mx-auto max-w-2xl">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e7f3ff] text-[#1877f2]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
            </span>

            <div>
              <h1 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                Change Password
              </h1>

              <p className="text-sm text-slate-500">
                Keep your account secure by using a strong password.
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(handleChangePassword)}
            noValidate
            className="space-y-4"
          >
            {/* Current Password */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                Current password
              </span>

              <input
                {...register("password")}
                type="password"
                autoComplete="current-password"
                placeholder="Enter current password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
              />

              {errors.password && (
                <p className="mb-2 mt-1 text-sm font-bold text-red-600">
                  {errors.password.message}
                </p>
              )}
            </label>

            {/* New Password */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                New password
              </span>

              <input
                {...register("newPassword")}
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
              />

              {errors.newPassword && (
                <p className="mb-2 mt-1 text-sm font-bold text-red-600">
                  {errors.newPassword.message}
                </p>
              )}

              <span className="mt-1 block text-xs text-slate-500">
                At least 8 characters with uppercase, lowercase, number, and
                special character.
              </span>
            </label>

            {/* Confirm Password */}
            <label className="block">
              <span className="mb-1.5 block text-sm font-bold text-slate-700">
                Confirm new password
              </span>

              <input
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter new password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-[#1877f2] focus:bg-white"
              />

              {errors.confirmPassword && (
                <p className="mb-2 mt-1 text-sm font-bold text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </label>

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              isDisabled={!isValid || isPending}
              className="rounded-xl bg-[#0936a7] py-6 font-extrabold transition-all duration-300 hover:bg-[#052a86] disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Spinner color="current" size="sm" />
                  Updating password...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Settings;
