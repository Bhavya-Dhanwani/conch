"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import Logo from "@/shared/components/Logo/Logo";
import { useAppDispatch } from "@/store/hooks";
import { setAuthError, setAuthStatus, setUser } from "@/shared/state/user/userActions";
import { createBackendApi } from "@/shared/config/api";
import styles from "./AuthExperience.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const backendApi = createBackendApi();

const fieldCopy = {
  login: {
    heading: "Welcome back",
    subtext: "Step back into CONCH and keep your systems moving with quiet precision.",
    cta: "Continue",
    endpoint: "/api/auth/login",
    success: "Welcome back. Your workspace is ready.",
    switchText: "New to CONCH?",
    switchLink: "Create an account",
    switchHref: "/signup",
  },
  signup: {
    heading: "Create your account",
    subtext: "Start with a calm control layer for errors, logs, deployments, and workflows.",
    cta: "Create account",
    endpoint: "/api/auth/signup",
    success: "Account created. Check your email when you are ready.",
    switchText: "Already have an account?",
    switchLink: "Sign in",
    switchHref: "/login",
  },
};

const signupSteps = [
  {
    id: "name",
    prompt: "What's your name?",
    type: "text",
    autoComplete: "name",
    placeholder: "Bhavya Dhanwani",
    error: "Tell us what to call you.",
  },
  {
    id: "email",
    prompt: "What's your email?",
    type: "email",
    autoComplete: "email",
    placeholder: "you@company.com",
    error: "Enter a valid email address.",
  },
  {
    id: "password",
    prompt: "Create a password",
    type: "password",
    autoComplete: "new-password",
    placeholder: "8+ characters",
    error: "Use at least 8 characters.",
  },
];

function getGithubUrl() {
  return `${backendApi.defaults.baseURL}/api/auth/github`;
}

function FloatingCard({ variant, className = "" }) {
  return (
    <div className={`${styles.floatCard} ${className}`} aria-hidden="true">
      {variant === "analytics" ? (
        <>
          <div className={styles.floatHeader}>
            <span>Runtime health</span>
            <strong>99.98%</strong>
          </div>
          <div className={styles.chartBars}>
            <i style={{ height: "42%" }} />
            <i style={{ height: "68%" }} />
            <i style={{ height: "56%" }} />
            <i style={{ height: "82%" }} />
            <i style={{ height: "63%" }} />
            <i style={{ height: "76%" }} />
          </div>
          <div className={styles.metricRow}>
            <span>Latency</span>
            <b>142ms</b>
          </div>
        </>
      ) : null}

      {variant === "errors" ? (
        <>
          <div className={styles.logTitle}>Error stream</div>
          <div className={styles.logLine}>
            <span className={styles.redDot} />
            <code>AuthRetryLoop</code>
          </div>
          <div className={styles.logLine}>
            <span className={styles.blueDot} />
            <code>Root cause mapped</code>
          </div>
          <div className={styles.traceGrid}>
            <span />
            <span />
            <span />
          </div>
        </>
      ) : null}

      {variant === "deploy" ? (
        <>
          <div className={styles.deployTop}>
            <span>Deployment</span>
            <b>Live</b>
          </div>
          <div className={styles.progressTrack}>
            <span />
          </div>
          <div className={styles.deploySteps}>
            <i />
            <i />
            <i />
          </div>
        </>
      ) : null}

      {variant === "workflow" ? (
        <>
          <div className={styles.workflowTitle}>Workflow</div>
          <div className={styles.nodeRow}>
            <span />
            <b>Ingest</b>
          </div>
          <div className={styles.nodeRow}>
            <span />
            <b>Assign</b>
          </div>
          <div className={styles.nodeRow}>
            <span />
            <b>Resolve</b>
          </div>
        </>
      ) : null}
    </div>
  );
}

