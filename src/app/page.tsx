"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated } from "convex/react";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
      <div>
        <Authenticated>
          Logged in!
        <Button onClick={() => signOut()}>
          Sign Out 
        </Button>
        </Authenticated>
      </div>
  );
};

