import AuthExperience from "@/features/auth/components/AuthExperience";

export const metadata = {
  title: "Login | CONCH",
  description: "Sign in to CONCH.",
};

export default function LoginPage() {
  return <AuthExperience mode="login" />;
}