function SignupOnboardingArt({ activeIndex = 0, onStepSelect }) {
  const flowStyle = {
    "--rail-shift": `${activeIndex * -112}px`,
    "--rail-shift-mobile": `${activeIndex * -84}px`,
  };
  const icons = ["👋", "👨‍💻", "👀", "🛠️", "🚀", "✓"];

  return (
    <div className={styles.signupArt} style={flowStyle} aria-label="Signup progress">
      <div className={styles.iconRailMask}>
        <div className={styles.iconRail}>
          {icons.map((icon, index) => {
            const stepIndex = Math.max(0, Math.min(index - 1, signupSteps.length - 1));
            const isActive = index === activeIndex + 1;
            const canGoBack = stepIndex < activeIndex;

            return (
              <button
                className={`${styles.railBubble} ${isActive ? styles.railBubbleMain : ""}`}
                key={`${icon}-${index}`}
                type="button"
                aria-label={canGoBack ? `Back to ${signupSteps[stepIndex].id}` : undefined}
                aria-current={isActive ? "step" : undefined}
                disabled={!canGoBack}
                onClick={() => {
                  if (canGoBack) {
                    onStepSelect(stepIndex);
                  }
                }}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AuthExperience({ mode = "login" }) {
  const dispatch = useAppDispatch();
  const copy = fieldCopy[mode] ?? fieldCopy.login;
  const isSignup = mode === "signup";
  const [values, setValues] = useState({ email: "", password: "", confirmPassword: "" });
  const [signupValues, setSignupValues] = useState({ name: "", email: "", password: "" });
  const [signupStep, setSignupStep] = useState(0);
  const [signupTouched, setSignupTouched] = useState(false);
  const [touched, setTouched] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const githubUrl = useMemo(() => getGithubUrl(), []);

  const errors = useMemo(() => {
    const nextErrors = {};

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (isSignup && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    return nextErrors;
  }, [isSignup, values]);

  const isValid = Object.keys(errors).length === 0;
  const isLoading = status === "loading";
  const activeSignupStep = signupSteps[signupStep];
  const activeSignupValue = signupValues[activeSignupStep?.id] ?? "";
  const signupStepError = useMemo(() => {
    if (!activeSignupStep) {
      return "";
    }

    if (activeSignupStep.id === "name") {
      return activeSignupValue.trim().length >= 2 ? "" : activeSignupStep.error;
    }

    if (activeSignupStep.id === "email") {
      return emailPattern.test(activeSignupValue) ? "" : activeSignupStep.error;
    }

    if (activeSignupStep.id === "password") {
      return activeSignupValue.length >= 8 ? "" : activeSignupStep.error;
    }

    return "";
  }, [activeSignupStep, activeSignupValue]);

  const updateField = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setServerMessage("");
    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const markTouched = (field) => () => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });

    if (!isValid || isLoading) {
      return;
    }

    setStatus("loading");
    setServerMessage("");
    dispatch(setAuthStatus("loading"));

    try {
      const payload = {
        email: values.email.trim(),
        password: values.password,
      };

      if (isSignup) {
        payload.name = values.email.split("@")[0] || "CONCH user";
      }

      const { data: result } = await backendApi.post(copy.endpoint, payload);

      if (result.success === false) {
        throw new Error(result.message || "Something went wrong. Try again.");
      }

      setStatus("success");
      dispatch(setUser(result.user || result.data?.user || null));
      dispatch(setAuthStatus("succeeded"));
      setServerMessage(copy.success);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setStatus("error");
      dispatch(setAuthError(message));
      setServerMessage(message);
    }
  };

  const handleSignupFlowSubmit = async (event) => {
    event.preventDefault();
    setSignupTouched(true);
    setServerMessage("");

    if (signupStepError || isLoading) {
      return;
    }

    if (signupStep < signupSteps.length - 1) {
      setSignupStep((current) => current + 1);
      setSignupTouched(false);
      return;
    }

    setStatus("loading");
    dispatch(setAuthStatus("loading"));

    try {
      const { data: result } = await backendApi.post(copy.endpoint, {
          name: signupValues.name.trim(),
          email: signupValues.email.trim(),
          password: signupValues.password,
      });

      if (result.success === false) {
        throw new Error(result.message || "Something went wrong. Try again.");
      }

      setStatus("success");
      dispatch(setUser(result.user || result.data?.user || null));
      dispatch(setAuthStatus("succeeded"));
      setServerMessage(copy.success);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      setStatus("error");
      dispatch(setAuthError(message));
      setServerMessage(message);
    }
  };

  if (isSignup) {
    return (
      <main className={styles.signupFlowPage}>
        <header className={styles.signupHeader}>
          <Link href="/" className={styles.signupLogo} aria-label="CONCH home">
            CONCH
          </Link>
          <div className={styles.signupProgress} aria-label={`Step ${signupStep + 1} of 3`}>
            {signupSteps.map((step, index) => (
              <span
                key={step.id}
                className={index === signupStep ? styles.signupProgressActive : ""}
              />
            ))}
          </div>
        </header>

        <form className={styles.signupQuestion} onSubmit={handleSignupFlowSubmit} noValidate>
          <div className={styles.signupStepContent} key={activeSignupStep.id}>
            <h1>{activeSignupStep.prompt}</h1>
            <input
              type={activeSignupStep.type}
              value={activeSignupValue}
              placeholder={activeSignupStep.placeholder}
              autoComplete={activeSignupStep.autoComplete}
              autoFocus
              aria-label={activeSignupStep.prompt}
              aria-invalid={Boolean(signupTouched && signupStepError)}
              onChange={(event) => {
                setSignupValues((current) => ({
                  ...current,
                  [activeSignupStep.id]: event.target.value,
                }));
                setSignupTouched(false);
                setServerMessage("");
                if (status !== "idle") {
                  setStatus("idle");
                }
              }}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading
                ? "Creating..."
                : signupStep === signupSteps.length - 1
                  ? "Create account"
                  : "Continue"}
            </button>
            <a className={styles.signupGithubButton} href={githubUrl}>
              <Image
                src="/github-mark.svg"
                alt=""
                width={26}
                height={26}
                className={styles.oauthMark}
              />
              Sign in with GitHub
            </a>
            {signupTouched && signupStepError ? (
              <p className={styles.signupError}>{signupStepError}</p>
            ) : null}
            {serverMessage ? (
              <p className={`${styles.signupStatus} ${styles[status]}`} role="status">
                {serverMessage}
              </p>
            ) : null}
          </div>
        </form>

        <SignupOnboardingArt
          activeIndex={signupStep}
          onStepSelect={(stepIndex) => {
            setSignupStep(stepIndex);
            setSignupTouched(false);
            setServerMessage("");
            if (status !== "idle") {
              setStatus("idle");
            }
          }}
        />

        <p className={styles.bottomSignin}>
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.scene} aria-hidden="true">
        <FloatingCard variant="analytics" className={styles.cardOne} />
        <FloatingCard variant="errors" className={styles.cardTwo} />
        <FloatingCard variant="deploy" className={styles.cardThree} />
        <FloatingCard variant="workflow" className={styles.cardFour} />
      </div>

      <section className={styles.card} aria-labelledby="auth-heading">
        <div className={styles.brand}>
          <Logo />
        </div>

        <div className={styles.intro}>
          <p className={styles.kicker}>Developer command center</p>
          <h1 id="auth-heading">{copy.heading}</h1>
          <p>{copy.subtext}</p>
        </div>

        <a
          className={styles.oauthButton}
          href={githubUrl}
        >
          <Image
            src="/github-mark.svg"
            alt=""
            width={26}
            height={26}
            className={styles.oauthMark}
          />
          Continue with GitHub
        </a>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label className={styles.field}>
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              value={values.email}
              onChange={updateField("email")}
              onBlur={markTouched("email")}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
              autoComplete="email"
            />
            {touched.email && errors.email ? (
              <small id="email-error">{errors.email}</small>
            ) : null}
          </label>

          <label className={styles.field}>
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={values.password}
              onChange={updateField("password")}
              onBlur={markTouched("password")}
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={touched.password && errors.password ? "password-error" : undefined}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
            {touched.password && errors.password ? (
              <small id="password-error">{errors.password}</small>
            ) : null}
          </label>

          {isSignup ? (
            <label className={styles.field}>
              <span>Confirm password</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={values.confirmPassword}
                onChange={updateField("confirmPassword")}
                onBlur={markTouched("confirmPassword")}
                aria-invalid={Boolean(touched.confirmPassword && errors.confirmPassword)}
                aria-describedby={
                  touched.confirmPassword && errors.confirmPassword
                    ? "confirm-password-error"
                    : undefined
                }
                autoComplete="new-password"
              />
              {touched.confirmPassword && errors.confirmPassword ? (
                <small id="confirm-password-error">{errors.confirmPassword}</small>
              ) : null}
            </label>
          ) : null}

          <button className={styles.primaryButton} type="submit" disabled={!isValid || isLoading}>
            {isLoading ? "Securing session..." : copy.cta}
          </button>

          {serverMessage ? (
            <p className={`${styles.statusMessage} ${styles[status]}`} role="status">
              {serverMessage}
            </p>
          ) : null}
        </form>

        <p className={styles.switcher}>
          {copy.switchText} <Link href={copy.switchHref}>{copy.switchLink}</Link>
        </p>
      </section>
    </main>
  );
}
