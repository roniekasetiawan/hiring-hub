"use client";
import AuthSplit from "@/@core/layouts/AuthSplit";
import {
  Alert,
  Button,
  Stack,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { authService } from "@/services/auth.service";

const Schema = z.object({
  full_name: z.string().min(2, "Too short").max(60).optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters"),
  role: z.enum(["applicant", "admin"], {
    error: "Please select a role",
  }),
});
type FormValues = z.infer<typeof Schema>;

export default function RegisterPage() {
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      role: "applicant",
    },
  });
  const router = useRouter();

  const onSubmit = async (v: FormValues) => {
    setErrMsg(null);
    setInfoMsg(null);
    try {
      await authService.signup(v.email, v.password, v.role, v.full_name);
      router.replace("/dashboard");
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Sign up failed";
      setErrMsg(msg);
    }
  };

  return (
    <AuthSplit title="Create your account" subtitle="It’s fast and free.">
      <Stack
        component="form"
        gap={2.5}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {errMsg && <Alert severity="error">{errMsg}</Alert>}
        {infoMsg && <Alert severity="info">{infoMsg}</Alert>}

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value}
              exclusive
              onChange={(e, newValue) => {
                if (newValue !== null) {
                  field.onChange(newValue);
                }
              }}
              aria-label="role selection"
              fullWidth
            >
              <ToggleButton
                value="applicant"
                sx={{ textTransform: "none", flexGrow: 1 }}
              >
                Pencari Kerja
              </ToggleButton>
              <ToggleButton
                value="admin"
                sx={{ textTransform: "none", flexGrow: 1 }}
              >
                Pemberi Kerja
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />

        <TextField
          {...register("full_name")}
          error={!!errors.full_name}
          placeholder="Full Name (Optional)"
          helperText={errors.full_name?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="email"
          placeholder="E-mail"
          autoComplete="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MailOutlineIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message ?? "Minimum 6 characters."}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 1 }}
        >
          {isSubmitting ? "Creating…" : "Create account"}
        </Button>

        <Stack direction="row" gap={1} justifyContent="center" sx={{ mt: 1 }}>
          <Typography variant="body2">Already have an account?</Typography>
          <Typography
            component={NextLink}
            href="/login"
            variant="body2"
            sx={{ fontWeight: "bold", textDecoration: "none" }}
          >
            Sign in
          </Typography>
        </Stack>
      </Stack>
    </AuthSplit>
  );
}
