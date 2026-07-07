import Link from 'next/link'
import { AuthForm } from '@/components/auth/auth-form'
import { AuthShell } from '@/components/auth/auth-shell'

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Nebula and start building your community in minutes."
    >
      <AuthForm mode="sign-up" />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/auth/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  )
}
